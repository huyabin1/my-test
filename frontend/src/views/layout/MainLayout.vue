<template>
  <div class="main-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="logo">
          <img v-if="!isCollapse" src="@/assets/logo.png" alt="logo">
          <span v-if="!isCollapse">视觉智能平台</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/dashboard">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          
          <el-submenu index="/system">
            <template slot="title">
              <i class="el-icon-s-tools"></i>系统管理>
              <span</span>
            </template>
            <el-menu-item index="/system/users">用户管理</el-menu-item>
            <el-menu-item index="/system/roles">角色管理</el-menu-item>
            <el-menu-item index="/system/menus">菜单管理</el-menu-item>
          </el-submenu>
          
          <el-submenu index="/dataset">
            <template slot="title">
              <i class="el-icon-folder"></i>
              <span>数据集管理</span>
            </template>
            <el-menu-item index="/dataset/list">数据集列表</el-menu-item>
            <el-menu-item index="/dataset/import">数据集导入</el-menu-item>
          </el-submenu>
          
          <el-submenu index="/annotation">
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span>标注管理</span>
            </template>
            <el-menu-item index="/annotation/tasks">标注任务</el-menu-item>
            <el-menu-item index="/annotation/workspace">标注工作台</el-menu-item>
            <el-menu-item index="/annotation/review">标注审核</el-menu-item>
          </el-submenu>
          
          <el-submenu index="/training">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span>模型训练</span>
            </template>
            <el-menu-item index="/training/tasks">训练任务</el-menu-item>
            <el-menu-item index="/training/config">训练配置</el-menu-item>
          </el-submenu>
          
          <el-submenu index="/model">
            <template slot="title">
              <i class="el-icon-s-marketing"></i>
              <span>模型管理</span>
            </template>
            <el-menu-item index="/model/list">模型列表</el-menu-item>
            <el-menu-item index="/model/export">模型导出</el-menu-item>
          </el-submenu>
          
          <el-submenu index="/inference">
            <template slot="title">
              <i class="el-icon-s-operation"></i>
              <span>推理服务</span>
            </template>
            <el-menu-item index="/inference/realtime">实时推理</el-menu-item>
            <el-menu-item index="/inference/batch">批量推理</el-menu-item>
          </el-submenu>
          
          <el-submenu index="/device">
            <template slot="title">
              <i class="el-icon-s-platform"></i>
              <span>边缘设备</span>
            </template>
            <el-menu-item index="/device/list">设备列表</el-menu-item>
            <el-menu-item index="/device/deploy">设备部署</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      
      <el-container>
        <!-- 头部 -->
        <el-header>
          <div class="header-left">
            <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="toggleSidebar"></i>
          </div>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <img :src="avatar" class="user-avatar">
                <span class="user-name">{{ name }}</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        
        <!-- 内容区 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MainLayout',
  data() {
    return {
      isCollapse: false
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar']),
    activeMenu() {
      return this.$route.path
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapse = !this.isCollapse
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.$store.dispatch('user/logout').then(() => {
          this.$router.push('/login')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  
  .el-container {
    height: 100%;
  }
  
  .el-aside {
    background-color: #304156;
    transition: width 0.3s;
    
    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      background: #2b3a4a;
      
      img {
        height: 32px;
        margin-right: 10px;
      }
    }
    
    .el-menu {
      border-right: none;
    }
  }
  
  .el-header {
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    
    .header-left i {
      font-size: 20px;
      cursor: pointer;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      
      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  
  .el-main {
    background: #f0f2f5;
    padding: 20px;
  }
}
</style>
