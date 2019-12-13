// pages/prize/index.js
//获取应用实例
const app = getApp();
const http = require('../../service/api.js');
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customFlag: 1,
    customNavStyle: app.globalData.customNavStyle,
    showPage: false,
    backImage: "https://image.topeffects.cn/wxgame/prize-bj.jpg",
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList();
  },
  onShow() {},
  handleGetBtn(data) {
    let d = JSON.stringify(data.currentTarget.dataset.info);
    wx.navigateTo({
      url: '../order/index?info=' + d + '&type=1',
    })
  },
  getList() {
    wx.showLoading({
      mask: true,
      title: '请求中',
    })
    http.reqGetLotteryList({
      muid: app.globalData.user.wxInfo.openid
    }).then(res => {
      console.log("reqGetLotteryList: ", res)
      wx.hideLoading();
      if (res.code == 1) {
        let arr = [];
        let list = res.data.list
        for (let i = 0; i < list.length; i++) {
          arr.push({
            id: list[i].id,
            status: list[i].status,
            name: list[i].title,
            image: list[i].img,
            date: list[i].timeStr,
            price: list[i].price,
            prizeId: list[i].prizeId,
            description: list[i].description || "暂无"
          })
        }
        this.setData({
          list: arr,
          showPage: true
        })
      } else if (res.code == -2) {
        wx.showModal({
          title: '提示',
          content: '网络错误',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              wx.navigateBack();
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
          title: res.msg || '获取失败',
        })
      }
    }).catch(err => {
      console.log('err: ', err)
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '请求失败',
      })
    })
  }
})