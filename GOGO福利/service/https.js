const baseUrl = 'https://game1.topeffects.cn';

const http = ({
  url = '',
  header = {},
  param = {},
  ...other
} = {}) => {
  wx.showLoading({
    title: '请求中..'
  });
  return new Promise((resolve, reject) => {
    // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"
    var hd = header;
    if (!header) {
      hd = {
        'content-type': 'application/json'
      };
    }
    wx.request({
      url: getUrl(url),
      data: param,
      header: hd,
      ...other,
      complete: (res) => {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

const getUrl = (url) => {
  return baseUrl + url
}

// get
const _get = (url, header = {}, param = {}) => {
  return http({
    url,
    header,
    param
  })
}
// post
const _post = (url, header = {}, param = {}) => {
  return http({
    url,
    header,
    param,
    method: 'post'
  })
}
// put
const _put = (url, header = {}, param = {}) => {
  return http({
    url,
    header,
    param,
    method: 'put'
  })
}
// delete
const _delete = (url, header = {}, param = {}) => {
  return http({
    url,
    header,
    param,
    method: 'put'
  })
}

module.exports = {
  baseUrl,
  _get,
  _post,
  _put,
  _delete
}