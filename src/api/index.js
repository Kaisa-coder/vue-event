// 封装的是具体的接口请求方法
// 注意:每个方法只负责一个 url 地址
import request from '@/utils/request'
/**
 *  注册接口
 * @param {*} param0 {username:用户名, password:密码, repassword:确认密码}
 * @returns Promise 对象
 */
export const registerAPI = ({ username, password, repassword }) => {
  // 返回 一个 Promise 对象(内部包含原生 ajax 请求)
  return request({
    url: '/api/reg',
    method: 'post',
    // axios 传参 params data
    // params 对象参数名和值会出来在 url的?后面拼接给后台(query查询字符串)
    // data 对象参数名和值 会把参数和值拼接在请求体里(body参数)
    data: {
      username,
      password,
      repassword
    }
  })
}
/**
 * 登录接口
 * @param {*} param0 {username:用户名,password:密码}
 * @returns Promise 对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
/**
 * 获取用户信息
 * @returns Promise 对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo',
    method: 'get'
  })
}
/**
 * 获取侧边栏的数据
 * @returns Promise
 */
export const getMenusListAPI = () => {
  return request({
    url: '/my/menus'
  })
}
/**
 * 更新基本资料
 * @param {*} param0 { id: 用户id, email: 用户邮箱, nickname: 用户昵称, user_pic: 用户头像地址, username: 用户名 }
 * @returns  Promise
 */
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'put',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}
/**
 * 更新-用户头像
 * @param {*} avatar 头像的base64字符串
 * @returns Promise对象
 */
export const updateAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'patch',
    data: {
      avatar
    }
  })
}
/**
 * 更新-用户密码
 * @param {*} param0 { old_pwd: 旧密码, new_pwd: 新密码, re_pwd: 新密码确认 }
 * @returns Promise对象
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}
/**
 * 获取文章分类列表
 * @returns Promise 对象
 */
export const getArtCateListAPI = () => {
  return request({
    url: '/my/cate/list',
    method: 'get'
  })
}
/**
 * 增加-文章分类
 * @param {*} param0 { cate_name: 文章分类名字, cate_alias: 文章分类别名 }
 * @returns Promise对象
 */
export const addArtCateAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'post',
    data: {
      cate_name,
      cate_alias
    }
  })
}
/**
 * 更新-文章分类
 * @param {*} param0 { id: 文章分类id, cate_name: 文章分类名字, cate_alias: 文章分类别名 }
 * @returns Promise对象
 */
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'put',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

export const delArtCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'delete',
    params: {
      id
    }
  })
}
/**
 * 发布文章
 * @param {*} fd 表单对象
 * @returns Promise对象
 */
export const uploadArticleAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'post',
    data: fd
  })
}
/**
 * 获取文章列表
 * @param {*} param0 { pagenum: 当前页码数, pagesize: 当前页条数, cate_id: 文章分类id, state: 文章状态 }
 * @returns Promise对象
 */
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}
export const getArticleDetailAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'get',
    params: {
      id
    }
  })
}
export const delArticleAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'delete',
    params: { id }
  })
}
