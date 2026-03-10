<template>
  <div class="training-tasks">
    <el-card>
      <div slot="header" class="clearfix">
        <span>训练任务管理</span>
        <el-button style="float: right;" type="primary" @click="createTaskDialog = true">
          创建训练任务
        </el-button>
      </div>
      
      <!-- 任务列表 -->
      <el-table :data="taskList" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="任务名称" min-width="180"></el-table-column>
        <el-table-column prop="task_type" label="任务类型" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.task_type === 'classification'" type="success">分类</el-tag>
            <el-tag v-else-if="scope.row.task_type === 'detection'" type="warning">检测</el-tag>
            <el-tag v-else type="info">分割</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="model_architecture" label="模型架构" width="120"></el-table-column>
        <el-table-column label="进度" width="180">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.progress" :status="getProgressStatus(scope.row)"></el-progress>
            <span class="progress-text">Epoch {{ scope.row.current_epoch }}/{{ scope.row.total_epochs }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="metrics" label="准确率" width="100">
          <template slot-scope="scope">
            {{ scope.row.metrics && scope.row.metrics.accuracy ? scope.row.metrics.accuracy + '%' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="160"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="viewTask(scope.row)">查看</el-button>
            <el-button type="text" @click="pauseTask(scope.row)" v-if="scope.row.status === 'running'">暂停</el-button>
            <el-button type="text" @click="resumeTask(scope.row)" v-if="scope.row.status === 'paused'">恢复</el-button>
            <el-button type="text" @click="stopTask(scope.row)" v-if="scope.row.status !== 'completed' && scope.row.status !== 'failed'" style="color: #F56C6C;">停止</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        @current-change="handlePageChange"
        :current-page="pagination.page"
        :page-size="pagination.limit"
        :total="pagination.total"
        layout="total, prev, pager, next"
        style="margin-top: 20px; text-align: right;"
      >
      </el-pagination>
    </el-card>
    
    <!-- 任务详情对话框 -->
    <el-dialog :title="taskDetail.name" :visible.sync="detailDialog" width="900px">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="metrics-chart">
            <div class="chart-title">训练曲线</div>
            <div ref="chartRef" style="height: 300px;"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <el-form label-width="100px">
            <el-form-item label="任务名称">
              <span>{{ taskDetail.name }}</span>
            </el-form-item>
            <el-form-item label="任务类型">
              <span>{{ taskDetail.task_type }}</span>
            </el-form-item>
            <el-form-item label="模型架构">
              <span>{{ taskDetail.model_architecture }}</span>
            </el-form-item>
            <el-form-item label="数据集">
              <span>{{ taskDetail.dataset_name }}</span>
            </el-form-item>
            <el-form-item label="当前轮次">
              <span>{{ taskDetail.current_epoch }} / {{ taskDetail.total_epochs }}</span>
            </el-form-item>
            <el-form-item label="训练进度">
              <el-progress :percentage="taskDetail.progress"></el-progress>
            </el-form-item>
            <el-form-item label="GPU设备">
              <span>{{ taskDetail.gpu_device }}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="detailDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getTrainingTasks, getTrainingTaskDetail, pauseTraining, resumeTraining, stopTraining } from '@/api/training'

export default {
  name: 'TrainingTasks',
  data() {
    return {
      loading: false,
      taskList: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      detailDialog: false,
      taskDetail: {},
      chart: null
    }
  },
  mounted() {
    this.loadTasks()
  },
  methods: {
    async loadTasks() {
      this.loading = true
      try {
        const params = { page: this.pagination.page, limit: this.pagination.limit }
        const res = await getTrainingTasks(params)
        this.taskList = res.data.list || []
        this.pagination.total = res.data.total || 0
      } catch (e) {
        console.error('加载失败', e)
      }
      this.loading = false
    },
    handlePageChange(page) {
      this.pagination.page = page
      this.loadTasks()
    },
    getStatusType(status) {
      const types = {
        pending: 'info',
        queued: 'warning',
        running: 'primary',
        paused: 'warning',
        completed: 'success',
        failed: 'danger'
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        pending: '待开始',
        queued: '排队中',
        running: '训练中',
        paused: '已暂停',
        completed: '已完成',
        failed: '失败'
      }
      return texts[status] || status
    },
    getProgressStatus(task) {
      if (task.status === 'completed') return 'success'
      if (task.status === 'failed') return 'exception'
      return ''
    },
    async viewTask(task) {
      try {
        const res = await getTrainingTaskDetail(task.id)
        this.taskDetail = res.data
        this.detailDialog = true
        this.$nextTick(() => {
          this.initChart()
        })
      } catch (e) {
        this.$message.error('加载详情失败')
      }
    },
    initChart() {
      if (!this.$refs.chartRef) return
      
      if (this.chart) {
        this.chart.dispose()
      }
      
      this.chart = echarts.init(this.$refs.chartRef)
      
      const lossData = this.taskDetail.metrics && this.taskDetail.metrics.loss || []
      const accData = this.taskDetail.metrics && this.taskDetail.metrics.accuracy || []
      
      this.chart.setOption({
        title: { text: '训练指标' },
        tooltip: { trigger: 'axis' },
        legend: { data: ['Loss', 'Accuracy'] },
        xAxis: { type: 'category', data: lossData.map((_, i) => i + 1) },
        yAxis: [
          { type: 'value', name: 'Loss', position: 'left' },
          { type: 'value', name: 'Accuracy', position: 'right', min: 0, max: 100 }
        ],
        series: [
          { name: 'Loss', type: 'line', data: lossData },
          { name: 'Accuracy', type: 'line', yAxisIndex: 1, data: accData }
        ]
      })
    },
    async pauseTask(task) {
      try {
        await pauseTraining(task.id)
        this.$message.success('已暂停')
        this.loadTasks()
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    async resumeTask(task) {
      try {
        await resumeTraining(task.id)
        this.$message.success('已恢复')
        this.loadTasks()
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    async stopTask(task) {
      try {
        await this.$confirm('确认停止训练?', '提示', { type: 'warning' })
        await stopTraining(task.id)
        this.$message.success('已停止')
        this.loadTasks()
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error('操作失败')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.training-tasks {
  .progress-text {
    font-size: 12px;
    color: #999;
  }
  
  .metrics-chart {
    .chart-title {
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
