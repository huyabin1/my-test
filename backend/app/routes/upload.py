from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import uuid
from PIL import Image
from app import db
from app.models.dataset import Dataset, Image as ImageModel

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_upload_folder():
    """获取上传文件夹路径"""
    folder = current_app.config.get('UPLOAD_FOLDER')
    if not os.path.exists(folder):
        os.makedirs(folder)
    return folder

@upload_bp.route('/image', methods=['POST'])
def upload_image():
    """上传图像"""
    if 'file' not in request.files:
        return jsonify({'code': 400, 'message': '没有文件'}), 400
    
    file = request.files['file']
    dataset_id = request.form.get('dataset_id')
    source = request.form.get('source', 'upload')
    
    if file.filename == '':
        return jsonify({'code': 400, 'message': '文件名不能为空'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'code': 400, 'message': '不支持的文件格式'}), 400
    
    # 生成唯一文件名
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    
    # 保存文件
    upload_folder = get_upload_folder()
    if dataset_id:
        upload_folder = os.path.join(upload_folder, str(dataset_id))
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
    
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    
    # 获取图像尺寸
    try:
        with Image.open(filepath) as img:
            width, height = img.size
    except:
        width, height = 0, 0
    
    # 保存到数据库
    image = ImageModel(
        dataset_id=dataset_id,
        filename=file.filename,
        filepath=filepath,
        width=width,
        height=height,
        source=source
    )
    db.session.add(image)
    
    # 更新数据集图像数量
    if dataset_id:
        dataset = Dataset.query.get(dataset_id)
        if dataset:
            dataset.image_count += 1
            db.session.commit()
    
    # 返回访问URL
    image_url = f"/uploads/{dataset_id}/{filename}" if dataset_id else f"/uploads/{filename}"
    
    return jsonify({
        'code': 200,
        'message': '上传成功',
        'data': {
            'id': image.id,
            'filename': image.filename,
            'url': image_url,
            'width': width,
            'height': height
        }
    })
