from flask import Blueprint, request, jsonify
from datetime import datetime
import threading
import time
from app import db
from app.models.training import TrainingTask, Model
from app.models.dataset import Dataset

training_bp = Blueprint('training', __name__)

@training_bp.route('/tasks', methods=['GET'])
def get_tasks():
    """获取训练任务列表"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    query = TrainingTask.query
    pagination = query.order_by(TrainingTask.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)
    
    task_list = []
    for task in pagination.items:
        task_dict = task.to_dict()
        if task.dataset_id:
            dataset = Dataset.query.get(task.dataset_id)
            task_dict['dataset_name'] = dataset.name if dataset else ''
        task_list.append(task_dict)
    
    return jsonify({
        'code': 200,
        'data': {
            'list': task_list,
            'total': pagination.total
        }
    })

@training_bp.route('/tasks', methods=['POST'])
def create_task():
    """创建训练任务"""
    data = request.get_json()
    
    # 创建任务
    task = TrainingTask(
        name=data['name'],
        dataset_id=data['dataset_id'],
        task_type=data.get('task_type', 'detection'),
        model_architecture=data.get('model_architecture', 'yolov5'),
        config=data.get('config', {}),
        total_epochs=data.get('total_epochs', 100),
        gpu_device=data.get('gpu_device', '0'),
        priority=data.get('priority', 0),
        owner_id=data.get('owner_id', 1),
        status='pending'
    )
    
    # 计算进度
    task.progress = 0
    task.current_epoch = 0
    
    db.session.add(task)
    db.session.commit()
    
    # 模拟启动训练线程
    def run_training(task_id):
        with training_bp.app_context():
            training_task = TrainingTask.query.get(task_id)
            training_task.status = 'running'
            training_task.started_at = datetime.now()
            db.session.commit()
            
            # 模拟训练过程
            for epoch in range(1, training_task.total_epochs + 1):
                training_task.current_epoch = epoch
                training_task.progress = int(epoch / training_task.total_epochs * 100)
                
                # 模拟指标
                loss = 1.0 - (epoch / training_task.total_epochs) * 0.8
                accuracy = 70 + (epoch / training_task.total_epochs) * 25
                
                import json
                existing_metrics = json.loads(training_task.metrics) if training_task.metrics else {'loss': [], 'accuracy': []}
                existing_metrics['loss'].append(round(loss, 4))
                existing_metrics['accuracy'].append(round(accuracy, 2))
                training_task.metrics = json.dumps(existing_metrics)
                
                db.session.commit()
                time.sleep(1)
            
            # 训练完成
            training_task.status = 'completed'
            training_task.completed_at = datetime.now()
            training_task.progress = 100
            
            # 创建模型
            model = Model(
                name=training_task.name,
                version='v1',
                task_type=training_task.task_type,
                architecture=training_task.model_architecture,
                metrics=training_task.metrics,
                status='trained',
                owner_id=training_task.owner_id
            )
            db.session.add(model)
            db.session.commit()
    
    # 启动后台线程
    thread = threading.Thread(target=run_training, args=(task.id,))
    thread.daemon = True
    thread.start()
    
    return jsonify({'code': 200, 'data': task.to_dict()})

@training_bp.route('/tasks/<int:id>', methods=['GET'])
def get_task(id):
    """获取任务详情"""
    task = TrainingTask.query.get_or_404(id)
    task_dict = task.to_dict()
    
    if task.dataset_id:
        dataset = Dataset.query.get(task.dataset_id)
        task_dict['dataset_name'] = dataset.name if dataset else ''
    
    return jsonify({'code': 200, 'data': task_dict})

@training_bp.route('/tasks/<int:id>/pause', methods=['POST'])
def pause_task(id):
    """暂停训练"""
    task = TrainingTask.query.get_or_404(id)
    task.status = 'paused'
    db.session.commit()
    return jsonify({'code': 200, 'message': '已暂停'})

@training_bp.route('/tasks/<int:id>/resume', methods=['POST'])
def resume_task(id):
    """恢复训练"""
    task = TrainingTask.query.get_or_404(id)
    task.status = 'running'
    db.session.commit()
    return jsonify({'code': 200, 'message': '已恢复'})

@training_bp.route('/tasks/<int:id>/stop', methods=['POST'])
def stop_task(id):
    """停止训练"""
    task = TrainingTask.query.get_or_404(id)
    task.status = 'failed'
    task.completed_at = datetime.now()
    db.session.commit()
    return jsonify({'code': 200, 'message': '已停止'})

@training_bp.route('/tasks/<int:id>/logs', methods=['GET'])
def get_logs(id):
    """获取训练日志"""
    task = TrainingTask.query.get_or_404(id)
    
    # 生成模拟日志
    logs = []
    for i in range(task.current_epoch):
        logs.append({
            'epoch': i + 1,
            'loss': 1.0 - (i + 1) / task.total_epochs * 0.8,
            'accuracy': 70 + (i + 1) / task.total_epochs * 25,
            'lr': 0.001,
            'time': '00:01:30'
        })
    
    return jsonify({'code': 200, 'data': logs})

@training_bp.route('/tasks/<int:id>/metrics', methods=['GET'])
def get_metrics(id):
    """获取训练指标"""
    task = TrainingTask.query.get_or_404(id)
    return jsonify({'code': 200, 'data': task.metrics})
