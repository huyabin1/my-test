from werkzeug.security import generate_password_hash
from app import db
from app.models.user import User, Department
from app.models.role import Role
from app.models.permission import Permission, Menu
from app.models.dataset import Project

def init_default_data():
    """初始化默认数据"""
    
    # 检查是否已有数据
    if User.query.first():
        return
    
    # 创建部门
    dept1 = Department(name='技术部', order_num=1)
    dept2 = Department(name='标注部', order_num=2)
    dept3 = Department(name='运维部', order_num=3)
    db.session.add_all([dept1, dept2, dept3])
    db.session.commit()
    
    # 创建角色
    roles = [
        Role(name='超级管理员', code='admin', description='系统最高权限'),
        Role(name='管理员', code='manager', description='项目管理权限'),
        Role(name='标注员', code='annotator', description='数据标注人员'),
        Role(name='审核员', code='reviewer', description='标注质量审核'),
        Role(name='训练员', code='trainer', description='模型训练人员'),
        Role(name='运维人员', code='operator', description='边缘设备运维'),
        Role(name='普通用户', code='user', description='基础使用人员')
    ]
    db.session.add_all(roles)
    db.session.commit()
    
    # 创建权限
    permissions = [
        # 系统权限
        Permission(name='用户列表', code='system:user:list', type='button', module='system'),
        Permission(name='用户创建', code='system:user:create', type='button', module='system'),
        Permission(name='用户编辑', code='system:user:update', type='button', module='system'),
        Permission(name='用户删除', code='system:user:delete', type='button', module='system'),
        Permission(name='角色列表', code='system:role:list', type='button', module='system'),
        Permission(name='菜单列表', code='system:menu:list', type='button', module='system'),
        # 数据集权限
        Permission(name='数据集列表', code='dataset:list', type='button', module='dataset'),
        Permission(name='数据集创建', code='dataset:create', type='button', module='dataset'),
        Permission(name='数据集导入', code='dataset:import', type='button', module='dataset'),
        # 标注权限
        Permission(name='标注任务列表', code='annotation:task:list', type='button', module='annotation'),
        Permission(name='标注工作台', code='annotation:workspace', type='button', module='annotation'),
        Permission(name='标注审核', code='annotation:review', type='button', module='annotation'),
        # 训练权限
        Permission(name='训练任务列表', code='training:task:list', type='button', module='training'),
        Permission(name='训练配置', code='training:config', type='button', module='training'),
        # 模型权限
        Permission(name='模型列表', code='model:list', type='button', module='model'),
        Permission(name='模型导出', code='model:export', type='button', module='model'),
        # 推理权限
        Permission(name='实时推理', code='inference:realtime', type='button', module='inference'),
        Permission(name='批量推理', code='inference:batch', type='button', module='inference'),
        # 设备权限
        Permission(name='设备列表', code='device:list', type='button', module='device'),
        Permission(name='设备部署', code='device:deploy', type='button', module='device'),
    ]
    db.session.add_all(permissions)
    db.session.commit()
    
    # 给管理员角色分配所有权限
    admin_role = Role.query.filter_by(code='admin').first()
    admin_role.permissions = permissions
    db.session.commit()
    
    # 创建默认用户
    admin = User(
        username='admin',
        password=generate_password_hash('admin123'),
        name='系统管理员',
        email='admin@vision-ai.com',
        department_id=dept1.id
    )
    admin.roles = [admin_role]
    db.session.add(admin)
    db.session.commit()
    
    # 创建示例项目
    project = Project(
        name='产品缺陷检测项目',
        description='用于检测工业产品表面缺陷的视觉AI项目',
        department_id=dept1.id,
        owner_id=admin.id
    )
    db.session.add(project)
    db.session.commit()
    
    print('默认数据初始化完成！')
    print('默认管理员账号: admin / admin123')
