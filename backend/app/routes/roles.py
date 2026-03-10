from flask import Blueprint, request, jsonify
from app import db
from app.models.role import Role
from app.models.permission import Permission, Menu

roles_bp = Blueprint('roles', __name__)

@roles_bp.route('', methods=['GET'])
def get_roles():
    roles = Role.query.all()
    return jsonify({
        'code': 200,
        'data': [r.to_dict() for r in roles]
    })

@roles_bp.route('', methods=['POST'])
def create_role():
    data = request.get_json()
    
    role = Role(
        name=data['name'],
        code=data['code'],
        description=data.get('description')
    )
    
    db.session.add(role)
    db.session.commit()
    
    return jsonify({'code': 200, 'data': role.to_dict()})

@roles_bp.route('/<int:id>', methods=['GET'])
def get_role(id):
    role = Role.query.get_or_404(id)
    data = role.to_dict()
    data['permissions'] = [p.code for p in role.permissions]
    data['menus'] = [m.to_dict() for m in role.menus]
    return jsonify({'code': 200, 'data': data})

@roles_bp.route('/<int:id>', methods=['PUT'])
def update_role(id):
    role = Role.query.get_or_404(id)
    data = request.get_json()
    
    role.name = data.get('name', role.name)
    role.description = data.get('description', role.description)
    db.session.commit()
    
    return jsonify({'code': 200, 'data': role.to_dict()})

@roles_bp.route('/<int:id>', methods=['DELETE'])
def delete_role(id):
    role = Role.query.get_or_404(id)
    db.session.delete(role)
    db.session.commit()
    return jsonify({'code': 200, 'message': '删除成功'})

@roles_bp.route('/<int:id>/permissions', methods=['PUT'])
def assign_permissions(id):
    role = Role.query.get_or_404(id)
    data = request.get_json()
    
    permissions = Permission.query.filter(Permission.id.in_(data['permission_ids'])).all()
    role.permissions = permissions
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '权限分配成功'})

@roles_bp.route('/<int:id>/menus', methods=['PUT'])
def assign_menus(id):
    role = Role.query.get_or_404(id)
    data = request.get_json()
    
    menus = Menu.query.filter(Menu.id.in_(data['menu_ids'])).all()
    role.menus = menus
    db.session.commit()
    
    return jsonify({'code': 200, 'message': '菜单分配成功'})
