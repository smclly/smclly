
export default {
  state: {
    user: "", // 登录的用户
    showLogin: false // 用于控制是否显示登录组件
  },
  
  //修改数据
  mutations: {
    setUser (state, data) {
      state.user = data;
    },
    setShowLogin (state, data) {
      state.showLogin = data;
    }
  },
  //执行函数的
  actions: {
    setUser ({ commit }, data) {
      commit('setUser', data);
    },
    setShowLogin ({ commit }, data) {
      commit('setShowLogin', data);
    }
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getShowLogin (state) {
      return state.showLogin
    }
  },
}