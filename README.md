# 工业视觉智能平台

#
#mkdir -p /home/engine/project && cd /home/
mkdir -p '/home/engine/project' && cd '/home/engine/project'AI模型开发平台

## 技术栈

- **前端**: Vue2 + Element UI + Vuex + Vue Router
- **后端**: Python Flask + SQLAlchemy + MySQL
- **深度学习**: PyTorch / TensorFlow

## 项目结构

```
vision-platform/
 frontend/                 # 前端项目
   ├── src/
   │   ├── api/            # API接口
   │   ├── components/     # 公共组件
   │   ├── router/         # 路由配置
   │   ├── store/          # Vuex状态管理
   │   ├── views/          # 页面组件
   │   └── utils/          # 工具函数
   └── public/

 backend/                 # 后端项目
   ├── app/
   │   ├── models/         # 数据模型
   │   ├── routes/         # API路由
   │   ├── services/       # 业务逻辑
   │   └── utils/          # 工具函数
   └── requirements.txt

 docs/                   # 设计文档
```

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run serve
```

### 后端

```bash
cd backend
pip install -r requirements.txt
python run.py
```

## 功能模块

1. **权限系统**: 用户、角色、菜单、按钮权限
2. **数据集管理**: 图像采集、导入、标注
3. **标注分发**: 任务池、自动分配、质量审核
4. **模型训练**: 配置、监控、评估
5. **模型管理**: 版本管理、导出
6. **推理服务**: 实时推理、批量推理
7. **边缘部署**: 设备管理、模型下发
