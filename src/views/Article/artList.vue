<template>
  <div>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <div slot="header">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="search">
          <el-form-item label="文章分类">
            <el-select v-model="search.cate_id" placeholder="请选择分类" size="small">
              <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left:15px;">
            <el-select v-model="search.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initArtList">筛选</el-button>
            <el-button type="info" size="small" @click="resetList">重置</el-button>
          </el-form-item>
        </el-form>
      <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
      </div>
       <!-- 文章表格区域 -->
     <el-table
      :data="artList"
      style="width: 100%"
      border
      stripe>
      <el-table-column prop="title" label="文章标题">
        <template v-slot="{row}">
          <el-link type="primary" @click="showDetailFn(row.id)">{{row.title}}</el-link>
        </template>
      </el-table-column>
       <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template v-slot="{row}">
          <span>{{$formatDate(row.puub_date)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="danger" size="mini" @click="removeFn(row.id)">删除</el-button>
        </template>
      </el-table-column>
     </el-table>
     <!-- 分页区域 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="search.pagenum"
      :page-sizes="[2 ,4, 6]"
      :page-size="search.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
     </el-pagination>
    </el-card>
     <!-- 发表文章的 Dialog 对话框 -->
     <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose" @closed="onDialogClosedFn">
        <el-form ref="pubFormRef" :model="pubForm" :rules="pubFormRules" label-width="100px">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
              <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
                <!-- 循环渲染分类的可选 -->
                <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
              <quill-editor v-model="pubForm.content"   @change="contentChangeFn($event)"></quill-editor>
            </el-form-item>
            <el-form-item label="文章封面" prop="cover_img">
              <!-- 用来显示封面的图片 -->
              <img src="@/assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef"  >
              <br>
              <!-- 文件选择框,默认被隐藏 -->
              <input type="file" style="display:none;" accept="image/*" ref="iptFileRef" @change="onCoverChangeFn">
            </el-form-item>
            <!-- 选择封面的按钮 -->
           <el-form-item>
             <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
           </el-form-item>
           <el-form-item>
              <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
              <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
           </el-form-item>
        </el-form>
     </el-dialog>
     <!-- 查看文章详情的对话框 -->
     <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{artDetail.title}}</h1>
      <div class="info">
        <span>作者: {{artDetail.nickname||artDetail.username}}</span>
        <span>发布时间: {{$formatDate(artDetail.pub_date)}}</span>
        <span>所属分类: {{artDetail.cate_name}}</span>
        <span>状态: {{artDetail.state}}</span>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- 文章封面 -->
      <img  v-if="artDetail.cover_img" :src=" baseURL+artDetail.cover_img" alt="">
      <!-- 文章详情 -->
      <div class="detail-box" v-html="artDetail.content"></div>
     </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, uploadArticleAPI, getArticleListAPI, getArticleDetailAPI, delArticleAPI } from '@/api'
import defaultImg from '@/assets/images/cover.jpg'
import { baseURL } from '@/utils/request.js'
export default {
  name: 'artList',
  data () {
    return {
      baseURL: baseURL,
      // 查询参数对象
      search: {
        // 当前页码数
        pagenum: 1,
        // 当前页面需要的数据条数
        pagesize: 2,
        // 文章分类id(注意不是文章id)
        cate_id: '',
        // 文章状态("已发布"和"草稿")2种值
        state: ''
      },
      // 控制发表文章对话框的显示与隐藏
      pubDialogVisible: false,
      // 表单的数据对象
      pubForm: {
        // 标题
        title: '',
        // 分类
        cate_id: '',
        // 内容
        content: '',
        // 用户选择的封面图片（null 表示没有选择任何封面）
        cover_img: null,
        // 文章的发布状态,可选值:草稿、已发布
        state: ''
      },
      // 表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'change' }],
        cover_img: [{ required: true, message: '请选择封面', trigger: 'change' }]
      },
      // 文章分类
      cateList: [],
      // 文章的列表数据
      artList: [],
      // 总数据条数
      total: 0,
      // 控制文章详情对话框的显示与隐藏
      detailVisible: false,
      // 文章的详情信息对象
      artDetail: {}
    }
  },
  methods: {
    // 发表文章按钮->点击事件->让添加文章对话框出现
    showPubDialogFn () {
      this.pubDialogVisible = true
    },
    async handleClose (done) {
      // 询问用用户是否确认关闭对话框
      const confirmResult = await this.$confirm('此操作将会导致文章信息丢失,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消了关闭--什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    async initCateList () {
      const { data: res } = await getArtCateListAPI()

      if (res.code === 0) {
        this.cateList = res.data
      }
    },
    // 模拟文本框的点击事件
    chooseImgFn () {
      this.$refs.iptFileRef.click()
    },
    // 用户选择了封面文件
    onCoverChangeFn (e) {
      const files = e.target.files
      console.log(files)
      if (files.length === 0) {
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 发布文章或者草稿--点击事件
    pubArticleFn (state) {
      // 设置发布状态
      this.pubForm.state = state
      // 表单预检验
      this.$refs.pubFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请完善文章信息')
        if (!this.pubForm.cover_img) return this.$message.error('请选择文章封面')

        // 准备一个表单数据对象
        const fd = new FormData()
        Object.keys(this.pubForm).forEach(item => {
          fd.append(item, this.pubForm[item])
        })
        const { data: res } = await uploadArticleAPI(fd)
        console.log(res)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 关闭对话框
        this.pubDialogVisible = false
        // 刷新文章列表
        this.initCateList()
      })
    },
    // 关闭对话框之后的处理函数
    onDialogClosedFn () {
      this.$refs.pubFormRef.resetFields()
      // 不是表单绑定的, 所以需要单独控制
      this.content = ''
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    // 富文本编辑器内容改变了触发此方法
    contentChangeFn () {
      this.$refs.pubFormRef.validateField('content')
    },
    // 初始化文章列表
    async initArtListFn () {
      const { data: res } = await getArticleListAPI(this.search)
      if (res.code !== 0) return this.$message.error(res.message)
      this.artList = res.data
      this.total = res.total
    },
    // pageSize 发生了变化
    handleSizeChange (val) {
      this.search.pagesize = val
      this.search.pagenum = 1
      this.initArtListFn()
    },
    // 页码值发生了变化
    handleCurrentChange (val) {
      this.search.pagenum = val
      this.initArtListFn()
    },
    // 筛选按钮去
    initArtList () {
      this.search.pagenum = 1
      this.search.pagesize = 2
      this.initArtListFn()
    },
    // 重置按钮
    resetList () {
      this.search = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      this.initArtListFn()
    },
    // 获取文章详情
    async showDetailFn (id) {
      this.detailVisible = true
      const { data: res } = await getArticleDetailAPI(id)
      if (res.code !== 0) return this.$message.error(res.message)
      console.log(res.data)
      this.artDetail = res.data
    },
    // 文章删除
    async removeFn (id) {
      const confirmResult = await this.$confirm('此操作将永久删除此文件,是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消删除
      if (confirmResult === 'cancel') return false
      const { data: res } = await delArticleAPI(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.resetList()
    }
  },
  created () {
    this.initCateList()
    this.initArtListFn()
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 500px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 200px;
  object-fit: cover;
}
.el-pagination {
  margin-top: 15px;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
