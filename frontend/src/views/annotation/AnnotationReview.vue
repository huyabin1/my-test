<template>
  <div class="annotation-review">
    <el-card>
      <div slot="header">
        <span>标注审核</span>
      </div>
      
      <!-- 审核列表 -->
      <el-table :data="reviewList" v-loading="loading" style="width: 100%">
        <el-table-column prop="task_name" label="任务名称" min-width="150"></el-table-column>
        <el-table-column prop="image_name" label="图像" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.image_url" class="image-preview" @click="previewImage(scope.row)">
          </template>
        </el-table-column>
        <el-table-column prop="annotator_name" label="标注员" width="100"></el-table-column>
        <el-table-column prop="annotation_count" label="标注数" width="80"></el-table-column>
        <el-table-column prop="created_at" label="标注时间" width="160"></el-table-column>
        <el-table-column label="审核状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.review_status === 'pending'" type="info">待审核</el-tag>
            <el-tag v-else-if="scope.row.review_status === 'approved'" type="success">已通过</el-tag>
            <el-tag v-else type="danger">已驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetail(scope.row)">查看详情</el-button>
            <el-button type="text" @click="approveAnnotation(scope.row)" v-if="scope.row.review_status === 'pending'">通过</el-button>
            <el-button type="text" @click="rejectAnnotation(scope.row)" v-if="scope.row.review_status === 'pending'" style="color: #F56C6C;">驳回</el-button>
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
    
    <!-- 详情对话框 -->
    <el-dialog title="标注详情" :visible.sync="detailDialog" width="800px">
      <div class="detail-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="image-container">
              <img :src="currentDetail.image_url" alt="">
              <div v-for="ann in currentDetail.annotations" :key="ann.id" class="annotation-overlay">
                <div class="bbox" :style="getBboxStyle(ann)">
                  <span class="label">{{ ann.category_name }}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form label-width="80px">
              <el-form-item label="任务名称">
                <span>{{ currentDetail.task_name }}</span>
              </el-form-item>
              <el-form-item label="标注员">
                <span>{{ currentDetail.annotator_name }}</span>
              </el-form-item>
              <el-form-item label="标注数">
                <span>{{ currentDetail.annotation_count }}</span>
              </el-form-item>
              <el-form-item label="标注时间">
                <span>{{ currentDetail.created_at }}</span>
              </el-form-item>
              <el-form-item label="标注详情">
                <el-table :data="currentDetail.annotations" size="small">
                  <el-table-column prop="category_name" label="类别"></el-table-column>
                  <el-table-column label="位置">
                    <template slot-scope="scope">
                      <span v-if="scope.row.bbox">
                        x:{{ Math.round(scope.row.bbox[0]) }}, y:{{ Math.round(scope.row.bbox[1]) }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="驳回原因" v-if="currentDetail.review_status === 'rejected'">
                <el-input type="textarea" v-model="currentDetail.reject_reason" disabled></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" v-if="currentDetail.review_status === 'pending'">
        <el-button @click="detailDialog = false">取消</el-button>
        <el-button type="danger" @click="rejectDetail">驳回</el-button>
        <el-button type="primary" @click="approveDetail">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getReviewList, approveAnnotation, rejectAnnotation } from '@/api/annotation'

export default {
  name: 'AnnotationReview',
  data() {
    return {
      loading: false,
      reviewList: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      detailDialog: false,
      currentDetail: {}
    }
  },
  mounted() {
    this.loadReviewList()
  },
  methods: {
    async loadReviewList() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        const res = await getReviewList(params)
        this.reviewList = res.data.list || []
        this.pagination.total = res.data.total || 0
      } catch (e) {
        console.error('加载审核列表失败', e)
      }
      this.loading = false
    },
    handlePageChange(page) {
      this.pagination.page = page
      this.loadReviewList()
    },
    viewDetail(row) {
      this.currentDetail = { ...row }
      this.detailDialog = true
    },
    previewImage(row) {
      this.viewDetail(row)
    },
    getBboxStyle(ann) {
      if (!ann.bbox) return {}
      return {
        left: ann.bbox[0] + 'px',
        top: ann.bbox[1] + 'px',
        width: ann.bbox[2] + 'px',
        height: ann.bbox[3] + 'px'
      }
    },
    async approveAnnotation(row) {
      try {
        await approveAnnotation(row.id)
        this.$message.success('审核通过')
        this.loadReviewList()
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    async rejectAnnotation(row) {
      const { value } = await this.$prompt('请输入驳回原因', '驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入驳回原因'
      })
      
      try {
        await rejectAnnotation(row.id, { reason: value })
        this.$message.success('已驳回')
        this.loadReviewList()
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error('操作失败')
        }
      }
    },
    async approveDetail() {
      await this.approveAnnotation(this.currentDetail)
      this.detailDialog = false
    },
    async rejectDetail() {
      await this.rejectAnnotation(this.currentDetail)
      this.detailDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.annotation-review {
  .image-preview {
    width: 80px;
    height: 60px;
    object-fit: cover;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .detail-content {
    .image-container {
      position: relative;
      background: #000;
      
      img {
        width: 100%;
        display: block;
      }
      
      .annotation-overlay {
        position: absolute;
        top: 0;
        left: 0;
        
        .bbox {
          position: absolute;
          border: 2px solid #F56C6C;
          
          .label {
            position: absolute;
            top: -20px;
            left: 0;
            background: #F56C6C;
            color: #fff;
            padding: 2px 6px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
