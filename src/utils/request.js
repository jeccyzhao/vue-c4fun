/* eslint-disable no-console */
import axios from 'axios'
import cfg from '@/config'
import { getKey } from '@/utils/cache'
import { Notice } from 'view-design'

// import { Notice } from 'iview'
// axios.defaults.withCredentials = true
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const token = getKey(cfg.accessTokenKey)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.log('err' + error) // for debug
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const { data, status } = response
    return { data, status }
  },
  error => {
    console.log(error.message)
    if (error.message.includes('timeout')) {
      Notice.error({
        title: '服务器数据请求超时',
        desc: '请求超时，请稍微重试!'
      })
    } else {
      const { status, data, statusText } = error.response
      const errorCode = data && data.code ? data.code : status
      const errorMessage = data && data.error ? data.error : statusText
      Notice.error({
        title: '服务器数据请求失败',
        desc: '错误代码: ' + errorCode + '<br/>错误信息: ' + errorMessage
      })
    }
    // return new Promise(() => {})
    return Promise.reject(error.response)
  }
)

export default service
