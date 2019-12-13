// pages/shop/index.js
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
    showPage: false,
    goldImage: "https://image.topeffects.cn/wxgame/jinbibig.png",
    coin: 0,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData.user)
    // 获取商品列表
    wx.showLoading({
      mask: true,
      title: '请求中',
    })
    http.reqGetRealPrizeList({
      muid: app.globalData.user.wxInfo.openid
    }).then(res => {
      console.log('reqGetRealPrizeList: ', res)
      wx.hideLoading();
      if (res.code == 1) {
        let arr = [];
        let list = res.data.list
        for (let i = 0; i < list.length; i++) {
          arr.push({
            type: list[i].type,
            id: list[i].id,
            name: list[i].title,
            price: list[i].price,
            image: list[i].img,
            probability: list[i].probability,
            description: list[i].description
          })
        }
        this.setData({
          coin: options.coin,
          list: arr,
          showPage: true
        })
      } else if (res.code == -2) {
        wx.showModal({
          title: '提示',
          content: '请返回重新登录',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '../index/index',
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
              wx.navigateBack()
            }
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '请求失败',
        })
      }
    }).catch(err => {
      console.log('err: ', err);
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '请求失败',
      })
    })
  },
  openOrderPage(data) {
    let d = JSON.stringify(data.currentTarget.dataset.info);
    wx.navigateTo({
      url: '../order/index?info=' + d + '&type=2'
    })
  }
})