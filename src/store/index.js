import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    loading: true,
    modal: {
      status: false,
      msg: null
    }
  },
  mutations: {
    updateUser(state, getUser) {
      state.user = getUser
      if (state.user == null) state.loading = false
    },
    updateModal(state, payload) {
      state.modal.status = payload.status
      state.modal.msg = payload.msg
    }
  },
  getters: {
    lihatUser(state) {
      return state.user
    },
    lihatLoading(state) {
      return state.loading
    },
    lihatModalStatus(state) {
      return state.modal.status
    },
    lihatModalMsg(state) {
      return state.modal.msg
    }
  },
  actions: {
  },
  modules: {
  }
})
