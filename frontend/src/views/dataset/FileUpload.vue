<template>
  <div class="file-upload">
    <el-card>
      <div slot="header">
        <span>批量文件上传</span>
      </div>
      
      <el-form :model="uploadConfig" label-width="120px">
        <el-form-item label="目标数据集">
          <el-select v-model="uploadConfig.datasetId" placeholder="请选择数据集">
            <el-option v-for="ds in datasets" :key="ds.id" :label="ds.name" :value="ds.id"></el-option>
          </el-select>
          <el-button type="text" @click="createDatasetDialog = true">新建数据集</el-button>
        </el-form-item>
        
        <el-form-item label="上传方式">
          <el-radio-group v-model="uploadConfig.uploadType">
            <el-radio label="single">单文件上传</el-radio>
            <el-radio label="multi">批量文件上传</el-radio>
            <el-radio label="folder">文件夹上传</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <!-- 拖拽上传区域 -->
      <el-upload
        v-if="uploadConfig.uploadType === 'multi'"
        ref="upload"
        class="upload-area"
        :action="uploadUrl"
        :data="uploadData"
        :auto-upload="false"
        :multiple="true"
        :file-list="fileList"
        :on-change="handleFileChange"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-remove="handleRemove"
        drag
        accept="image/*"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">支持 jpg、png、bmp、tif 格式，单个文件不超过50MB</div>
      </el-upload>
      
      <!-- 单文件上传 -->
      <el-upload
        v-else-if="uploadConfig.uploadType === 'single'"
        ref="upload"
        class="upload-area"
        :action="uploadUrl"
        :data="uploadData"
        :auto-upload="false"
        :file-list="fileList"
        :on-change="handleFileChange"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-remove="handleRemove"
        accept="image/*"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div class="el-upload__tip" slot="tip">支持 jpg、png、bmp、tif 格式，单个文件不超过50MB</div>
      </el-upload>
      
      <!-- 文件夹上传 -->
      <el-upload
        v-else
        ref="upload"
        class="upload-area"
        :action="uploadUrl"
        :data="uploadData"
        :auto-upload="false"
        :multiple="true"
        :webkitdirectory="true"
        :directory="true"
        :file-list="fileList"
        :on-change="handleFileChange"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-remove="handleRemove"
        drag
      >
        <i class="el-icon-folder-opened"></i>
        <div class="el-upload__text">将文件夹拖到此处，或<em>点击选择文件夹</em></div>
        <div class="el-upload__tip" slot="tip">支持上传整个文件夹，自动识别其中的图片文件</div>
      </el-upload>
      
      <!-- 上传控制 -->
      <div class="upload-actions">
        <el-button type="primary" @click="submitUpload" :loading="uploading">
          开始上传
        </el-button>
        <el-button @click="clearFiles">清空列表</el-button>
      </div>
      
      <!-- 上传进度 -->
      <el-progress 
        v-if="uploading || uploadProgress > 0" 
        :percentage="uploadProgress" 
        :status="uploadStatus"
      ></el-progress>
      
      <!-- 上传结果 -->
      <div v-if="uploadStats.total > 0" class="upload-stats">
        <el-alert :title="`上传完成：成功 ${uploadStats.success} 个，失败 ${uploadStats.failed} 个`" 
          :type="uploadStats.failed > 0 ? 'warning' : 'success'" show-icon>
        </el-alert>
      </div>
    </el-card>
    
    <!-- 新建数据集对话框 -->
    <el-dialog title="新建数据集" :visible.sync="createDatasetDialog" width="500px">
      <el-form :model="newDataset" label-width="100px">
        <el-form-item label="数据集名称">
          <el-input v-model="newDataset.name" placeholder="请输入数据集名称"></el-input>
        </el-form-item>
        <el-form-item label="数据集描述">
          <el-input v-model="newDataset.description" type="textarea" rows="3"></el-input>
        </el-form-item>
        <el-form-item label="标签设置">
          <el-select v-model="newDataset.labels" multiple placeholder="请选择或输入标签">
            <el-option v-for="label in commonLabels" :key="label" :label="label" :value="label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="createDatasetDialog = false">取消</el-button>
        <el-button type="primary" @click="createDataset">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDatasets, createDataset } from '@/api/dataset'
import { uploadUrl } from '@/api/upload'

export default {
  name: 'FileUpload',
  data() {
    return {
      datasets: [],
      uploadConfig: {
        datasetId: null,
        uploadType: 'multi'
      },
      fileList: [],
      uploading: false,
      uploadProgress: 0,
      uploadStatus: '',
      uploadStats: {
        total: 0,
        success: 0,
        failed: 0
      },
      createDatasetDialog: false,
      newDataset: {
        name: '',
        description: '',
        labels: []
      },
      commonLabels: ['正常', '缺陷', '划痕', '污渍', '变形', '缺失']
    }
  },
  computed: {
    uploadData() {
      return {
        dataset_id: this.uploadConfig.datasetId,
        source: 'upload'
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
      } catch (e) {
        console.error('加载数据集失败', e)
      }
    },
    handleFileChange(file, files) {
      this.fileList = files
    },
    handleProgress(event, file, files) {
      this.uploading = true
      this.uploadProgress = Math.round(event.percent)
    },
    handleSuccess(response, file, files) {
      if (response.code === 200) {
        this.uploadStats.success++
      } else {
        this.uploadStats.failed++
        file.status = 'fail'
      }
      this.uploadStats.total = files.length
    },
    handleError(err, file, files) {
      this.uploadStats.failed++
      this.uploadStats.total = files.length
      file.status = 'fail'
    },
    handleRemove(file, files) {
      this.fileList = files
    },
    submitUpload() {
      if (!this.uploadConfig.datasetId) {
        this.$message.warning('请先选择目标数据集')
        return
      }
      if (this.fileList.length === 0) {
        this.$message.warning('请先选择要上传的文件')
        return
      }
      this.uploadStats = { total: 0, success: 0, failed: 0 }
      this.$refs.upload.submit()
    },
    clearFiles() {
      this.$refs.upload.clearFiles()
      this.uploadStats = { total: 0, success: 0, failed: 0 }
      this.uploadProgress = 0
    },
    async createDataset() {
      if (!this.newDataset.name) {
        this.$message.warning('请输入数据集名称')
        return
      }
      try {
        const res = await createDataset(this.newDataset)
        this.datasets.unshift(res.data)
        this.uploadConfig.datasetId = res.data.id
        this.createDatasetDialog = false
        this.$message.success('数据集创建成功')
      } catch (e) {
        this.$message.error('创建失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.file-upload {
  .upload-area {
    margin: 20px 0;
  }
  
  .upload-actions {
    margin: 20px 0;
    display: flex;
    gap: 10px;
  }
  
  .upload-stats {
    margin-top: 20px;
  }
}
</style>
