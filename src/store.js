import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    tasks: []
  },
  getters: {
    getUser(state){
      return state.user
    },
    getTasks(state){
      return state.tasks
    }
  },
  mutations: {
    setUser(state, payload){
      state.user = payload
    },
    setTasks(state, payload){
      state.tasks = payload
      console.log(state.tasks)
    }
  }
})
