// pages/order/index.js
//获取应用实例
const app = getApp();
const http = require('../../service/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customFlag: 1,
    customNavStyle: app.globalData.customNavStyle,
    goods: null,
    type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      goods: JSON.parse(options.info),
      type: options.type
    })
  },
  formSubmit(e) {
    let data = e.detail.value;
    if (data.name == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入姓名',
      })
      return
    } else if (data.phoneNumber == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入联系方式',
      })
      return
    } else if (data.address == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入地址',
      })
      return
    }
    wx.showLoading({
      mask: true,
      title: '请求中',
    })
    http.reqExchange({
      muid: app.globalData.user.wxInfo.openid,
      type: this.data.type,
      objectId: this.data.goods.id,
      phoneNumber: data.phoneNumber,
      name: data.name,
      address: data.address
    }).then(res => {
      console.log('reqExchange: ', res)
      wx.hideLoading();
      if (res.code == 1) {
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false,
          success(res) {
            if (res.confirm) {
              app.globalData.user.info.gold = app.globalData.user.info.gold - this.goods.price;
              wx.navigateBack();
            }
          }
        })
      } else if (res.code == -2) {
        wx.showModal({
          title: '提示',
          content: '网络错误',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              wx.navigateBack({
                delta: 2
              })
            }
          }
        })
      } else if (res.code == 0) {
        wx.showModal({
          title: '提示',
          content: app.globalData.errCode0Msg,
          showCancel: false,
          success: res => {
            if (res.confirm) {
              wx.navigateBack({
                delta: 2
              })
            }
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg || '获取失败',
        })
      }
    }).catch(err => {
      console.log('err: ', err)
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '提交失败',
      })
    })
  }
})