from datetime import datetime
from app import db

class EdgeDevice(db.Model):
    __tablename__ = 'edge_devices'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    device_type = db.Column(db.String(50))  # jetson_nano, jetson_xavier, raspberry_pi, etc.
    ip_address = db.Column(db.String(50))
    port = db.Column(db.Integer)
    hardware_config = db.Column(db.JSON)  # CPU, GPU, Memory
    status = db.Column(db.String(20), default='offline')  # online, offline, running, error
    current_model_id = db.Column(db.Integer, db.ForeignKey('models.id'))
    last_online = db.Column(db.DateTime)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'device_type': self.device_type,
            'ip_address': self.ip_address,
            'port': self.port,
            'status': self.status,
            'last_online': self.last_online.strftime('%Y-%m-%d %H:%M:%S') if self.last_online else None,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
