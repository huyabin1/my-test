from flask import Blueprint, request, jsonify
from datetime import datetime
from app import db
from app.models.annotation import AnnotationTask, TaskAssignment, Annotation
from app.models.dataset import Dataset, Image as ImageModel

annotation_bp = Blueprint('annotation', __name__)

# ==================== 标注任务管理 ====================

@annotation_bp.route('/tasks', methods=['GET'])
def get_tasks():
    """获取标注任务列表"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    name = request.args.get('name', '')
    status = request.args.get('status', '')
    
    query = AnnotationTask.query
    if name:
        query = query.filter(AnnotationTask.name.like(f'%{name}%'))
    if status:
        query = query.filter(AnnotationTask.status == status)
    
    pagination = query.order_by(AnnotationTask.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)
    
    # 获取数据集名称
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

@annotation_bp.route('/tasks', methods=['POST'])
def create_task():
    """创建标注任务"""
    data = request.get_json()
    
    # 获取数据集图像数
    dataset = Dataset.query.get(data['dataset_id'])
    total_images = dataset.image_count if dataset else 0
    
    task = AnnotationTask(
        name=data['name'],
        dataset_id=data['dataset_id'],
        annotation_type=data.get('annotation_type', 'detection'),
        task_type=data.get('task_type', 'manual'),
        distribute_type=data.get('distribute_type', 'load_balance'),
        priority=data.get('priority', 0),
        deadline=data.get('deadline'),
        total_images=total_images,
        owner_id=data.get('owner_id', 1),
        status='pending'
    )
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify({'code': 200, 'data': task.to_dict()})

@annotation_bp.route('/tasks/<int:id>', methods=['GET'])
def get_task(id):
    """获取任务详情"""
    task = AnnotationTask.query.get_or_404(id)
    return jsonify({'code': 200, 'data': task.to_dict()})

@annotation_bp.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    """更新任务"""
    task = AnnotationTask.query.get_or_404(id)
    data = request.get_json()
    
    for key in ['name', 'annotation_type', 'distribute_type', 'priority', 'deadline', 'status']:
        if key in data:
            setattr(task, key, data[key])
    
    db.session.commit()
    return jsonify({'code': 200, 'data': task.to_dict()})

@annotation_bp.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    """删除任务"""
    task = AnnotationTask.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'code': 200, 'message': '删除成功'})

@annotation_bp.route('/tasks/<int:id>/distribute', methods=['POST'])
def distribute_task(id):
    """分发任务"""
    task = AnnotationTask.query.get_or_404(id)
    data = request.get_json() or {}
    annotator_ids = data.get('annotator_ids', [])
    
    # 获取未标注的图像
    images = ImageModel.query.filter_by(
        dataset_id=task.dataset_id,
        status=1
    ).limit(len(annotator_ids) * 10).all()
    
    # 按分发策略分配
    if task.distribute_type == 'round_robin':
        # 轮询分配
        per_count = len(images) // len(annotator_ids) if annotator_ids else 0
        for i, user_id in enumerate(annotator_ids):
            start_idx = i * per_count
            end_idx = start_idx + per_count if i < len(annotator_ids) - 1 else len(images)
            assigned_images = images[start_idx:end_idx]
            
            assignment = TaskAssignment(
                task_id=task.id,
                user_id=user_id,
                image_ids=[img.id for img in assigned_images]
            )
            db.session.add(assignment)
    
    elif task.distribute_type == 'load_balance':
        # 负载均衡 - 分配给任务最少的标注员
        from app.models.user import User
        annotators = User.query.filter(User.id.in_(annotator_ids)).all()
        
        per_count = len(images) // len(annotators) if annotators else 0
        for i, annotator in enumerate(annotators):
            start_idx = i * per_count
            end_idx = start_idx + per_count if i < len(annotators) - 1 else len(images)
            assigned_images = images[start_idx:end_idx]
            
            assignment = TaskAssignment(
                task_id=task.id,
                user_id=annotator.id,
                image_ids=[img.id for img in assigned_images]
            )
            db.session.add(assignment)
    
    else:
        # 随机分配
        import random
        random.shuffle(images)
        per_count = len(images) // len(annotator_ids) if annotator_ids else 0
        for i, user_id in enumerate(annotator_ids):
            start_idx = i * per_count
            end_idx = start_idx + per_count if i < len(annotator_ids) - 1 else len(images)
            assigned_images = images[start_idx:end_idx]
            
            assignment = TaskAssignment(
                task_id=task.id,
                user_id=user_id,
                image_ids=[img.id for img in assigned_images]
            )
            db.session.add(assignment)
    
    task.status = 'in_progress'
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '分发成功'})

# ==================== 标注工作台 ====================

@annotation_bp.route('/tasks/<int:task_id>/images', methods=['GET'])
def get_task_images(task_id):
    """获取任务的图像列表"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    
    task = AnnotationTask.query.get_or_404(task_id)
    
    # 获取已分配的图像
    assignments = TaskAssignment.query.filter_by(task_id=task_id).all()
    assigned_image_ids = []
    for a in assignments:
        assigned_image_ids.extend(a.image_ids or [])
    
    query = ImageModel.query.filter(
        ImageModel.dataset_id == task.dataset_id,
        ImageModel.id.in_(assigned_image_ids) if assigned_image_ids else False
    )
    
    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    
    return jsonify({
        'code': 200,
        'data': {
            'list': [img.to_dict() for img in pagination.items],
            'total': pagination.total
        }
    })

@annotation_bp.route('/images/<int:image_id>/annotations', methods=['GET'])
def get_image_annotations(image_id):
    """获取图像的标注"""
    annotations = Annotation.query.filter_by(image_id=image_id).all()
    return jsonify({
        'code': 200,
        'data': [ann.to_dict() for ann in annotations]
    })

@annotation_bp.route('/images/<int:image_id>/annotations', methods=['POST'])
def save_image_annotations(image_id):
    """保存图像标注"""
    data = request.get_json()
    annotations_data = data.get('annotations', [])
    
    # 删除旧标注
    Annotation.query.filter_by(image_id=image_id).delete()
    
    # 添加新标注
    for ann_data in annotations_data:
        ann = Annotation(
            image_id=image_id,
            task_id=ann_data.get('task_id'),
            user_id=ann_data.get('user_id', 1),
            annotation_type=ann_data.get('annotation_type', 'detection'),
            category_id=ann_data.get('category_id'),
            annotation_data=ann_data.get('annotation_data'),
            review_status='pending'
        )
        db.session.add(ann)
    
    # 更新图像标注数
    image = ImageModel.query.get(image_id)
    if image:
        image.annotation_count = len(annotations_data)
    
    # 更新任务进度
    task_id = data.get('task_id')
    if task_id:
        task = AnnotationTask.query.get(task_id)
        if task:
            annotated = Annotation.query.filter_by(task_id=task_id, review_status='approved').count()
            task.annotated_images = annotated
    
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '保存成功'})

# ==================== 审核管理 ====================

@annotation_bp.route('/review', methods=['GET'])
def get_review_list():
    """获取待审核列表"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    query = Annotation.query.filter_by(review_status='pending')
    pagination = query.order_by(Annotation.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)
    
    review_list = []
    for ann in pagination.items:
        ann_dict = ann.to_dict()
        image = ImageModel.query.get(ann.image_id)
        if image:
            ann_dict['image_name'] = image.filename
            ann_dict['image_url'] = image.filepath
        task = AnnotationTask.query.get(ann.task_id) if ann.task_id else None
        if task:
            ann_dict['task_name'] = task.name
        review_list.append(ann_dict)
    
    return jsonify({
        'code': 200,
        'data': {
            'list': review_list,
            'total': pagination.total
        }
    })

@annotation_bp.route('/review/<int:annotation_id>/approve', methods=['POST'])
def approve_annotation(annotation_id):
    """通过标注"""
    annotation = Annotation.query.get_or_404(annotation_id)
    annotation.review_status = 'approved'
    
    # 更新任务审核数
    task = AnnotationTask.query.get(annotation.task_id)
    if task:
        task.reviewed_images = Annotation.query.filter_by(
            task_id=task.id,
            review_status='approved'
        ).count()
        if task.reviewed_images >= task.total_images:
            task.status = 'completed'
    
    db.session.commit()
    return jsonify({'code': 200, 'message': '审核通过'})

@annotation_bp.route('/review/<int:annotation_id>/reject', methods=['POST'])
def reject_annotation(annotation_id):
    """驳回标注"""
    data = request.get_json()
    annotation = Annotation.query.get_or_404(annotation_id)
    annotation.review_status = 'rejected'
    annotation.review_comment = data.get('reason', '')
    
    db.session.commit()
    return jsonify({'code': 200, 'message': '已驳回'})

# ==================== 我的任务 ====================

@annotation_bp.route('/my-tasks', methods=['GET'])
def get_my_tasks():
    """获取我的标注任务"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    user_id = 1  # 从token获取
    
    assignments = TaskAssignment.query.filter_by(user_id=user_id).all()
    task_ids = [a.task_id for a in assignments]
    
    query = AnnotationTask.query.filter(AnnotationTask.id.in_(task_ids))
    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    
    return jsonify({
        'code': 200,
        'data': {
            'list': [task.to_dict() for task in pagination.items],
            'total': pagination.total
        }
    })

@annotation_bp.route('/my-tasks/<int:task_id>/claim', methods=['POST'])
def claim_task(task_id):
    """领取任务"""
    user_id = 1  # 从token获取
    
    # 检查是否已分配
    existing = TaskAssignment.query.filter_by(task_id=task_id, user_id=user_id).first()
    if existing:
        return jsonify({'code': 400, 'message': '该任务已领取'}), 400
    
    task = AnnotationTask.query.get_or_404(task_id)
    
    # 分配图像
    images = ImageModel.query.filter_by(dataset_id=task.dataset_id, status=1).limit(20).all()
    
    assignment = TaskAssignment(
        task_id=task_id,
        user_id=user_id,
        image_ids=[img.id for img in images],
        status='in_progress'
    )
    db.session.add(assignment)
    
    if task.status == 'pending':
        task.status = 'in_progress'
    
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '领取成功'})
