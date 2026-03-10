<template>
  <div class="device-list">
    <el-card>
      <div slot="header" class="clearfix">
        <span>边缘设备列表</span>
        <el-button style="float: right;" type="primary" @click="addDeviceDialog = true">
          添加设备
        </el-button>
      </div>
      
      <el-table :data="deviceList" v-loading="loading">
        <el-table-column prop="name" label="设备名称"></el-table-column>
        <el-table-column prop="device_type" label="设备类型"></el-table-column>
        <el-table-column prop="ip_address" label="IP地址"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 'online' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="last_online" label="最后在线"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDevice(scope.row)">详情</el-button>
            <el-button type="text" @click="deployToDevice(scope.row)">部署模型</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getDevices, addDevice } from '@/api/device'

export default {
  name: 'DeviceList',
  data() {
    return {
      loading: false,
      deviceList: [],
      addDeviceDialog: false
    }
  },
  mounted() {
    this.loadDevices()
  },
  methods: {
    async loadDevices() {
      this.loading = true
      try {
        const res = await getDevices()
        this.deviceList = res.data.list || []
      } catch (e) {}
      this.loading = false
    },
    viewDevice(device) {
      this.$message.info('查看设备详情')
    },
    deployToDevice(device) {
      this.$router.push({ path: '/device/deploy', query: { deviceId: device.id } })
    }
  }
}
</script>
