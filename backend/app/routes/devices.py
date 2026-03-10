from flask import Blueprint, request, jsonify
from app import db
from app.models.device import EdgeDevice

devices_bp = Blueprint('devices', __name__)

@devices_bp.route('', methods=['GET'])
def get_devices():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    pagination = EdgeDevice.query.order_by(EdgeDevice.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)
    return jsonify({'code': 200, 'data': {'list': [d.to_dict() for d in pagination.items], 'total': pagination.total}})

@devices_bp.route('/<int:id>', methods=['GET'])
def get_device(id):
    device = EdgeDevice.query.get_or_404(id)
    return jsonify({'code': 200, 'data': device.to_dict()})

@devices_bp.route('', methods=['POST'])
def add_device():
    data = request.get_json()
    device = EdgeDevice(name=data['name'], device_type=data['device_type'], ip_address=data.get('ip_address'), port=data.get('port', 8080), owner_id=data.get('owner_id', 1))
    db.session.add(device)
    db.session.commit()
    return jsonify({'code': 200, 'data': device.to_dict()})

@devices_bp.route('/<int:id>', methods=['PUT'])
def update_device(id):
    device = EdgeDevice.query.get_or_404(id)
    data = request.get_json()
    for key in ['name', 'status', 'ip_address']:
        if key in data:
            setattr(device, key, data[key])
    db.session.commit()
    return jsonify({'code': 200, 'data': device.to_dict()})

@devices_bp.route('/<int:id>', methods=['DELETE'])
def delete_device(id):
    device = EdgeDevice.query.get_or_404(id)
    db.session.delete(device)
    db.session.commit()
    return jsonify({'code': 200, 'message': '删除成功'})

@devices_bp.route('/deploy', methods=['POST'])
def deploy():
    data = request.get_json()
    return jsonify({'code': 200, 'message': '部署成功', 'data': {'task_id': 1, 'status': 'deploying'}})
