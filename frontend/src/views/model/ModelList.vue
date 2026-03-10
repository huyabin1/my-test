<template>
  <div class="model-list">
    <el-card>
      <div slot="header" class="clearfix">
        <span>模型列表</span>
      </div>
      
      <el-table :data="modelList" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="模型名称" min-width="150"></el-table-column>
        <el-table-column prop="version" label="版本" width="80"></el-table-column>
        <el-table-column prop="task_type" label="任务类型" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.task_type === 'classification'" type="success">分类</el-tag>
            <el-tag v-else-if="scope.row.task_type === 'detection'" type="warning">检测</el-tag>
            <el-tag v-else type="info">分割</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="architecture" label="模型架构" width="120"></el-table-column>
        <el-table-column label="准确率" width="100">
          <template slot-scope="scope">
            {{ scope.row.metrics && scope.row.metrics.accuracy ? scope.row.metrics.accuracy + '%' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 'trained' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="160"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="viewModel(scope.row)">查看</el-button>
            <el-button type="text" @click="exportModel(scope.row)">导出</el-button>
            <el-button type="text" @click="deployModel(scope.row)">部署</el-button>
            <el-button type="text" @click="deleteModel(scope.row)" style="color: #F56C6C;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getModels, deleteModel } from '@/api/model'

export default {
  name: 'ModelList',
  data() {
    return {
      loading: false,
      modelList: []
    }
  },
  mounted() {
    this.loadModels()
  },
  methods: {
    async loadModels() {
      this.loading = true
      try {
        const res = await getModels()
        this.modelList = res.data.list || []
      } catch (e) {
        console.error('加载失败', e)
      }
      this.loading = false
    },
    viewModel(model) {
      this.$message.info('查看模型详情')
    },
    exportModel(model) {
      this.$router.push({ path: '/model/export', query: { modelId: model.id } })
    },
    deployModel(model) {
      this.$router.push({ path: '/device/deploy', query: { modelId: model.id } })
    },
    async handleDelete(model) {
      try {
        await this.$confirm('确认删除此模型?', '提示', { type: 'warning' })
        await deleteModel(model.id)
        this.$message.success('删除成功')
        this.loadModels()
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    }
  }
}
</script>
