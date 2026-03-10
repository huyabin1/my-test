from datetime import datetime
from app import db

class TrainingTask(db.Model):
    __tablename__ = 'training_tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    model_id = db.Column(db.Integer, db.ForeignKey('models.id'))
    dataset_id = db.Column(db.Integer, db.ForeignKey('datasets.id'))
    task_type = db.Column(db.String(20))  # classification, detection, segmentation
    model_architecture = db.Column(db.String(50))  # resnet, yolo, unet, etc.
    config = db.Column(db.JSON)  # 训练配置参数
    status = db.Column(db.String(20), default='pending')  # pending, queued, running, paused, completed, failed
    progress = db.Column(db.Integer, default=0)
    current_epoch = db.Column(db.Integer, default=0)
    total_epochs = db.Column(db.Integer)
    metrics = db.Column(db.JSON)  # 训练指标
    gpu_device = db.Column(db.String(50))
    priority = db.Column(db.Integer, default=0)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'model_id': self.model_id,
            'task_type': self.task_type,
            'model_architecture': self.model_architecture,
            'status': self.status,
            'progress': self.progress,
            'current_epoch': self.current_epoch,
            'total_epochs': self.total_epochs,
            'metrics': self.metrics,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }

class Model(db.Model):
    __tablename__ = 'models'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    version.String(20 = db.Column(db))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    task_type = db.Column(db.String(20))
    architecture = db.Column(db.String(50))
    model_file = db.Column(db.String(500))
    config = db.Column(db.JSON)
    metrics = db.Column(db.JSON)
    status = db.Column(db.String(20), default='training')  # training, trained, deployed
    is_default = db.Column(db.Integer, default=0)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'version': self.version,
            'task_type': self.task_type,
            'architecture': self.architecture,
            'status': self.status,
            'metrics': self.metrics,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
