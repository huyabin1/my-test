<template>
  <div class="annotation-workspace">
    <el-container>
      <!-- 左侧：图像列表 -->
      <el-aside width="280px">
        <el-card class="image-list-card">
          <div slot="header">
            <span>图像列表</span>
            <span class="image-count">{{ imageList.length }} / {{ totalImages }}</span>
          </div>
          <div class="image-list">
            <div 
              v-for="(img, index) in imageList" 
              :key="img.id"
              :class="['image-item', { active: currentImageIndex === index }]"
              @click="selectImage(index)"
            >
              <img :src="img.url" alt="">
              <div class="image-status">
                <el-tag v-if="img.annotation_status === 'annotated'" type="success" size="mini">已标注</el-tag>
                <el-tag v-else type="info" size="mini">待标注</el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-aside>
      
      <!-- 中间：标注画布 -->
      <el-main class="annotation-canvas">
        <el-card>
          <div slot="header" class="canvas-header">
            <div class="toolbar">
              <el-button-group>
                <el-button :type="currentTool === 'select' ? 'primary' : ''" @click="currentTool = 'select'">
                  <i class="el-icon-pointer"></i> 选择
                </el-button>
                <el-button :type="currentTool === 'rect' ? 'primary' : ''" @click="currentTool = 'rect'">
                  <i el-icon="el-icon-share"></i> 框选
                </el-button>
                <el-button :type="currentTool === 'polygon' ? 'primary' : ''" @click="currentTool = 'polygon'">
                  <i class="el-icon-edit"></i> 描边
                </el-button>
              </el-button-group>
              
              <el-button-group style="margin-left: 10px;">
                <el-button @click="undo" :disabled="!canUndo">
                  <i class="el-icon-back"></i> 撤销
                </el-button>
                <el-button @click="redo" :disabled="!canRedo">
                  <i class="el-icon-right"></i> 重做
                </el-button>
              </el-button-group>
            </div>
            
            <div class="canvas-actions">
              <el-button type="primary" @click="saveAnnotation">保存</el-button>
              <el-button @click="prevImage" :disabled="currentImageIndex === 0">上一张</el-button>
              <el-button @click="nextImage" :disabled="currentImageIndex >= imageList.length - 1">下一张</el-button>
            </div>
          </div>
          
          <div class="canvas-container" ref="canvasContainer">
            <canvas 
              ref="annotationCanvas" 
              @mousedown="handleCanvasMouseDown"
              @mousemove="handleCanvasMouseMove"
              @mouseup="handleCanvasMouseUp"
            ></canvas>
          </div>
        </el-card>
      </el-main>
      
      <!-- 右侧：属性面板 -->
      <el-aside width="300px">
        <el-card class="property-card">
          <div slot="header">
            <span>标注属性</span>
          </div>
          
          <div class="category-select">
            <div class="label">选择类别</div>
            <el-select v-model="currentCategory" placeholder="请选择类别" @change="handleCategoryChange">
              <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id">
                <span :style="{ color: cat.color }">{{ cat.name }}</span>
              </el-option>
            </el-select>
          </div>
          
          <div class="annotation-list">
            <div class="label">当前标注 ({{ annotations.length }})</div>
            <div v-for="(ann, index) in annotations" :key="index" class="annotation-item">
              <div class="ann-header" @click="selectAnnotation(index)">
                <span class="ann-color" :style="{ background: ann.color }"></span>
                <span class="ann-name">{{ ann.category_name }}</span>
                <el-button type="text" size="mini" @click.stop="deleteAnnotation(index)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </div>
              <div class="ann-info" v-if="ann.bbox">
                x: {{ Math.round(ann.bbox[0]) }}, y: {{ Math.round(ann.bbox[1]) }}
                w: {{ Math.round(ann.bbox[2]) }}, h: {{ Math.round(ann.bbox[3]) }}
              </div>
            </div>
          </div>
          
          <div class="keyboard-shortcuts">
            <div class="label">快捷键</div>
            <div class="shortcut-item">
              <span class="key">W</span> 选择工具
            </div>
            <div class="shortcut-item">
              <span class="key">E</span> 框选工具
            </div>
            <div class="shortcut-item">
              <span class="key">R</span> 描边工具
            </div>
            <div class="shortcut-item">
              <span class="key">Ctrl+Z</span> 撤销
            </div>
            <div class="shortcut-item">
              <span class="key">Ctrl+S</span> 保存
            </div>
            <div class="shortcut-item">
              <span class="key">←→</span> 切换图像
            </div>
          </div>
        </el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { getTaskImages, saveAnnotation, getAnnotations } from '@/api/annotation'

export default {
  name: 'AnnotationWorkspace',
  data() {
    return {
      taskId: null,
      imageList: [],
      currentImageIndex: 0,
      totalImages: 0,
      currentTool: 'select',
      currentCategory: null,
      categories: [
        { id: 1, name: '正常', color: '#67C23A' },
        { id: 2, name: '划痕', color: '#E6A23C' },
        { id: 3, name: '污渍', color: '#F56C6C' },
        { id: 4, name: '变形', color: '#909399' },
        { id: 5, name: '缺失', color: '#409EFF' }
      ],
      annotations: [],
      history: [],
      historyIndex: -1,
      isDrawing: false,
      startPoint: null,
      currentRect: null,
      canvasCtx: null,
      imageLoaded: false
    }
  },
  computed: {
    canUndo() {
      return this.historyIndex > 0
    },
    canRedo() {
      return this.historyIndex < this.history.length - 1
    }
  },
  mounted() {
    this.taskId = this.$route.query.taskId
    this.loadImages()
    this.initCanvas()
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    async loadImages() {
      try {
        const res = await getTaskImages(this.taskId, { page: 1, limit: 100 })
        this.imageList = res.data.list || []
        this.totalImages = res.data.total || 0
        if (this.imageList.length > 0) {
          this.loadAnnotations()
        }
      } catch (e) {
        console.error('加载图像失败', e)
      }
    },
    async loadAnnotations() {
      try {
        const imageId = this.imageList[this.currentImageIndex].id
        const res = await getAnnotations(imageId)
        this.annotations = res.data || []
        this.redrawCanvas()
      } catch (e) {
        console.error('加载标注失败', e)
      }
    },
    selectImage(index) {
      this.saveAnnotation()
      this.currentImageIndex = index
      this.loadAnnotations()
    },
    initCanvas() {
      this.$nextTick(() => {
        const canvas = this.$refs.annotationCanvas
        const container = this.$refs.canvasContainer
        if (canvas && container) {
          canvas.width = container.clientWidth
          canvas.height = 600
          this.canvasCtx = canvas.getContext('2d')
        }
      })
    },
    handleCanvasMouseDown(e) {
      if (this.currentTool === 'select') return
      
      const rect = this.$refs.annotationCanvas.getBoundingClientRect()
      this.startPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      this.isDrawing = true
    },
    handleCanvasMouseMove(e) {
      if (!this.isDrawing || !this.startPoint) return
      
      const rect = this.$refs.annotationCanvas.getBoundingClientRect()
      const currentPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      
      if (this.currentTool === 'rect') {
        this.currentRect = {
          x: Math.min(this.startPoint.x, currentPoint.x),
          y: Math.min(this.startPoint.y, currentPoint.y),
          w: Math.abs(currentPoint.x - this.startPoint.x),
          h: Math.abs(currentPoint.y - this.startPoint.y)
        }
        this.redrawCanvas()
        this.drawCurrentRect()
      }
    },
    handleCanvasMouseUp(e) {
      if (!this.isDrawing) return
      
      if (this.currentTool === 'rect' && this.currentRect && this.currentRect.w > 5 && this.currentRect.h > 5) {
        const category = this.categories.find(c => c.id === this.currentCategory)
        this.annotations.push({
          category_id: this.currentCategory,
          category_name: category ? category.name : '未知',
          color: category ? category.color : '#000',
          bbox: [this.currentRect.x, this.currentRect.y, this.currentRect.w, this.currentRect.h]
        })
        this.saveToHistory()
      }
      
      this.isDrawing = false
      this.startPoint = null
      this.currentRect = null
      this.redrawCanvas()
    },
    redrawCanvas() {
      if (!this.canvasCtx) return
      
      const canvas = this.$refs.annotationCanvas
      this.canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 绘制标注
      this.annotations.forEach((ann, index) => {
        if (ann.bbox) {
          this.canvasCtx.strokeStyle = ann.color
          this.canvasCtx.lineWidth = 2
          this.canvasCtx.strokeRect(ann.bbox[0], ann.bbox[1], ann.bbox[2], ann.bbox[3])
          
          // 绘制标签
          this.canvasCtx.fillStyle = ann.color
          this.canvasCtx.fillRect(ann.bbox[0], ann.bbox[1] - 20, 60, 20)
          this.canvasCtx.fillStyle = '#fff'
          this.canvasCtx.font = '12px Arial'
          this.canvasCtx.fillText(ann.category_name, ann.bbox[0] + 5, ann.bbox[1] - 5)
        }
      })
    },
    drawCurrentRect() {
      if (!this.currentRect) return
      
      this.canvasCtx.strokeStyle = '#409EFF'
      this.canvasCtx.lineWidth = 2
      this.canvasCtx.setLineDash([5, 5])
      this.canvasCtx.strokeRect(this.currentRect.x, this.currentRect.y, this.currentRect.w, this.currentRect.h)
      this.canvasCtx.setLineDash([])
    },
    selectAnnotation(index) {
      // 选中标注高亮
    },
    deleteAnnotation(index) {
      this.annotations.splice(index, 1)
      this.saveToHistory()
      this.redrawCanvas()
    },
    handleCategoryChange() {
      // 类别变更
    },
    async saveAnnotation() {
      if (!this.imageList[this.currentImageIndex]) return
      
      try {
        const imageId = this.imageList[this.currentImageIndex].id
        await saveAnnotation(imageId, this.annotations)
        this.$message.success('保存成功')
      } catch (e) {
        console.error('保存失败', e)
      }
    },
    saveToHistory() {
      this.history = this.history.slice(0, this.historyIndex + 1)
      this.history.push(JSON.parse(JSON.stringify(this.annotations)))
      this.historyIndex = this.history.length - 1
    },
    undo() {
      if (this.canUndo) {
        this.historyIndex--
        this.annotations = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
        this.redrawCanvas()
      }
    },
    redo() {
      if (this.canRedo) {
        this.historyIndex++
        this.annotations = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
        this.redrawCanvas()
      }
    },
    prevImage() {
      if (this.currentImageIndex > 0) {
        this.selectImage(this.currentImageIndex - 1)
      }
    },
    nextImage() {
      if (this.currentImageIndex < this.imageList.length - 1) {
        this.selectImage(this.currentImageIndex + 1)
      }
    },
    handleKeyDown(e) {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault()
        this.undo()
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        this.saveAnnotation()
      } else if (e.key === 'ArrowLeft') {
        this.prevImage()
      } else if (e.key === 'ArrowRight') {
        this.nextImage()
      } else if (e.key === 'w') {
        this.currentTool = 'select'
      } else if (e.key === 'e') {
        this.currentTool = 'rect'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.annotation-workspace {
  height: calc(100vh - 84px);
  
  .el-container {
    height: 100%;
  }
  
  .image-list-card {
    height: 100%;
    
    .image-count {
      float: right;
      color: #999;
      font-size: 12px;
    }
    
    .image-list {
      height: calc(100% - 60px);
      overflow-y: auto;
      
      .image-item {
        position: relative;
        margin-bottom: 10px;
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        
        &:hover, &.active {
          border-color: #409EFF;
        }
        
        img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          display: block;
        }
        
        .image-status {
          position: absolute;
          top: 5px;
          right: 5px;
        }
      }
    }
  }
  
  .annotation-canvas {
    padding: 0 10px;
    
    .canvas-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .canvas-container {
      width: 100%;
      height: 600px;
      background: #f5f5f5;
      
      canvas {
        display: block;
        cursor: crosshair;
      }
    }
  }
  
  .property-card {
    .category-select {
      margin-bottom: 20px;
      
      .label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
      }
    }
    
    .annotation-list {
      margin-bottom: 20px;
      
      .label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
      }
      
      .annotation-item {
        background: #f5f7fa;
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 8px;
        
        .ann-header {
          display: flex;
          align-items: center;
          cursor: pointer;
          
          .ann-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            margin-right: 8px;
          }
          
          .ann-name {
            flex: 1;
          }
        }
        
        .ann-info {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
          margin-left: 20px;
        }
      }
    }
    
    .keyboard-shortcuts {
      .label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
      }
      
      .shortcut-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        font-size: 12px;
        color: #909399;
        
        .key {
          display: inline-block;
          padding: 2px 8px;
          background: #eee;
          border-radius: 3px;
          margin-right: 8px;
          font-family: monospace;
        }
      }
    }
  }
}
</style>
