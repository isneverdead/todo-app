import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    loading: true
  },
  mutations: {
    updateUser(state, getUser) {
      state.user = getUser
      if (state.user == null) state.loading = false
    }
  },
  getters: {
    lihatUser(state) {
      return state.user
    },
    lihatLoading(state) {
      return state.loading
    }
  },
  actions: {
  },
  modules: {
  }
})
