<template>
  <div class="inference-realtime">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header">选择模型</div>
          <el-select v-model="selectedModel" placeholder="请选择推理模型" style="width: 100%">
            <el-option v-for="model in models" :key="model.id" :label="model.name + ' ' + model.version" :value="model.id"></el-option>
          </el-select>
        </el-card>
        
        <el-card style="margin-top: 20px;">
          <div slot="header">上传图像</div>
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :on-success="handleUploadSuccess"
            :show-file-list="false"
            accept="image/*"
          >
            <el-button size="small" type="primary">点击上传图像</el-button>
          </el-upload>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <div slot="header">推理结果</div>
          <div v-if="!resultImage" class="empty-tip">
            请上传图像进行推理
          </div>
          <div v-else class="result-container">
            <img :src="resultImage" alt="推理结果">
            <div class="result-info">
              <div v-for="(item, index) in results" :key="index" class="result-item">
                <el-tag :type="item.score > 0.8 ? 'success' : 'warning'">
                  {{ item.class }}: {{ (item.score * 100).toFixed(1) }}%
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getModels, realtimeInference } from '@/api/inference'

export default {
  name: 'InferenceRealtime',
  data() {
    return {
      models: [],
      selectedModel: null,
      uploadUrl: '/api/inference/realtime',
      resultImage: '',
      results: []
    }
  },
  mounted() {
    this.loadModels()
  },
  methods: {
    async loadModels() {
      try {
        const res = await getModels()
        this.models = res.data.list || []
      } catch (e) {
        console.error('加载失败', e)
      }
    },
    handleUploadSuccess(response, file) {
      if (response.code === 200) {
        this.resultImage = response.data.result_image_url
        this.results = response.data.results || []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inference-realtime {
  .empty-tip {
    text-align: center;
    color: #999;
    padding: 50px;
  }
  
  .result-container {
    img {
      width: 100%;
    }
    
    .result-info {
      margin-top: 20px;
      
      .result-item {
        display: inline-block;
        margin: 5px;
      }
    }
  }
}
</style>
