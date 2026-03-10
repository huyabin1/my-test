<template>
  <div class="image-capture">
    <el-card>
      <div slot="header" class="clearfix">
        <span>摄像头图像采集</span>
      </div>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <div slot="header">摄像头预览</div>
            <div class="video-container">
              <video ref="video" autoplay playsinline></video>
              <canvas ref="canvas" style="display: none;"></canvas>
            </div>
            <div class="capture-controls">
              <el-button type="primary" @click="startCamera" :disabled="cameraActive">
                <i class="el-icon-video-play"></i> 开启摄像头
              </el-button>
              <el-button type="danger" @click="stopCamera" :disabled="!cameraActive">
                <i class="el-icon-video-pause"></i> 关闭摄像头
              </el-button>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card>
            <div slot="header">采集配置</div>
            <el-form :model="captureConfig" label-width="100px">
              <el-form-item label="目标数据集">
                <el-select v-model="captureConfig.datasetId" placeholder="请选择数据集">
                  <el-option v-for="ds in datasets" :key="ds.id" :label="ds.name" :value="ds.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="采集间隔">
                <el-input-number v-model="captureConfig.interval" :min="1" :max="60"></el-input-number>
                <span class="form-tip">秒/张</span>
              </el-form-item>
              <el-form-item label="采集模式">
                <el-radio-group v-model="captureConfig.mode">
                  <el-radio label="manual">手动采集</el-radio>
                  <el-radio label="auto">自动采集</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="图像质量">
                <el-slider v-model="captureConfig.quality" :min="0.1" :max="1" :step="0.1"></el-slider>
              </el-form-item>
            </el-form>
            
            <div class="capture-stats">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-value">{{ capturedCount }}</div>
                    <div class="stat-label">已采集</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-value">{{ uploadedCount }}</div>
                    <div class="stat-label">已上传</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-value">{{ failedCount }}</div>
                    <div class="stat-label">失败</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            
            <div class="capture-actions">
              <el-button v-if="captureConfig.mode === 'manual'" type="success" @click="captureFrame" :disabled="!cameraActive">
                <i class="el-icon-camera"></i> 拍照采集
              </el-button>
              <el-button v-else type="warning" @click="startAutoCapture" :disabled="!cameraActive || autoCapturing">
                <i class="el-icon-time"></i> 开始自动采集
              </el-button>
              <el-button type="info" @click="clearCount">
                <i class="el-icon-refresh"></i> 重置计数
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="24">
          <el-card>
            <div slot="header">已采集图像预览</div>
            <div class="preview-grid">
              <div v-for="(img, index) in capturedImages" :key="index" class="preview-item">
                <img :src="img.url" alt="">
                <div class="preview-info">{{ img.name }}</div>
              </div>
              <div v-if="capturedImages.length === 0" class="empty-tip">
                暂无采集图像
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getDatasets } from '@/api/dataset'
import { uploadImage } from '@/api/upload'

export default {
  name: 'ImageCapture',
  data() {
    return {
      cameraActive: false,
      autoCapturing: false,
      capturedCount: 0,
      uploadedCount: 0,
      failedCount: 0,
      capturedImages: [],
      timer: null,
      datasets: [],
      captureConfig: {
        datasetId: null,
        interval: 2,
        mode: 'manual',
        quality: 0.9
      }
    }
  },
  mounted() {
    this.loadDatasets()
  },
  beforeDestroy() {
    this.stopCamera()
  },
  methods: {
    async loadDatasets() {
      try {
        const res = await getDatasets()
        this.datasets = res.data.list || []
      } catch (e) {
        console.error('加载数据集失败', e)
      }
    },
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 } 
        })
        this.$refs.video.srcObject = stream
        this.cameraActive = true
      } catch (e) {
        this.$message.error('无法访问摄像头: ' + e.message)
      }
    },
    stopCamera() {
      if (this.$refs.video && this.$refs.video.srcObject) {
        const tracks = this.$refs.video.srcObject.getTracks()
        tracks.forEach(track => track.stop())
        this.$refs.video.srcObject = null
      }
      this.cameraActive = false
      this.stopAutoCapture()
    },
    captureFrame() {
      if (!this.captureConfig.datasetId) {
        this.$message.warning('请先选择目标数据集')
        return
      }
      
      const video = this.$refs.video
      const canvas = this.$refs.canvas
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      const dataUrl = canvas.toDataURL('image/jpeg', this.captureConfig.quality)
      const file = this.dataURLtoFile(dataUrl, `capture_${Date.now()}.jpg`)
      
      this.capturedCount++
      this.uploadImage(file)
    },
    startAutoCapture() {
      this.autoCapturing = true
      this.timer = setInterval(() => {
        this.captureFrame()
      }, this.captureConfig.interval * 1000)
    },
    stopAutoCapture() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.autoCapturing = false
    },
    async uploadImage(file) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('dataset_id', this.captureConfig.datasetId)
        formData.append('source', 'camera')
        
        const res = await uploadImage(formData)
        
        if (res.code === 200) {
          this.uploadedCount++
          this.capturedImages.unshift({
            url: res.data.url,
            name: file.name
          })
          // 限制显示数量
          if (this.capturedImages.length > 20) {
            this.capturedImages.pop()
          }
        } else {
          this.failedCount++
        }
      } catch (e) {
        this.failedCount++
        console.error('上传失败', e)
      }
    },
    dataURLtoFile(dataurl, filename) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    clearCount() {
      this.capturedCount = 0
      this.uploadedCount = 0
      this.failedCount = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.image-capture {
  .video-container {
    width: 100%;
    background: #000;
    margin-bottom: 20px;
    
    video {
      width: 100%;
      display: block;
    }
  }
  
  .capture-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  
  .form-tip {
    margin-left: 10px;
    color: #999;
  }
  
  .capture-stats {
    margin: 20px 0;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #409EFF;
      }
      
      .stat-label {
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .capture-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  
  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    min-height: 200px;
    
    .preview-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 4px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .preview-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 4px 8px;
        background: rgba(0,0,0,0.6);
        color: #fff;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    
    .empty-tip {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
    }
  }
}
</style>
