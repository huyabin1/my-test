<template>
  <div class="training-config">
    <el-card>
      <div slot="header">
        <span>训练配置</span>
      </div>
      
      <el-form :model="configForm" :rules="rules" ref="configForm" label-width="120px">
        <!-- 基本信息 -->
        <el-divider>基本信息</el-divider>
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="configForm.name" placeholder="请输入训练任务名称"></el-input>
        </el-form-item>
        <el-form-item label="数据集" prop="dataset_id">
          <el-select v-model="configForm.dataset_id" placeholder="请选择数据集">
            <el-option v-for="ds in datasets" :key="ds.id" :label="ds.name" :value="ds.id">
              <span>{{ ds.name }}</span>
              <span style="color: #999; font-size: 12px;"> ({{ ds.image_count }} 张图像)</span>
            </el-option>
          </el-select>
        </el-form-item>
        
        <!-- 模型配置 -->
        <el-divider>模型配置</el-divider>
        <el-form-item label="任务类型" prop="task_type">
          <el-radio-group v-model="configForm.task_type">
            <el-radio label="classification">图像分类</el-radio>
            <el-radio label="detection">目标检测</el-radio>
            <el-radio label="segmentation">图像分割</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模型架构" prop="model_architecture">
          <el-select v-model="configForm.model_architecture" placeholder="请选择模型架构">
            <el-optgroup v-if="configForm.task_type === 'classification'" label="分类模型">
              <el-option label="ResNet-50" value="resnet50"></el-option>
              <el-option label="ResNet-101" value="resnet101"></el-option>
              <el-option label="EfficientNet-B0" value="efficientnet_b0"></el-option>
              <el-option label="EfficientNet-B3" value="efficientnet_b3"></el-option>
              <el-option label="MobileNet-V3" value="mobilenet_v3"></el-option>
            </el-optgroup>
            <el-optgroup v-if="configForm.task_type === 'detection'" label="检测模型">
              <el-option label="YOLOv5" value="yolov5"></el-option>
              <el-option label="YOLOv8" value="yolov8"></el-option>
              <el-option label="Faster R-CNN" value="faster_rcnn"></el-option>
            </el-optgroup>
            <el-optgroup v-if="configForm.task_type === 'segmentation'" label="分割模型">
              <el-option label="UNet" value="unet"></el-option>
              <el-option label="DeepLabV3+" value="deeplabv3_plus"></el-option>
              <el-option label="SegNet" value="segnet"></el-option>
            </el-optgroup>
          </el-select>
        </el-form-item>
        <el-form-item label="预训练权重">
          <el-radio-group v-model="configForm.pretrained">
            <el-radio label="imagenet">ImageNet</el-radio>
            <el-radio label="coco">COCO</el-radio>
            <el-radio label="none">不使用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- 训练参数 -->
        <el-divider>训练参数</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="训练轮数" prop="total_epochs">
              <el-input-number v-model="configForm.total_epochs" :min="1" :max="1000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批量大小">
              <el-input-number v-model="configForm.batch_size" :min="1" :max="128"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学习率">
              <el-input-number v-model="configForm.learning_rate" :min="0.00001" :max="0.1" :step="0.0001" :precision="5"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优化器">
              <el-select v-model="configForm.optimizer">
                <el-option label="SGD" value="sgd"></el-option>
                <el-option label="Adam" value="adam"></el-option>
                <el-option label="AdamW" value="adamw"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="学习率策略">
          <el-select v-model="configForm.lr_scheduler">
            <el-option label="固定学习率" value="fixed"></el-option>
            <el-option label="余弦退火" value="cosine"></el-option>
            <el-option label="步进衰减" value="step"></el-option>
            <el-option label="指数衰减" value="exponential"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据划分比例">
          <el-slider v-model="configForm.train_split" range :min="50" :max="95" :step="5"></el-slider>
          <div class="slider-tip">训练集: {{ configForm.train_split }}%, 验证集: {{ 100 - configForm.train_split }}%</div>
        </el-form-item>
        
        <!-- 数据增强 -->
        <el-divider>数据增强</el-divider>
        <el-form-item label="启用增强">
          <el-switch v-model="configForm.augmentation.enabled"></el-switch>
        </el-form-item>
        <div v-if="configForm.augmentation.enabled">
          <el-form-item label="几何变换">
            <el-checkbox-group v-model="configForm.augmentation.geometric">
              <el-checkbox label="random_flip">随机翻转</el-checkbox>
              <el-checkbox label="random_rotation">随机旋转</el-checkbox>
              <el-checkbox label="random_scale">随机缩放</el-checkbox>
              <el-checkbox label="random_crop">随机裁剪</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="颜色变换">
            <el-checkbox-group v-model="configForm.augmentation.color">
              <el-checkbox label="random_brightness">随机亮度</el-checkbox>
              <el-checkbox label="random_contrast">随机对比度</el-checkbox>
              <el-checkbox label="random_saturation">随机饱和度</el-checkbox>
              <el-checkbox label="random_noise">随机噪声</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        
        <!-- 资源设置 -->
        <el-divider>资源设置</el-divider>
        <el-form-item label="GPU设备">
          <el-select v-model="configForm.gpu_device" placeholder="请选择GPU">
            <el-option label="GPU 0" value="0"></el-option>
            <el-option label="GPU 1" value="1"></el-option>
            <el-option label="多GPU (所有)" value="all"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作线程数">
          <el-input-number v-model="configForm.num_workers" :min="0" :max="16"></el-input-number>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitConfig">创建训练任务</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getDatasets } from '@/api/dataset'
import { createTrainingTask } from '@/api/training'

export default {
  name: 'TrainingConfig',
  data() {
    return {
      datasets: [],
      configForm: {
        name: '',
        dataset_id: null,
        task_type: 'detection',
        model_architecture: 'yolov5',
        pretrained: 'coco',
        total_epochs: 100,
        batch_size: 16,
        learning_rate: 0.001,
        optimizer: 'adam',
        lr_scheduler: 'cosine',
        train_split: 80,
        augmentation: {
          enabled: true,
          geometric: ['random_flip', 'random_scale'],
          color: ['random_brightness', 'random_contrast']
        },
        gpu_device: '0',
        num_workers: 4
      },
      rules: {
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        dataset_id: [{ required: true, message:请选择数据集', trigger: 'change' }],
        task_type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
        model_architecture: [{ required: true, message: '请选择模型架构', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.loadDatasets()
  },
  watch: {
    'configForm.task_type'(val) {
      if (val === 'classification') {
        this.configForm.model_architecture = 'resnet50'
      } else if (val === 'detection') {
        this.configForm.model_architecture = 'yolov5'
      } else {
        this.configForm.model_architecture = 'unet'
      }
    }
  },
  methods: {
    async loadDatasets() {
      try {
        const res = await getDatasets({ limit: 100 })
        this.datasets = res.data.list || []
      } catch (e) {
        console.error('加载数据集失败', e)
      }
    },
    async submitConfig() {
      this.$refs.configForm.validate(async valid => {
        if (valid) {
          try {
            await createTrainingTask(this.configForm)
            this.$message.success('训练任务创建成功')
            this.$router.push('/training/tasks')
          } catch (e) {
            this.$message.error('创建失败')
          }
        }
      })
    },
    resetForm() {
      this.$refs.configForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.training-config {
  .slider-tip {
    color: #999;
    font-size: 12px;
    margin-top: 5px;
  }
}
</style>
