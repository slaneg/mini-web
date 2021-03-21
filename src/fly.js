//定义请求地址
const host = 'http://localhost:8090/';

function request(url, method, data, header) {
  wx.showLoading({
    title: '加载中'
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      method: method,
      data: data,
      headers: {
        header
      },
      success: function(res) {
        wx.hideLoading();
        resolve(res.data)
      },
      fail: function(error) {
        wx.hideLoading();
        reject(false)
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  })
}

function get(obj) {
  return request(obj.url, 'GET', obj.data,'\'content-type\': \'application/json\'')
}

function post(obj) {
  return request(obj.url, 'POST', obj.data,'\'content-type\': \'application/x-www-form-urlencoded\'')
}

export default {
  request,
  get,
  post
}
