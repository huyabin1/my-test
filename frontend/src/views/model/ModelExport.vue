<template>
  <div class="model-export">
    <el-card>
      <div slot="header">
        <span>模型导出</span>
      </div>
      
      <el-form :model="exportForm" label-width="120px">
        <el-form-item label="选择模型">
          <el-select v-model="exportForm.model_id" placeholder="请选择模型">
            <el-option v-for="model in models" :key="model.id" :label="model.name + ' ' + model.version" :value="model.id"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="导出格式">
          <el-checkbox-group v-model="exportForm.formats">
            <el-checkbox label="onnx">ONNX</el-checkbox>
            <el-checkbox label="pytorch">PyTorch (.pt)</el-checkbox>
            <el-checkbox label="tensorflow">TensorFlow</el-checkbox>
            <el-checkbox label="tensorrt">TensorRT</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="输入尺寸">
          <el-input v-model="exportForm.input_size" placeholder="如: 640x640"></el-input>
        </el-form-item>
        
        <el-form-item label="量化精度">
          <el-radio-group v-model="exportForm.quantization">
            <el-radio label="fp32">FP32</el-radio>
            <el-radio label="fp16">FP16</el-radio>
            <el-radio label="int8">INT8</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="startExport" :loading="exporting">开始导出</el-button>
        </el-form-item>
      </el-form>
      
      <el-divider v-if="exportResult"></el-divider>
      
      <div v-if="exportResult" class="export-result">
        <el-alert :title="'导出完成'" type="success" show-icon>
          <div>文件大小: {{ exportResult.file_size }}</div>
          <div>导出路径: {{ exportResult.file_path }}</div>
        </el-alert>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getModels, exportModel } from '@/api/model'

export default {
  name: 'ModelExport',
  data() {
    return {
      models: [],
      exportForm: {
        model_id: null,
        formats: ['onnx'],
        input_size: '640x640',
        quantization: 'fp32'
      },
      exporting: false,
      exportResult: null
    }
  },
  mounted() {
    this.loadModels()
    if (this.$route.query.modelId) {
      this.exportForm.model_id = parseInt(this.$route.query.modelId)
    }
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
    async startExport() {
      if (!this.exportForm.model_id) {
        this.$message.warning('请选择模型')
        return
      }
      
      this.exporting = true
      try {
        const res = await exportModel(this.exportForm)
        this.exportResult = res.data
        this.$message.success('导出成功')
      } catch (e) {
        this.$message.error('导出失败')
      }
      this.exporting = false
    }
  }
}
</script>
