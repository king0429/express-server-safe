'use scrict'
const request = require('request');
var utils = {}

utils.getOpenIDURL = (code, appInfo) => {
  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${ appInfo.appid }&secret=${ appInfo.appSecret }&js_code=${ code }&grant_type=authorization_code`;
  return url
}

utils.pagenation = async (arr, page, page_size) => {
  let s = []
  arr.forEach((item, index) => {
    if (index >= (page - 1) * page_size && index < page * page_size) {
      s.push(item)
    }
  })
  return new Promise((resolve, reject) => {
    if (s.length <= Number(page_size) ||s.length === 0) {
      resolve(s)
    } else {
      reject(new Error('error array length'))
    }
  })
}

utils.formatTime = (timestamp) => {
  let date = timestamp || new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  let s = `${year}-${month}-${day} ${hour}:${minute}:${second}`
  // console.log(s)
  return s

}
module.exports = utils;
