<template>
  <div class="annotation-tasks">
    <el-card>
      <div slot="header" class="clearfix">
        <span>标注任务管理</span>
        <el-button style="float: right;" type="primary" @click="createTaskDialog = true">
          创建任务
        </el-button>
      </div>
      
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="任务名称">
          <el-input v-model="searchForm.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="待分发" value="pending"></el-option>
            <el-option label="进行中" value="in_progress"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已取消" value="cancelled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadTasks">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 任务列表 -->
      <el-table :data="taskList" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="任务名称" min-width="180"></el-table-column>
        <el-table-column prop="dataset_name" label="数据集" min-width="120"></el-table-column>
        <el-table-column prop="annotation_type" label="标注类型" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.annotation_type === 'classification'" type="success">分类</el-tag>
            <el-tag v-else-if="scope.row.annotation_type === 'detection'" type="warning">检测</el-tag>
            <el-tag v-else type="info">分割</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="distribute_type" label="分发方式" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.distribute_type === 'round_robin'">轮询分配</span>
            <span v-else-if="scope.row.distribute_type === 'ability'">能力匹配</span>
            <span v-else-if="scope.row.distribute_type === 'load_balance'">负载均衡</span>
            <span v-else>随机分配</span>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="180">
          <template slot-scope="scope">
            <el-progress :percentage="getProgress(scope.row)" :status="getProgressStatus(scope.row)"></el-progress>
            <span class="progress-text">{{ scope.row.annotated_images }}/{{ scope.row.total_images }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="160"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="viewTask(scope.row)">查看</el-button>
            <el-button type="text" @click="editTask(scope.row)">编辑</el-button>
            <el-button type="text" @click="distributeTask(scope.row)" v-if="scope.row.status === 'pending'">分发</el-button>
            <el-button type="text" @click="deleteTask(scope.row)" style="color: #F56C6C;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
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
    
    <!-- 创建任务对话框 -->
    <el-dialog title="创建标注任务" :visible.sync="createTaskDialog" width="600px">
      <el-form :model="taskForm" :rules="taskRules" ref="taskForm" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskForm.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="目标数据集" prop="dataset_id">
          <el-select v-model="taskForm.dataset_id" placeholder="请选择数据集" @change="handleDatasetChange">
            <el-option v-for="ds in datasets" :key="ds.id" :label="ds.name" :value="ds.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标注类型" prop="annotation_type">
          <el-radio-group v-model="taskForm.annotation_type">
            <el-radio label="classification">图像分类</el-radio>
            <el-radio label="detection">目标检测</el-radio>
            <el-radio label="segmentation">图像分割</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分发方式" prop="distribute_type">
          <el-select v-model="taskForm.distribute_type" placeholder="请选择分发方式">
            <el-option label="轮询分配" value="round_robin"></el-option>
            <el-option label="能力匹配" value="ability"></el-option>
            <el-option label="负载均衡" value="load_balance"></el-option>
            <el-option label="随机分配" value="random"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker v-model="taskForm.deadline" type="datetime" placeholder="选择截止时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="优先级">
          <el-input-number v-model="taskForm.priority" :min="0" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="标注员">
          <el-select v-model="taskForm.annotators" multiple placeholder="请选择标注员">
            <el-option v-for="user in annotators" :key="user.id" :label="user.name" :value="user.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="createTaskDialog = false">取消</el-button>
        <el-button type="primary" @click="submitTask">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTasks, createTask, distributeTask, deleteTask } from '@/api/annotation'
import { getDatasets } from '@/api/dataset'

export default {
  name: 'AnnotationTasks',
  data() {
    return {
      loading: false,
      taskList: [],
      datasets: [],
      annotators: [],
      searchForm: {
        name: '',
        status: ''
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      createTaskDialog: false,
      taskForm: {
        name: '',
        dataset_id: null,
        annotation_type: 'detection',
        distribute_type: 'load_balance',
        deadline: null,
        priority: 0,
        annotators: []
      },
      taskRules: {
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        dataset_id: [{ required: true, message: '请选择数据集', trigger: 'change' }],
        annotation_type: [{ required: true, message: '请选择标注类型', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.loadTasks()
    this.loadDatasets()
    this.loadAnnotators()
  },
  methods: {
    async loadTasks() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...this.searchForm
        }
        const res = await getTasks(params)
        this.taskList = res.data.list || []
        this.pagination.total = res.data.total || 0
      } catch (e) {
        console.error('加载任务失败', e)
      }
      this.loading = false
    },
    async loadDatasets() {
      try {
        const res = await getDatasets({ limit: 100 })
        this.datasets = res.data.list || []
      } catch (e) {
        console.error('加载数据集失败', e)
      }
    },
    async loadAnnotators() {
      // 模拟标注员数据
      this.annotators = [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
        { id: 3, name: '王五' }
      ]
    },
    handleDatasetChange(datasetId) {
      const ds = this.datasets.find(d => d.id === datasetId)
      if (ds) {
        this.taskForm.total_images = ds.image_count
      }
    },
    handlePageChange(page) {
      this.pagination.page = page
      this.loadTasks()
    },
    resetSearch() {
      this.searchForm = { name: '', status: '' }
      this.loadTasks()
    },
    getProgress(task) {
      if (!task.total_images) return 0
      return Math.round((task.annotated_images / task.total_images) * 100)
    },
    getProgressStatus(task) {
      const progress = this.getProgress(task)
      if (progress === 100) return 'success'
      if (progress > 50) return ''
      return 'exception'
    },
    getStatusType(status) {
      const types = {
        pending: 'info',
        in_progress: 'warning',
        completed: 'success',
        cancelled: 'danger'
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        pending: '待分发',
        distributing: '分发中',
        in_progress: '进行中',
        completed: '已完成',
        cancelled: '已取消'
      }
      return texts[status] || status
    },
    viewTask(task) {
      this.$router.push({ path: '/annotation/workspace', query: { taskId: task.id } })
    },
    editTask(task) {
      this.$message.info('编辑功能开发中')
    },
    async submitTask() {
      this.$refs.taskForm.validate(async valid => {
        if (valid) {
          try {
            await createTask(this.taskForm)
            this.$message.success('创建成功')
            this.createTaskDialog = false
            this.loadTasks()
            this.resetTaskForm()
          } catch (e) {
            this.$message.error('创建失败')
          }
        }
      })
    },
    async handleDistribute(task) {
      try {
        await distributeTask(task.id)
        this.$message.success('分发成功')
        this.loadTasks()
      } catch (e) {
        this.$message.error('分发失败')
      }
    },
    async handleDelete(task) {
      try {
        await this.$confirm('确认删除此任务?', '提示', { type: 'warning' })
        await deleteTask(task.id)
        this.$message.success('删除成功')
        this.loadTasks()
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    resetTaskForm() {
      this.taskForm = {
        name: '',
        dataset_id: null,
        annotation_type: 'detection',
        distribute_type: 'load_balance',
        deadline: null,
        priority: 0,
        annotators: []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.annotation-tasks {
  .search-form {
    margin-bottom: 20px;
  }
  
  .progress-text {
    font-size: 12px;
    color: #999;
  }
}
</style>
