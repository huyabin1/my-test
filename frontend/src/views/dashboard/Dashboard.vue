<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <i class="el-icon-folder stat-icon" style="color: #409EFF"></i>
            <div class="stat-info">
              <div class="stat-value">{{ stats.datasetCount }}</div>
              <div class="stat-label">数据集</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <i class="el-icon-edit stat-icon" style="color: #67C23A"></i>
            <div class="stat-info">
              <div class="stat-value">{{ stats.annotationCount }}</div>
              <div class="stat-label">标注数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <i class="el-icon-s-data stat-icon" style="color: #E6A23C"></i>
            <div class="stat-info">
              <div class="stat-value">{{ stats.trainingCount }}</div>
              <div class="stat-label">训练任务</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <i class="el-icon-s-platform stat-icon" style="color: #F56C6C"></i>
            <div class="stat-info">
              <div class="stat-value">{{ stats.deviceCount }}</div>
              <div class="stat-label">边缘设备</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <div slot="header">最近训练任务</div>
          <el-table :data="recentTasks" style="width: 100%">
            <el-table-column prop="name" label="任务名称"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status === 'completed' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="accuracy" label="准确率" width="100"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">设备状态</div>
          <div class="device-status">
            <div v-for="device in devices" :key="device.id" class="device-item">
              <span class="device-name">{{ device.name }}</span>
              <el-tag :type="device.status === 'online' ? 'success' : 'info'">
                {{ device.status }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      stats: {
        datasetCount: 12,
        annotationCount: 3650,
        trainingCount: 28,
        deviceCount: 5
      },
      recentTasks: [
        { name: '产品缺陷检测模型-v2', status: 'completed', accuracy: '96.5%' },
        { name: '零件分类模型-v1', status: 'completed', accuracy: '94.2%' },
        { name: '焊缝检测模型-v3', status: 'running', accuracy: '-' }
      ],
      devices: [
        { id: 1, name: 'Jetson Nano-01', status: 'online' },
        { id: 2, name: 'Jetson Xavier-01', status: 'online' },
        { id: 3, name: 'Edge Server-01', status: 'offline' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  .stat-card {
    display: flex;
    align-items: center;
    
    .stat-icon {
      font-size: 48px;
      margin-right: 20px;
    }
    
    .stat-info {
      .stat-value {
        font-size: 28px;
        font-weight: bold;
      }
      .stat-label {
        color: #999;
        font-size: 14px;
      }
    }
  }
  
  .device-status {
    .device-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
