<template>
  <el-card  class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
       <!-- 图片，用来展示用户选择的头像 -->
      <img class="the_img" v-if="!this.avatar" src="@/assets/images/avatar.jpg" alt="" />
      <img  class="the_img" v-else :src="avatar" alt="">

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display:none;" ref="iptRef" @change="onFileChange">
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="uploadFn">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateAvatarAPI } from '@/api'
export default {
  name: 'userAvatar',
  data () {
    return {
      // 保存图片链接或base64字符串
      avatar: ''
    }
  },
  methods: {
    // 选择图片的点击事件
    chooseImg () {
      // 目的:为了让 input 标签,让他再用 JS 代码来触发它的点击事件(导致它的默认行为给一个问价选择窗口)
      // 原因:input 是原生的标签,样式不太好改
      // 解决方案:移花接木
      this.$refs.iptRef.click()
    },
    // 选择图片确定
    onFileChange (e) {
      // 拿到用户选择的文件数据
      const files = e.target.files
      console.log(files)
      if (files.length === 0) {
        // 没有选择图片
        this.avatar = ''
      } else {
        // 选择了图片 目前只能选一个 如果选了多个,需要加额外的属性
        // console.log(files[0])
        // 选择图片文件,进行前端预览
        // 注意: img 标签的 src 属性值
        //  只能是图片的"链接地址"外链式(http:// 开头,图片文件相对路径
        // 或者是图片的 base64 字符串(而且字符串还必须是 data:image/png;base64, 开头 ,图片转 base64 的字符串)
        // 方案1:文件转内存地址(这个只能在 js 内存里用,不能发给后台)
        // 语法: URL.createObjectURL(文件) 返回值:内存临时地址
        // this.avatar = URL.createObjectURL(files[0])
        // 方式2: 使用 FileReader 来读取选择的前端文件, 转换为base64字符串, 给img标签渲染
        // 创建 FileReader 对象
        const fr = new FileReader()
        // 调用 readAsDataURL 函数，读取文件内容
        fr.readAsDataURL(files[0])
        // 监听 fr 的 onload 事件
        fr.onload = async e => {
          // 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
          this.avatar = e.target.result
          // 调用接口,传递给后台并根据返回结果给用户提示
        }
      }
    },
    // 上传头像
    async uploadFn () {
      const { data: res } = await updateAvatarAPI(this.avatar)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 立刻让vuex 里的 action 再请求一次后台,进行更新 vuex 的数据
      this.$store.dispatch('initUserInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img{
    width: 350px;
    height: 350px;
}
</style>
