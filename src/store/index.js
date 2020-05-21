import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/system'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    app
  },
  getters: getters,
  strict: debug,
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: key => {}
      }
    })
  ]
})

export default store
