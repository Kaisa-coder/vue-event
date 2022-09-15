<template>
  <!-- 登录页面的整体盒子 -->
  <div class="login-container">
    <!-- 登录的盒子 -->
    <div class="login-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 登录的表单区域 -->
      <el-form ref="loginRef" :model="loginForm" :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="loginFn">登录</el-button>
          <!-- <el-link type="info" @click="$router.push('/register')">去注册</el-link> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { mapMutations } from 'vuex'
import { setToken } from '@/utils/token'
export default {
  name: 'myLogin',
  data () {
    return {
      // 登录表单的数据对象
      loginForm: {
        username: '',
        password: ''
      },
      // 登录表单的验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10位字母或数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['updateToken']),
    // 登录按钮的点击事件
    async loginFn () {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await loginAPI(this.loginForm)
        // 失败
        if (res.code !== 0) return this.$message.error(res.message)
        // 成功
        this.$message.success(res.message)
        this.updateToken(res.token)
        setToken(res.token)
        // 登录成功跳转到 layout
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  background:url('~@/assets/images/login_bg.jpg');
  background-size: cover;
  height: 100%;
  .login-box{
    width: 400px;
    height: 270px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50% ,-50%);
    padding: 0 30px;
    box-sizing: border-box;
    .title-box {
      height: 60px;
      background: url('~@/assets/images/login_title.png') center no-repeat;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
