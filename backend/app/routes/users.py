from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from app import db
from app.models.user import User, Department
from app.models.role import Role

users_bp = Blueprint('users', __name__)

@users_bp.route('', methods=['GET'])
def get_users():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    username = request.args.get('username', '')
    
    query = User.query
    if username:
        query = query.filter(User.username.like(f'%{username}%'))
    
    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    
    return jsonify({
        'code': 200,
        'data': {
            'list': [u.to_dict() for u in pagination.items],
            'total': pagination.total
        }
    })

@users_bp.route('', methods=['POST'])
def create_user():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'code': 400, 'message': '用户名已存在'}), 400
    
    user = User(
        username=data['username'],
        password=generate_password_hash(data['password']),
        email=data.get('email'),
        phone=data.get('phone'),
        name=data.get('name'),
        department_id=data.get('department_id')
    )
    
    db.session.add(user)
    db.session.commit()
    
    # 分配角色
    if data.get('role_ids'):
        roles = Role.query.filter(Role.id.in_(data['role_ids'])).all()
        user.roles = roles
        db.session.commit()
    
    return jsonify({'code': 200, 'data': user.to_dict()})

@users_bp.route('/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify({'code': 200, 'data': user.to_dict()})

@users_bp.route('/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'phone' in data:
        user.phone = data['phone']
    if 'status' in data:
        user.status = data['status']
    if 'password' in data:
        user.password = generate_password_hash(data['password'])
    
    db.session.commit()
    return jsonify({'code': 200, 'data': user.to_dict()})

@users_bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'code': 200, 'message': '删除成功'})

@users_bp.route('/<int:id>/roles', methods=['PUT'])
def assign_roles(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    
    roles = Role.query.filter(Role.id.in_(data['role_ids'])).all()
    user.roles = roles
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '角色分配成功'})
