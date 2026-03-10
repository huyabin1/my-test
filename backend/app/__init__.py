from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # 加载配置
    app.config.from_object(f'app.config.{config_name.title()}Config')
    
    # 初始化扩展
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # 注册蓝图
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.roles import roles_bp
    from app.routes.menus import menus_bp
    from app.routes.datasets import datasets_bp
    from app.routes.upload import upload_bp
    from app.routes.annotation import annotation_bp
    from app.routes.training import training_bp
    from app.routes.models import models_bp
    from app.routes.inference import inference_bp
    from app.routes.devices import devices_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(roles_bp, url_prefix='/api/roles')
    app.register_blueprint(menus_bp, url_prefix='/api/menus')
    app.register_blueprint(datasets_bp, url_prefix='/api/datasets')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(annotation_bp, url_prefix='/api/annotation')
    app.register_blueprint(training_bp, url_prefix='/api/training')
    app.register_blueprint(models_bp, url_prefix='/api/models')
    app.register_blueprint(inference_bp, url_prefix='/api/inference')
    app.register_blueprint(devices_bp, url_prefix='/api/devices')
    
    # 配置上传文件夹静态路由
    from flask import send_from_directory
    import os
    
    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        upload_folder = app.config.get('UPLOAD_FOLDER')
        return send_from_directory(upload_folder, filename)
    
    # 创建数据库表
    with app.app_context():
        db.create_all()
        # 初始化默认数据
        from app.utils.init_data import init_default_data
        init_default_data()
    
    return app
