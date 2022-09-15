import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
// 注册 elementUI 组件
import '@/elementUI'
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入 dayjs 方法
import dayjs from 'dayjs'
Vue.prototype.$formatDate = (dateObj) => {
  return dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')
}
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// 打包相关问题:
// 默认打包,index.html 引入其他打包的文件使用的是 绝对地址
// 地址是以/开头(要找到当前 index.html 打开时所在服务器的根路径)
// 就得确保 vscode + liveserver 插件打开时,vscode 根目录必须是 dist 目录文件夹
