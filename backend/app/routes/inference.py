from flask import Blueprint, request, jsonify

inference_bp = Blueprint('inference', __name__)

@inference_bp.route('/realtime', methods=['POST'])
def realtime():
    return jsonify({'code': 200, 'data': {'result_image_url': '/static/result.jpg', 'results': [{'class': '正常', 'score': 0.95}, {'class': '划痕', 'score': 0.12}]}})

@inference_bp.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'code': 200, 'data': {'list': [], 'total': 0}})

@inference_bp.route('/tasks', methods=['POST'])
def create_task():
    return jsonify({'code': 200, 'data': {'id': 1, 'name': 'batch_task_1', 'status': 'pending', 'progress': 0}})
