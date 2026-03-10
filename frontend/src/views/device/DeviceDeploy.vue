<template>
  <div class="device-deploy">
    <el-card>
      <div slot="header">
        <span>模型部署到边缘设备</span>
      </div>
      
      <el-form :model="deployForm" label-width="120px">
        <el-form-item label="选择模型">
          <el-select v-model="deployForm.model_id" placeholder="请选择模型">
            <el-option v-for="model in models" :key="model.id" :label="model.name + ' ' + model.version" :value="model.id"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="目标设备">
          <el-select v-model="deployForm.device_id" placeholder="请选择设备">
            <el-option v-for="device in devices" :key="device.id" :label="device.name" :value="device.id"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="模型优化">
          <el-checkbox-group v-model="deployForm.optimize">
            <el-checkbox label="quantization">量化 (INT8)</el-checkbox>
            <el-checkbox label="pruning">剪枝</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="startDeploy" :loading="deploying">开始部署</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getModels } from '@/api/model'
import { getDevices, deployModel } from '@/api/device'

export default {
  name: 'DeviceDeploy',
  data() {
    return {
      models: [],
      devices: [],
      deployForm: {
        model_id: null,
        device_id: null,
        optimize: ['quantization']
      },
      deploying: false
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const [modelsRes, devicesRes] = await Promise.all([getModels(), getDevices()])
        this.models = modelsRes.data.list || []
        this.devices = devicesRes.data.list || []
        
        if (this.$route.query.modelId) {
          this.deployForm.model_id = parseInt(this.$route.query.modelId)
        }
        if (this.$route.query.deviceId) {
          this.deployForm.device_id = parseInt(this.$route.query.deviceId)
        }
      } catch (e) {}
    },
    async startDeploy() {
      if (!this.deployForm.model_id || !this.deployForm.device_id) {
        this.$message.warning('请选择模型和设备')
        return
      }
      this.deploying = true
      try {
        await deployModel(this.deployForm)
        this.$message.success('部署成功')
      } catch (e) {
        this.$message.error('部署失败')
      }
      this.deploying = false
    }
  }
}
</script>
