// 基于 axios 封装，网络请求的函数
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
export const baseURL = 'http://big-event-vue-api-t.itheima.net'
// axios.create([config]) 创建一个带有配置项的自定义 axios 函数
// myAxiox 请求的时候，地址 baseURL + url 然后去请求后台
const myAxios = axios.create({
  baseURL
})
// 定义请求拦截器
myAxios.interceptors.request.use(function (config) {
  // 为请求头挂载 Authorization
  if (store.state.login.token) {
    config.headers.Authorization = store.state.login.token
  }

  return config
}, function (error) {
  return Promise.reject(error)
})
// 定义响应拦截器
myAxios.interceptors.response.use(function (response) {
  // // 响应状态码为 2xx 时触发成功的回调，形参中的 response 是“成功的结果”
  return response
}, function (error) {
  // 响应状态码不是 2xx 时触发失败的回调，形参中的 error 是“失败的结果”
  if (error.response.status === 401) {
    // 无效的 token
    // 把 Vuex 中的 token 重置为空，并跳转到登录页面
    store.commit('updateToken', '')
    router.push('/login')
    Message.error('用户身份已过期,请重新登录')
  }
  return Promise.reject(error)
})
export default myAxios
