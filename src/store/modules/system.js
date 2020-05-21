// import config from '@/config'

const app = {
  state: {
    columnFilters: {}
  },
  mutations: {
    setColumnFilters (state, { tableName, columns }) {
      state.columnFilters[tableName] = columns
    }
  },
  actions: {
  }
}
export default app
