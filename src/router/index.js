import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)
// 路由进行懒加载 让首页加载文件体积更小,打开更快
const routes = [
  {
    path: '/',
    component: () => import('@/views/Layout'),
    // 默认显示首页的二级路由
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home')
      },
      {
        path: 'user-info',
        component: () => import('@/views/User/userInfo.vue')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/User/userAvatar')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/User/userPwd')
      }, {
        path: 'art-cate',
        component: () => import('@/views/Article/artCate')
      },
      {
        path: 'art-list',
        component: () => import('@/views/Article/artList')
      }
    ]
  },
  {
    path: '/register',
    component: () => import('@/views/Register')
  },
  {
    path: '/login',
    component: () => import('@/views/Login')
  }
]

const router = new VueRouter({
  routes
})
// 白名单 无需登录可以访问的路由地址
const whiteList = ['/login', '/register']
// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.login.token
  if (token) {
    // 登录了
    if (!store.state.login.userInfo.username) {
      // 下次切换页面 vuex 里有用户信息数据就不会重复请求用户信息
      store.dispatch('initUserInfo')
    }
    next()
  } else {
    // 未登录
    console.log(to.path)
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  // 有 token 但是没有用户信息,才会请求用户信息并保存在 vuex 中
  // 调用 actions 中的方法请求数据
})
export default router
