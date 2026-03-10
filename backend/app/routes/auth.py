from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from flask import current_app
from app import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not check_password_hash(user.password, password):
        return jsonify({'code': 401, 'message': '用户名或密码错误'}), 401
    
    if user.status == 0:
        return jsonify({'code': 403, 'message': '账号已被禁用'}), 403
    
    # 更新最后登录时间
    user.last_login = datetime.now()
    db.session.commit()
    
    # 生成 token
    token = jwt.encode({
        'user_id': user.id,
        'username': user.username,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'code': 200,
        'message': '登录成功',
        'data': {
            'token': token,
            'user': user.to_dict()
        }
    })

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'code': 200, 'message': '登出成功'})

@auth_bp.route('/info', methods=['GET'])
def get_info():
    # 从请求头获取 token
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'code': 401, 'message': '未登录'}), 401
    
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        user = User.query.get(payload['user_id'])
        
        if not user:
            return jsonify({'code': 404, 'message': '用户不存在'}), 404
        
        # 获取角色和权限
        roles = [role.code for role in user.roles]
        permissions = []
        for role in user.roles:
            for perm in role.permissions:
                if perm.code not in permissions:
                    permissions.append(perm.code)
        
        return jsonify({
            'code': 200,
            'data': {
                'user': user.to_dict(),
                'roles': roles,
                'permissions': permissions
            }
        })
    except jwt.ExpiredSignatureError:
        return jsonify({'code': 401, 'message': '登录已过期'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'code': 401, 'message': '无效的token'}), 401
