from flask import Blueprint, request, jsonify
from app import db
from app.models.training import Model

models_bp = Blueprint('models', __name__)

@models_bp.route('', methods=['GET'])
def get_models():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    pagination = Model.query.order_by(Model.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)
    return jsonify({'code': 200, 'data': {'list': [m.to_dict() for m in pagination.items], 'total': pagination.total}})

@models_bp.route('/<int:id>', methods=['GET'])
def get_model(id):
    model = Model.query.get_or_404(id)
    return jsonify({'code': 200, 'data': model.to_dict()})

@models_bp.route('', methods=['POST'])
def create_model():
    data = request.get_json()
    model = Model(name=data['name'], version=data.get('version', 'v1'), task_type=data.get('task_type'), architecture=data.get('architecture'), owner_id=data.get('owner_id', 1))
    db.session.add(model)
    db.session.commit()
    return jsonify({'code': 200, 'data': model.to_dict()})

@models_bp.route('/<int:id>', methods=['DELETE'])
def delete_model(id):
    model = Model.query.get_or_404(id)
    db.session.delete(model)
    db.session.commit()
    return jsonify({'code': 200, 'message': '删除成功'})

@models_bp.route('/export', methods=['POST'])
def export_model():
    data = request.get_json()
    return jsonify({'code': 200, 'data': {'file_path': f'/exports/model_{data["model_id"]}.onnx', 'file_size': '125MB'}})
