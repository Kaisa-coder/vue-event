<template>
  <div>
    <el-card class="box-card">
    <div slot="header" class="clearfix header-box">
      <span>文章分类</span>
      <el-button type="primary" size="mini" @click="addCateBtnFn">添加分类</el-button>
    </div>
    <el-table style="width: 100%" :data="cateList" border stripe>
      <el-table-column label="序号" type="index" width="100"></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名"  prop="cate_alias"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="updateFn(row)">修改</el-button>
          <el-button type="danger" size="mini" @click="removeFn(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <!-- .sync作用实现双向数据绑定
          会在运行时给所在标签绑定 @update:属性名的事件, 把接收到子组件内传来的值赋予给右侧Vue变量
          组件内$emit('update:visible', true)
          这个update: 是固定的
    -->
    <el-dialog :title="isEdit?'编辑文章分类':'添加文章分类'" :visible.sync="addVisible" width="35%" @closed="onAddClosedFn">
    <el-form ref="addRef" :model="addForm" :rules="addRules" label-width="100px">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="addForm.cate_name" ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="addForm.cate_alias"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"  class="dialog-footer">
      <el-button @click="cancelFn" size="mini" >取消</el-button>
      <el-button type="primary" @click="addFn" size="mini">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, addArtCateAPI, updateArtCateAPI, delArtCateAPI } from '@/api'
export default {
  name: 'artCate',
  data () {
    return {
      // 存储文章分类列表
      cateList: [],
      // 添加分类--对话框是否显示
      addVisible: false,
      // 添加表单的数据对象
      addForm: {
        // 文章分类名字
        cate_name: '',
        // 文章分类别名
        cate_alias: ''
      },
      // 添加表单验证规则对象
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      },
      // 要修改的文章id
      editId: '',
      // 保存编辑状态(false 新增, true 编辑)
      isEdit: false
    }
  },
  created () {
    this.initCateListFn()
  },
  methods: {
    // 获取文章分类
    async initCateListFn () {
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    },
    // 对话框内--添加按钮--点击事件
    // 对话框内-添加按钮-点击事件
    async addFn () {
      // 表单预校验
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          // 判断当前是新增还是编辑
          if (this.isEdit) {
            // 编辑状态
            // 调用接口传递数据给后台
            const { data: res } = await updateArtCateAPI({ id: this.editId, ...this.addForm })
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          } else {
            // 新增
            // 调用接口传递数据给后台
            const { data: res } = await addArtCateAPI(this.addForm)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          }

          // 重新请求列表数据
          this.initCateListFn()
          // 关闭对话框
          this.addVisible = false
        } else {
          return false
        }
      })
    },
    // 对话框内--取消按钮--点击事件
    cancelFn () {
      this.addVisible = false
    },
    onAddClosedFn () {
      this.$refs.addRef.resetFields()
    },
    // 修改按钮--点击事件
    updateFn (obj) {
      this.editId = obj.id // 保存要编辑的文章分类ID
      this.isEdit = true // 设置编辑状态
      this.addVisible = true // 让对话框显示
      // 设置数据回显
      this.$nextTick(() => {
        // 先让对话框出现, 它绑定空值的对象, 才能resetFields清空用初始空值
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    // 添加分类->点击出对话框
    addCateBtnFn () {
      this.addVisible = true // 让对话框出现
      this.editId = '' // 编辑的文章分类id设置无
      this.isEdit = false // 编辑的状态关闭
    },
    // 删除--文章类
    async removeFn (id) {
      const { data: res } = await delArtCateAPI(id)
      console.log(res)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 重新请求列表数据
      this.initCateListFn()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
