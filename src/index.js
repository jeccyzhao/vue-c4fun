import SimpleTable from './components/simple-table'
import PipelineGraph from './components/pipeline'
import MagicSearch from './components/magic-search'

const components = {
  SimpleTable,
  PipelineGraph,
  MagicSearch
}

const xBlade = {
  ...components
}

const install = function (Vue, opts = {}) {
  if (install.installed) return
  Object.keys(xBlade).forEach(key => {
    Vue.component(key, xBlade[key])
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default Object.assign(xBlade, { install })
