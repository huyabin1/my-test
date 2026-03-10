from datetime import datetime
from app import db

# 角色权限关联表
role_permissions = db.Table('role_permissions',
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True),
    db.Column('permission_id', db.Integer, db.ForeignKey('permissions.id'), primary_key=True)
)

# 角色菜单关联表
role_menus = db.Table('role_menus',
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True),
    db.Column('menu_id', db.Integer, db.ForeignKey('menus.id'), primary_key=True)
)

class Permission(db.Model):
    __tablename__ = 'permissions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    code = db.Column(db.String(100), unique=True, nullable=False)  # 如: system:user:list
    type = db.Column(db.String(20))  # menu, button, data
    module = db.Column(db.String(50))  # 所属模块
    description = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'type': self.type,
            'module': self.module,
            'description': self.description
        }

class Menu(db.Model):
    __tablename__ = 'menus'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    path = db.Column(db.String(255))
    component = db.Column(db.String(255))
    icon = db.Column(db.String(50))
    parent_id = db.Column(db.Integer, db.ForeignKey('menus.id'))
    order_num = db.Column(db.Integer, default=0)
    is_hidden = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    children = db.relationship('Menu', backref=db.backref('parent', remote_side=[id]))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'path': self.path,
            'component': self.component,
            'icon': self.icon,
            'parent_id': self.parent_id,
            'order_num': self.order_num,
            'is_hidden': self.is_hidden
        }
