<template>
  <div class="dataset-import">
    <el-card>
      <div slot="header">
        <span>数据集导入</span>
      </div>
      
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="选择格式"></el-step>
        <el-step title="上传文件"></el-step>
        <el-step title="配置映射"></el-step>
        <el-step title="导入完成"></el-step>
      </el-steps>
      
      <!-- 步骤1: 选择格式 -->
      <div v-if="currentStep === 0" class="step-content">
        <div class="format-selection">
          <el-radio-group v-model="importConfig.format">
            <el-radio label="coco">
              <div class="format-card">
                <div class="format-icon">COCO</div>
                <div class="format-name">COCO 数据集</div>
                <div class="format-desc">Common Objects in Context，支持分类、检测、分割</div>
              </div>
            </el-radio>
            <el-radio label="voc">
              <div class="format-card">
                <div class="format-icon">VOC</div>
                <div class="format-name">PASCAL VOC</div>
                <div class="format-desc">经典目标检测数据集格式，XML标注文件</div>
              </div>
            </el-radio>
            <el-radio label="yolo">
              <div class="format-card">
                <div class="format-icon">YOLO</div>
                <div class="format-name">YOLO 格式</div>
                <div class="format-desc">YOLO目标检测专用格式，TXT标注文件</div>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
        
        <div class="step-actions">
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
      </div>
      
      <!-- 步骤2: 上传文件 -->
      <div v-if="currentStep === 1" class="step-content">
        <el-form :model="importConfig" label-width="120px">
          <el-form-item label="目标数据集">
            <el-select v-model="importConfig.datasetId" placeholder="请选择数据集">
              <el-option v-for="ds in datasets" :key="ds.id" :label="ds.name" :value="ds.id"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item :label="formatLabel + '文件'">
            <el-upload
              ref="importUpload"
              class="import-upload"
              :action="importUrl"
              :data="importData"
              :auto-upload="false"
              :on-change="handleImportChange"
              :on-success="handleImportSuccess"
              :on-error="handleImportError"
              :file-list="importFileList"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">拖拽文件到此处或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">
                {{ formatTip }}
              </div>
            </el-upload>
          </el-form-item>
          
          <el-form-item v-if="importConfig.format === 'coco'" label="图片目录">
            <el-upload
              class="image-dir-upload"
              :action="importUrl"
              :data="importData"
              :auto-upload="false"
              :on-change="handleImageDirChange"
              :file-list="imageDirList"
              :webkitdirectory="true"
              directory
              drag
            >
              <i class="el-icon-folder-opened"></i>
              <div class="el-upload__text">选择图片所在目录</div>
            </el-upload>
          </el-form-item>
        </el-form>
        
        <div class="step-actions">
          <el-button @click="prevStep">上一步</el-button>
          <el-button type="primary" @click="startImport" :loading="importing">
            开始导入
          </el-button>
        </div>
      </div>
      
      <!-- 步骤3: 配置映射 -->
      <div v-if="currentStep === 2" class="step-content">
        <el-alert
          title="类别映射配置"
          type="info"
          :closable="false"
          style="margin-bottom: 20px;"
        >
          请确认导入数据中的类别与目标数据集的类别映射关系
        </el-alert>
        
        <el-table :data="categoryMapping" border>
          <el-table-column prop="source" label="源类别"></el-table-column>
          <el-table-column label="目标类别">
            <template slot-scope="scope">
              <el-select v-model="scope.row.target" placeholder="选择目标类别">
                <el-option v-for="label in datasetLabels" :key="label" :label="label" :value="label"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="样本数"></el-table-column>
        </el-table>
        
        <div class="step-actions">
          <el-button @click="prevStep">上一步</el-button>
          <el-button type="primary" @click="confirmMapping">确认映射</el-button>
        </div>
      </div>
      
      <!-- 步骤4: 导入完成 -->
      <div v-if="currentStep === 3" class="step-content">
        <div class="import-result">
          <i class="el-icon-success result-icon"></i>
          <h3>导入完成</h3>
          <div class="result-stats">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ importResult.totalImages }}</div>
                  <div class="stat-label">图像数量</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ importResult.totalAnnotations }}</div>
                  <div class="stat-label">标注数量</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ importResult.failedImages }}</div>
                  <div class="stat-label">失败数量</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        
        <div class="step-actions">
          <el-button type="primary" @click="finishImport">完成</el-button>
          <el-button @click="importMore">继续导入</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getDatasets } from '@/api/dataset'
import { importDataset } from '@/api/upload'

export default {
  name: 'DatasetImport',
  data() {
    return {
      currentStep: 0,
      datasets: [],
      datasetLabels: [],
      importConfig: {
        format: 'coco',
        datasetId: null,
        mapping: {}
      },
      importFileList: [],
      imageDirList: [],
      importing: false,
      categoryMapping: [],
      importResult: {
        totalImages: 0,
        totalAnnotations: 0,
        failedImages: 0
      }
    }
  },
  computed: {
    formatLabel() {
      const labels = { coco: 'JSON', voc: 'XML', yolo: 'TXT' }
      return labels[this.importConfig.format]
    },
    formatTip() {
      const tips = {
        coco: '上传 COCO 格式的 JSON 标注文件',
        voc: '上传 VOC 格式的 ZIP 压缩包或目录',
        yolo: '上传包含标注 TXT 文件的目录'
      }
      return tips[this.importConfig.format]
    },
    importUrl() {
      return '/api/datasets/import'
    },
    importData() {
      return {
        format: this.importConfig.format,
        dataset_id: this.importConfig.datasetId
      }
    }
  },
  mounted() {
    this.loadDatasets()
  },
  methods: {
    async loadDatasets() {
      try {
        const res = await getDatasets()
        this.datasets = res.data.list || []
        if (this.datasets.length > 0) {
          this.importConfig.datasetId = this.datasets[0].id
          this.datasetLabels = this.datasets[0].labels || []
        }
      } catch (e) {
        console.error('加载数据集失败', e)
      }
    },
    nextStep() {
      this.currentStep++
    },
    prevStep() {
      this.currentStep--
    },
    handleImportChange(file, files) {
      this.importFileList = files
    },
    handleImageDirChange(file, files) {
      this.imageDirList = files
    },
    handleImportSuccess(response, file, files) {
      if (response.code === 200) {
        this.importResult = response.data
        this.categoryMapping = response.data.categoryMapping || []
        if (this.categoryMapping.length > 0) {
          this.currentStep = 2
        } else {
          this.currentStep = 3
        }
      } else {
        this.$message.error(response.message || '导入失败')
      }
      this.importing = false
    },
    handleImportError(err, file, files) {
      this.$message.error('导入失败: ' + err.message)
      this.importing = false
    },
    startImport() {
      if (!this.importConfig.datasetId) {
        this.$message.warning('请选择目标数据集')
        return
      }
      if (this.importFileList.length === 0) {
        this.$message.warning('请上传导入文件')
        return
      }
      this.importing = true
      this.$refs.importUpload.submit()
    },
    confirmMapping() {
      // 应用映射配置
      this.importConfig.mapping = {}
      this.categoryMapping.forEach(item => {
        if (item.target) {
          this.importConfig.mapping[item.source] = item.target
        }
      })
      
      // 调用映射接口
      importDataset({
        dataset_id: this.importConfig.datasetId,
        format: this.importConfig.format,
        mapping: this.importConfig.mapping
      }).then(res => {
        this.importResult = res.data
        this.currentStep = 3
      }).catch(e => {
        this.$message.error('映射应用失败')
      })
    },
    finishImport() {
      this.$router.push('/dataset/list')
    },
    importMore() {
      this.currentStep = 0
      this.importFileList = []
      this.imageDirList = []
      this.importResult = { totalImages: 0, totalAnnotations: 0, failedImages: 0 }
    }
  }
}
</script>

<style lang="scss" scoped>
.dataset-import {
  .step-content {
    margin-top: 40px;
    padding: 20px;
  }
  
  .format-selection {
    text-align: center;
    
    .el-radio-group {
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    
    .el-radio {
      margin: 0;
    }
    
    .format-card {
      width: 200px;
      padding: 20px;
      border: 2px solid #dcdfe6;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409EFF;
      }
      
      .format-icon {
        font-size: 24px;
        font-weight: bold;
        color: #409EFF;
        margin-bottom: 10px;
      }
      
      .format-name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .format-desc {
        font-size: 12px;
        color: #999;
      }
    }
    
    .el-radio:checked + .format-card {
      border-color: #409EFF;
      background: #ecf5ff;
    }
  }
  
  .step-actions {
    margin-top: 30px;
    text-align: center;
  }
  
  .import-result {
    text-align: center;
    padding: 40px;
    
    .result-icon {
      font-size: 64px;
      color: #67C23A;
    }
    
    h3 {
      margin: 20px 0;
    }
    
    .result-stats {
      .stat-item {
        padding: 20px;
        
        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #409EFF;
        }
        
        .stat-label {
          color: #999;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
