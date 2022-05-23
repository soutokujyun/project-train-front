<template>
  <el-container>
    <el-header>
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item index="0">
          <img src="/logo.png" alt="" />
        </el-menu-item>
        <el-menu-item>
          <nuxt-link to="/"></nuxt-link>
        </el-menu-item>
        <template v-if="userInfo.id">
          <el-menu-item>
            <a href="">退出</a>
          </el-menu-item>
          <el-menu-item>
            <nuxt-link to="/uc">{{ userInfo.nickname }}</nuxt-link>
          </el-menu-item>
          <el-menu-item>
            <nuxt-link to="/editor/new">写文章</nuxt-link>
          </el-menu-item>
          <el-menu-item>
            <nuxt-link to="/pdm">文档管理</nuxt-link>
          </el-menu-item>
        </template>
        <template v-else>
          <el-menu-item>
            <nuxt-link to="/register">注册</nuxt-link>
          </el-menu-item>
          <el-menu-item>
            <nuxt-link to="/login">登录</nuxt-link>
          </el-menu-item>
        </template>
      </el-menu>
    </el-header>
    <el-main>
      <nuxt />
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {
  mounted() {
    this.getUserInfo();
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    },
  },
  methods: {
    async getUserInfo() {
      const token = localStorage.getItem("token");
      if (token) {
        this.$store.dispatch("user/detail");
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
