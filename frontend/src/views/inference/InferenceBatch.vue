<template>
  <div class="inference-batch">
    <el-card>
      <div slot="header">
        <span>批量推理任务</span>
        <el-button style="float: right;" type="primary" @click="createTaskDialog = true">
          创建任务
        </el-button>
      </div>
      
      <el-table :data="taskList" v-loading="loading">
        <el-table-column prop="name" label="任务名称"></el-table-column>
        <el-table-column prop="model_name" label="使用模型"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 'completed' ? 'success' : 'warning'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.progress"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getInferenceTasks, createInferenceTask } from '@/api/inference'

export default {
  name: 'InferenceBatch',
  data() {
    return {
      loading: false,
      taskList: [],
      createTaskDialog: false
    }
  },
  mounted() {
    this.loadTasks()
  },
  methods: {
    async loadTasks() {
      this.loading = true
      try {
        const res = await getInferenceTasks()
        this.taskList = res.data.list || []
      } catch (e) {}
      this.loading = false
    }
  }
}
</script>
