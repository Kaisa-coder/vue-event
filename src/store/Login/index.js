import { getToken } from '@/utils/token'
import { getUserInfoAPI } from '@/api'
// 登录界面的仓库
const state = {
  // 用来存储登录成功之后得到的 token
  token: getToken() || '',
  // 保存用户信息(id, username, nickname, email, user_pic)
  userInfo: {}
}
const mutations = {
  // 更新 token
  updateToken (state, newToken) {
    state.token = newToken
  },
  // 更新用户的信息
  updateUserInfo (state, info) {
    state.userInfo = info
  }
}
const actions = {
  // 请求用户基本信息
  async initUserInfo ({ commit }) {
    const { data: res } = await getUserInfoAPI()
    if (res.code === 0) {
      commit('updateUserInfo', res.data)
    }
  }
}
const getters = {
  // 昵称
  nickname: state => state.userInfo.nickname,
  // 用户名
  username: state => state.userInfo.username,
  // 用户头像
  user_pic: state => state.userInfo.user_pic
}
export default {
  state,
  mutations,
  actions,
  getters
}
