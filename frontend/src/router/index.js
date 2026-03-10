import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

// 静态路由
const staticRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue')
  }
]

// 动态路由（从后台获取）
export const asyncRoutes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/layout/MainLayout.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'DashboardHome',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: '首页', icon: 'el-icon-s-home' }
      }
    ]
  },
  // 系统管理
  {
    path: '/system',
    name: 'System',
    component: () => import('@/views/layout/MainLayout.vue'),
    meta: { title: '系统管理', icon: 'el-icon-s-tools' },
    children: [
      {
        path: '/system/users',
        name: 'SystemUsers',
        component: () => import('@/views/system/Users.vue'),
        meta: { title: '用户管理', permission: 'system:user:list' }
      },
      {
        path: '/system/roles',
        name: 'SystemRoles',
        component: () => import('@/views/system/Roles.vue'),
        meta: { title: '角色管理', permission: 'system:role:list' }
      },
      {
        path: '/system/menus',
        name: 'SystemMenus',
        component: () => import('@/views/system/Menus.vue'),
        meta: { title: '菜单管理', permission: 'system:menu:list' }
      }
    ]
  },
  // 数据集管理
  {
    path: '/dataset',
    name: 'Dataset',
    component: () => import('@/views/layout/MainLayout.vue'),
    meta: { title: '数据集管理', icon: 'el-icon-folder' },
    children: [
      {
        path: '/dataset/list',
        name: 'DatasetList',
        component: () => import('@/views/dataset/DatasetList.vue'),
        meta: { title: '数据集列表', permission: 'dataset:list' }
      },
      {
        path: '/dataset/import',
        name: 'DatasetImport',
        component: () => import('@/views/dataset/DatasetImport.vue'),
        meta: { title: '数据集导入', permission: 'dataset:import' }
      }
    ]
  },
  // 标注管理
  {
    path: '/annotation',
    name: 'Annotation',
    component: () => import('@/views/layout/MainLayout.vue'),
    meta: { title: '标注管理', icon: 'el-icon-edit' },
    children: [
      {
        path: '/annotation/tasks',
        name: 'AnnotationTasks',
        component: () => import('@/views/annotation/AnnotationTasks.vue'),
        meta: { title: '标注任务', permission: 'annotation:task:list' }
      },
      {
        path: '/annotation/workspace',
        name: 'AnnotationWorkspace',
        component: () => import('@/views/annotation/AnnotationWorkspace.vue'),
        meta: { title: '标注工作台', permission: 'annotation:workspace' }
      },
      {
        path: '/annotation/review',
        name: 'AnnotationReview',
        component: () => import('@/views/annotation/AnnotationReview.vue'),
        meta: { title: '标注审核', permission: 'annotation:review' }
      }
    ]
  },
  // 模型训练
  {
    path: '/training',
    name: 'Training',
    component: () => import('@/views/layout/MainLayout.vue'),
    meta: { title: '模型训练', icon: 'el-icon-s-data' },
    children: [
      {
        path: '/training/tasks',
        name: 'TrainingTasks',
        component: () => import('@/views/training/TrainingTasks.vue'),
        meta: { title: '训练任务', permission: 'training:task:list' }
      },
      {
        path: '/training/config',
        name: 'TrainingConfig',
        component: () => import('@/views/training/TrainingConfig.vue'),
        meta: { title: '训练配置', permission: 'training:config' }
      }
    ]
  },
  // 模型管理
  {
    path: '/model',
    name: 'Model',
    component: () => import('@/views/layout/MainLayout.vue'),
    meta: { title: '模型管理', icon: 'el-icon-s-marketing' },
    children: [
      {
        path: '/model/list',
        name: 'ModelList',
        component: () => import('@/views/model/ModelList.vue'),
        meta: { title: '模型列表', permission: 'model:list' }
      },
      {
        path: '/model/export',
        name: 'ModelExport',
        component: () => import('@/views/model/ModelExport.vue'),
        meta: { title: '模型导出', permission: 'model:export' }
      }
    ]
  },
  // 推理服务
  {
    path: '/inference',
    name: 'Inference',
    component: () => import('@/views/layout/MainLayout.vue'),
    meta: { title: '推理服务', icon: 'el-icon-s-operation' },
    children: [
      {
        path: '/inference/realtime',
        name: 'InferenceRealtime',
        component: () => import('@/views/inference/InferenceRealtime.vue'),
        meta: { title: '实时推理', permission: 'inference:realtime' }
      },
      {
        path: '/inference/batch',
        name: 'InferenceBatch',
        component: () => import('@/views/inference/InferenceBatch.vue'),
        meta: { title: '批量推理', permission: 'inference:batch' }
      }
    ]
  },
  // 边缘设备
  {
    path: '/device',
    name: 'Device',
    component: () => import('@/views/layout/MainLayout.vue'),
    meta: { title: '边缘设备', icon: 'el-icon-s-platform' },
    children: [
      {
        path: '/device/list',
        name: 'DeviceList',
        component: () => import('@/views/device/DeviceList.vue'),
        meta: { title: '设备列表', permission: 'device:list' }
      },
      {
        path: '/device/deploy',
        name: 'DeviceDeploy',
        component: () => import('@/views/device/DeviceDeploy.vue'),
        meta: { title: '设备部署', permission: 'device:deploy' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: staticRoutes
})

// 路由白名单
const whiteList = ['/login']

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const hasToken = store.getters.token
  
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          const { roles } = await store.dispatch('user/getInfo')
          
          // 生成可访问路由
          await store.dispatch(' const accessRoutes =permission/generateRoutes', roles)
          
          // 动态添加路由
          router.addRoutes(accessRoutes)
          
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/logout')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
