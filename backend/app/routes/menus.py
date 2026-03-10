from flask import Blueprint, request, jsonify
from app import db
from app.models.permission import Menu

menus_bp = Blueprint('menus', __name__)

@menus_bp.route('', methods=['GET'])
def get_menus():
    menus = Menu.query.filter_by(parent_id=None).order_by(Menu.order_num).all()
    return jsonify({
        'code': 200,
        'data': [build_menu_tree(m) for m in menus]
    })

@menus_bp.route('', methods=['POST'])
def create_menu():
    data = request.get_json()
    menu = Menu(
        name=data['name'],
        path=data.get('path'),
        component=data.get('component'),
        icon=data.get('icon'),
        parent_id=data.get('parent_id'),
        order_num=data.get('order_num', 0),
        is_hidden=data.get('is_hidden', 0)
    )
    db.session.add(menu)
    db.session.commit()
    return jsonify({'code': 200, 'data': menu.to_dict()})

@menus_bp.route('/<int:id>', methods=['GET'])
def get_menu(id):
    menu = Menu.query.get_or_404(id)
    return jsonify({'code': 200, 'data': menu.to_dict()})

@menus_bp.route('/<int:id>', methods=['PUT'])
def update_menu(id):
    menu = Menu.query.get_or_404(id)
    data = request.get_json()
    
    for key in ['name', 'path', 'component', 'icon', 'parent_id', 'order_num', 'is_hidden']:
        if key in data:
            setattr(menu, key, data[key])
    
    db.session.commit()
    return jsonify({'code': 200, 'data': menu.to_dict()})

@menus_bp.route('/<int:id>', methods=['DELETE'])
def delete_menu(id):
    menu = Menu.query.get_or_404(id)
    db.session.delete(menu)
    db.session.commit()
    return jsonify({'code': 200, 'message': '删除成功'})

def build_menu_tree(menu):
    result = menu.to_dict()
    children = Menu.query.filter_by(parent_id=menu.id).order_by(Menu.order_num).all()
    if children:
        result['children'] = [build_menu_tree(c) for c in children]
    return result
