<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form ref="form" :model="form" :rules="rulesObj">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input v-model="form.repassword" type="password" placeholder="请再次确认密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="registerFn" class="btn-reg">注册</el-button>
           <el-link type="info" @click="$router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 经验:
// 前端绑定数据对象属性名,可以直接给要调用的功能接口的参数名一致
// 好处:我们可以直接把数据(带着同名的属性和前端的值)发送给后台
import { registerAPI } from '@/api'
export default {
  name: 'myRegister',
  data () {
    // 注意:必须在 data 中定义此箭头函数,才能确保 this.form可以使用
    const samePwdFn = (rule, value, callback) => {
      // 如果验证失败,则指定一个 Error 对象
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致！'))
      } else {
        // 如果验证成功,则直接调用 callback 函数
        callback()
      }
    }
    return {
      // 表单数据对象
      form: {
        // 用户名
        username: '',
        // 密码
        password: '',
        // 确认密码
        repassword: ''
      },
      // 表单校验规则对象
      rulesObj: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是长度1-10的大小写字母和数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' },
          { validator: samePwdFn, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 注册按钮的回调
    registerFn () {
      // js 兜底校验
      this.$refs.form.validate(async valid => {
        // 阻止默认提交行为(表单下面的红色提示会自动出现)
        if (!valid) return false
        // 调用注册接口
        const { data: res } = await registerAPI(this.form)
        console.log(res)
        // 注册失败,提示用户
        if (res.code !== 0) return this.$message.error(res.message)
        // 注册成功,提示用户
        this.$message.success(res.message)
        // 跳转到登录页面
        this.$router.push('/login')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.reg-container {
  background: url('~@/assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url('~@/assets/images/login_title.png') center no-repeat;
    }

    .btn-reg {
      width: 100%;
    }
  }
}
</style>
