from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import uuid
from PIL import Image
from app import db
from app.models.dataset import Dataset, Image as ImageModel, Project

datasets_bp = Blueprint('datasets', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@datasets_bp.route('', methods=['GET'])
def get_datasets():
    """获取数据集列表"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    query = Dataset.query.filter_by(status=1)
    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    
    return jsonify({
        'code': 200,
        'data': {
            'list': [d.to_dict() for d in pagination.items],
            'total': pagination.total
        }
    })

@datasets_bp.route('', methods=['POST'])
def create_dataset():
    """创建数据集"""
    data = request.get_json()
    
    dataset = Dataset(
        name=data['name'],
        description=data.get('description'),
        labels=data.get('labels', []),
        project_id=data.get('project_id'),
        owner_id=data.get('owner_id', 1)
    )
    
    db.session.add(dataset)
    db.session.commit()
    
    return jsonify({'code': 200, 'data': dataset.to_dict()})

@datasets_bp.route('/<int:id>', methods=['GET'])
def get_dataset(id):
    """获取数据集详情"""
    dataset = Dataset.query.get_or_404(id)
    return jsonify({'code': 200, 'data': dataset.to_dict()})

@datasets_bp.route('/<int:id>', methods=['PUT'])
def update_dataset(id):
    """更新数据集"""
    dataset = Dataset.query.get_or_404(id)
    data = request.get_json()
    
    for key in ['name', 'description', 'labels', 'is_public']:
        if key in data:
            setattr(dataset, key, data[key])
    
    db.session.commit()
    return jsonify({'code': 200, 'data': dataset.to_dict()})

@datasets_bp.route('/<int:id>', methods=['DELETE'])
def delete_dataset(id):
    """删除数据集"""
    dataset = Dataset.query.get_or_404(id)
    dataset.status = 0
    db.session.commit()
    return jsonify({'code': 200, 'message': '删除成功'})

@datasets_bp.route('/<int:id>/images', methods=['GET'])
def get_dataset_images(id):
    """获取数据集图像列表"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    
    query = ImageModel.query.filter_by(dataset_id=id, status=1)
    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    
    return jsonify({
        'code': 200,
        'data': {
            'list': [img.to_dict() for img in pagination.items],
            'total': pagination.total
        }
    })

@datasets_bp.route('/<int:id>/stats', methods=['GET'])
def get_dataset_stats(id):
    """获取数据集统计信息"""
    dataset = Dataset.query.get_or_404(id)
    
    images = ImageModel.query.filter_by(dataset_id=id, status=1).all()
    total_images = len(images)
    
    # 统计各类别数量
    category_count = {}
    for img in images:
        # 简化处理，实际应查询标注表
        pass
    
    return jsonify({
        'code': 200,
        'data': {
            'total_images': total_images,
            'category_count': category_count,
            'dataset': dataset.to_dict()
        }
    })

@datasets_bp.route('/import', methods=['POST'])
def import_dataset():
    """导入数据集"""
    # 这里实现COCO/VOC/YOLO格式导入逻辑
    data = request.get_json()
    format_type = data.get('format')
    dataset_id = data.get('dataset_id')
    mapping = data.get('mapping', {})
    
    # 返回模拟结果
    return jsonify({
        'code': 200,
        'data': {
            'totalImages': 100,
            'totalAnnotations': 350,
            'failedImages': 2,
            'categoryMapping': [
                {'source': 'person', 'target': '人员', 'count': 50},
                {'source': 'car', 'target': '车辆', 'count': 80},
                {'source': 'dog', 'target': '动物', 'count': 20}
            ]
        }
    })
