/**
   * Get item from local storage by given key
   * @param {String} key item key
   * @param {String} defaultValue default value
   */
export const getKey = (key, defaultValue = '') => {
  var obj = JSON.parse(window.localStorage.getItem(key) || '{}')
  return typeof (obj) === 'object' ? (Object.keys(obj).length > 0 ? obj : defaultValue) : obj
}

/**
   * Add item to local storage by given key and value
   * @param {String} key item key
   * @param {Object} value item data
   */
export const saveKey = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
   * Remove item from local storage by given key
   * @param {String} key item key
   */
export const removeKey = (key) => {
  window.localStorage.removeItem(key)
}
