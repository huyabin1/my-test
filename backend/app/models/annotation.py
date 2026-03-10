from datetime import datetime
from app import db

class AnnotationTask(db.Model):
    __tablename__ = 'annotation_tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    dataset_id = db.Column(db.Integer, db.ForeignKey('datasets.id'))
    annotation_type = db.Column(db.String(20))  # classification, detection, segmentation
    task_type = db.Column(db.String(20))  # auto, manual
    distribute_type = db.Column(db.String(20))  # round_robin, ability, load_balance, random
    priority = db.Column(db.Integer, default=0)
    deadline = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='pending')  # pending, distributing, in_progress, completed, cancelled
    total_images = db.Column(db.Integer, default=0)
    annotated_images = db.Column(db.Integer, default=0)
    reviewed_images = db.Column(db.Integer, default=0)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'dataset_id': self.dataset_id,
            'annotation_type': self.annotation_type,
            'task_type': self.task_type,
            'distribute_type': self.distribute_type,
            'priority': self.priority,
            'status': self.status,
            'total_images': self.total_images,
            'annotated_images': self.annotated_images,
            'reviewed_images': self.reviewed_images,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }

class TaskAssignment(db.Model):
    __tablename__ = 'task_assignments'
    
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('annotation_tasks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    image_ids = db.Column(db.JSON)  # 分配的图像ID列表
    assigned_at = db.Column(db.DateTime, default=datetime.now)
    completed_at = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed
    
    def to_dict(self):
        return {
            'id': self.id,
            'task_id': self.task_id,
            'user_id': self.user_id,
            'image_ids': self.image_ids,
            'assigned_at': self.assigned_at.strftime('%Y-%m-%d %H:%M:%S') if self.assigned_at else None,
            'status': self.status
        }

class Annotation(db.Model):
    __tablename__ = 'annotations'
    
    id = db.Column(db.Integer, primary_key=True)
    image_id = db.Column(db.Integer, db.ForeignKey('images.id'))
    task_id = db.Column(db.Integer, db.ForeignKey('annotation_tasks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    annotation_type = db.Column(db.String(20))
    category_id = db.Column(db.Integer)
    annotation_data = db.Column(db.JSON)  # 标注数据，如 bbox, polygon 等
    review_status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    review_comment = db.Column(db.Text)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'image_id': self.image_id,
            'task_id': self.task_id,
            'user_id': self.user_id,
            'annotation_type': self.annotation_type,
            'category_id': self.category_id,
            'annotation_data': self.annotation_data,
            'review_status': self.review_status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
