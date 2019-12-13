//index.js
//获取应用实例
const app = getApp();
const http = require('../../service/api.js');
const util = require('../../utils/util.js');
var rewardedVideoAd = null;

Page({
  data: {
    adRefreshTime: app.globalData.adRefreshTime,
    adUnitId: app.globalData.adUnitId1,
    titleHeight: app.globalData.customNavStyle.height,
    customFlag: 0,
    customNavStyle: app.globalData.customNavStyle,
    backImage: "https://image.topeffects.cn/wxgame/bj.png",
    coinsImage: "https://image.topeffects.cn/wxgame/coins.png",
    guizeImage: "https://image.topeffects.cn/wxgame/guize.png",
    xyImage: "https://image.topeffects.cn/wxgame/xy.png",
    dazhuanpanImage: "https://image.topeffects.cn/wxgame/dazhuanpan.png",
    jiluImage: "https://image.topeffects.cn/wxgame/jilu.png",
    jinbiduihuanImage: "https://image.topeffects.cn/wxgame/jinbiduihuan.png",
    adweiImage: "https://image.topeffects.cn/wxgame/adwei.png",
    videoImage: "https://image.topeffects.cn/wxgame/video.png",
    goldImage: "https://image.topeffects.cn/wxgame/jinbi2x.png",
    lightImage: "https://image.topeffects.cn/wxgame/light.png",
    ruleList: ["每个用户每天有10次机会，每转一次消耗100金币。",
      "一等奖迪奥(Dior) 烈焰蓝金唇膏999#， 二等奖20万金币。",
      "金币奖励直接充入账号余额中；实物奖品请填写邮寄地址，作弊将视作无效。",
      "看视频可以增加抽奖机会，每看一个视频增加2次抽奖机会。",
      "本活动最终解释权归游戏中心所有。"
    ],
    showRuleBox: false,
    showGoldBox: false,
    showPrizeBox: false,
    isLogin: false,
    rollCount: 0,
    rollMax: 10,
    appendDayMax: 0,
    appendDayCount: 0,
    userGold: 0,
    rollResult: -1,
    currentPrize: null,
    newUserPrice: 0,
    adBanner: true,
    openVideoType: 2,
    showPage: false,
    showTruntableItemName: false, // 是否显示转盘选项标题
    size: 600, //转盘大小,
    musicflg: false, //声音
    fastJuedin: false, //快速决定
    repeat: false, // 不重复抽取
    probability: false, // 概率
    s_awards: '', //结果
    //转盘的总数据，想添加多个可以往这数组里添加一条格式一样的数据
    zhuanpanArr: [],
    //更改数据可以更改这属性，格式要像下面这样写才行
    awardsConfig: {}
  },
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function() {
    // 获取转盘奖品列表
    this.getPrizeList();
    // 判断是否登陆过
    if (wx.getStorageSync('wxInfo')) {
      app.globalData.user.isLogin = true;
      app.globalData.user.wxInfo = wx.getStorageSync('wxInfo');
      app.globalData.user.info = wx.getStorageSync('userInfo');
      this.getUserInfo();
    }
    if (app.globalData.user.isLogin) {
      this.setData({
        isLogin: true
      })
      this.initRewardedVideoAd();
    } else {
      this.setData({
        isLogin: false
      })
    }
  },
  onShow() {
    if (!app.globalData.user.isLogin) {
      this.handleClickLogin();
    }
  },

  // onSaveExitState() {
  //   http.reqLogout({
  //     sessionKey: wx.getStorageSync('session_key')
  //   }).then(res => {
  //     console.log('reeqLogout: ', res)
  //   }).cacth(err => {
  //     console.log('err:', err)
  //   })
  //   return {
  //     data: {
  //       myField: "myFieldValue"
  //     }
  //   }
  // },
  // 打开商店
  openShopPage() {
    if (app.globalData.user.isLogin) {
      wx.navigateTo({
        url: '../shop/index?coin=' + this.data.userGold,
      })
    } else {
      this.handleClickLogin();
    }
  },
  // 打开奖品记录
  openPrizePage() {
    if (app.globalData.user.isLogin) {
      wx.navigateTo({
        url: '../prize/index',
      })
    } else {
      this.handleClickLogin();
    }
  },
  // 打开游戏规则
  openRuleBox() {
    // 获取游戏规则
    wx.showLoading({
      mask: true,
      title: '请求中'
    })
    http.reqGetRegulations().then(res => {
      console.log("reqGetRegulations: ", res);
      let arr = [];
      for (let i = 0; i < res.data.list.length; i++) {
        arr.push(res.data.list[i].description)
      }
      wx.hideLoading()
      this.setData({
        ruleList: arr,
        showRuleBox: true
      })
    }).catch(err => {
      console.log('err: ', err)
      wx.hideLoading()
    })
  },
  // 关闭游戏规则
  closeRuleBox() {
    this.setData({
      showRuleBox: false
    })
  },
  // 打开新人获取金币弹窗
  openGoldBox() {
    this.setData({
      showGoldBox: true
    })
  },
  // 关闭新人获取金币弹窗
  closeGoldBox() {
    this.setData({
      showGoldBox: false
    })
  },
  // 打开抽奖结果弹窗
  openPrizeBox() {
    this.setData({
      showPrizeBox: true
    })
    setTimeout(() => {
      this.selectComponent("#zhuanpan").reset();
    }, 500)
  },
  // 关闭抽奖结果弹窗
  closePrizeBox() {
    setTimeout(() => {
      this.setData({
        showPrizeBox: false
      })
    }, 200)
  },
  // 打开激励视频页面
  openVideo() {
    if (this.data.appendDayMax != -1 && this.data.appendDayMax == this.data.appendDayCount) {
      wx.showToast({
        icon: 'none',
        title: '观看次数已达上限'
      })
      return
    }
    wx.showLoading({
      mask: true,
      title: '请求中'
    })
    // 在合适的位置打开广告
    if (rewardedVideoAd) {
      rewardedVideoAd.show().then(() => {
        wx.hideLoading();
        console.log('open video success');
      }).catch(() => {
        // 失败重试
        rewardedVideoAd.load()
          .then(() => {
            wx.hideLoading();
            rewardedVideoAd.show()
            console.log('open video success');
          }).catch(err => {
            wx.hideLoading();
            console.log("open video fail ", err)
            wx.showToast({
              icon: 'none',
              title: '视频加载失败',
            })
          })
      })
    }
  },
  // 从奖励弹窗打开激励视频或者订单页
  switchPage(e) {
    let path = e.detail;
    if (path == 'video') {
      this.setData({
        openVideoType: 1
      })
      this.closePrizeBox();
      // 打开激励视频
      this.openVideo();
    } else if (path == 'order') {
      // 打开订单页面
      let prize = this.data.currentPrize;
      console.log('current prize: ', prize)
      let d = {
        id: prize.id,
        type: prize.type,
        name: prize.title,
        image: prize.img || this.data.goldImage,
        date: prize.timeStr || '',
        price: prize.price,
        description: prize.description || "暂无"
      };
      d = JSON.stringify(d);
      wx.navigateTo({
        url: '../order/index?info=' + d + '&type=1',
      })
      setTimeout(() => {
        this.setData({
          showPrizeBox: false
        })
      }, 500)
    } else {
      this.setData({
        showPrizeBox: false
      })
    }
  },
  //接收当前转盘初始化时传来的参数
  getData(e) {
    this.setData({
      option: e.detail.option
    })
  },

  //接收当前转盘结束后的答案选项
  getAwards(e) {
    this.setData({
      s_awards: e.detail,
    })
    this.openPrizeBox();
  },

  //开始转动或者结束转动
  startZhuan(e) {
    this.setData({
      rollResult: -1,
      zhuanflg: e.detail ? true : false
    })
  },

  //不重复抽取
  switch1Change2(e) {
    var value = e.detail.value;
    if (this.data.zhuanflg) {
      wx.showToast({
        title: '当转盘停止转动后才有效',
        icon: 'none'
      })
      return;
    } else {
      this.setData({
        repeat: value
      })
    }
  },

  //快速决定
  switch1Change3(e) {
    var value = e.detail.value;
    if (this.data.zhuanflg) {
      wx.showToast({
        title: '当转盘停止转动后才有效',
        icon: 'none'
      })
      return;
    } else {
      this.setData({
        fastJuedin: value
      })
    }
  },

  //概率 == 如果不重复抽取开启的话 概率是无效的
  switch1Change4(e) {
    var value = e.detail.value;
    if (this.data.zhuanflg) {
      wx.showToast({
        title: '当转盘停止转动后才有效',
        icon: 'none'
      })
      return;
    } else {
      this.setData({
        probability: value
      })
    }
  },
  // 执行登录操作并将用户信息、openId和session_key，保存到本地缓存中
  handleClickLogin() {
    let that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          console.log('code: ', res)
          wx.showLoading({
            mask: true,
            title: '登陆中',
          })
          http.reqUserLogin({
            code: res.code
          }).then((res) => {
            console.log('reqUserLogin: ', res);
            wx.hideLoading();
            if (res.code == 1) {
              app.globalData.user.isLogin = true;
              app.globalData.user.wxInfo = res.data.wxInfo;
              wx.setStorageSync('wxInfo', res.data.wxInfo);
              wx.setStorageSync('openid', res.data.wxInfo.openid);
              wx.setStorageSync('session_key', res.data.wxInfo.session_key);
              that.getUserInfo();
            } else {
              app.globalData.user.isLogin = false;
              app.globalData.user.wxInfo = null;
              wx.showToast({
                title: res.msg || '登陆失败',
                icon: 'none'
              })
            }
          }).catch((err) => {
            wx.hideLoading();
            console.log('err', err);
            app.globalData.user.isLogin = false;
            app.globalData.user.wxInfo = null;
            wx.clearStorageSync();
          })
        }
      }
    })
  },

  // 获取用户信息,并保存到 app.globalData.user.info
  getUserInfo() {
    wx.showLoading({
      mask: true,
      title: '登陆中',
    })
    http.reqGetUserInfo({
      muid: app.globalData.user.wxInfo.openid
    }).then(res => {
      console.log("reqGetUserInfo: ", res)
      wx.hideLoading();
      if (res.code == 1) {
        app.globalData.user.info = res.data.userinfo;
        wx.setStorageSync('userInfo', res.data.userinfo);
        this.setData({
          rollCount: res.data.userinfo.rollDayCount || 0,
          rollMax: res.data.userinfo.rollDayMax || 0,
          userGold: res.data.userinfo.gold || 0,
          appendDayCount: res.data.userinfo.appendDayCount || 0,
          appendDayMax: res.data.userinfo.appendDayMax
        })
        if (res.data.userinfo.new) {
          this.setData({
            newUserPrice: res.data.userinfo.gold
          })
          this.openGoldBox();
        }
      } else if (res.code == -2) {
        wx.showModal({
          title: '提示',
          content: '请重新登录',
          success: res => {
            if (res.confirm) {
              this.getUserInfo();
            } else if (res.cancel) {
              app.globalData.user.isLogin = false;
              app.globalData.user.wxInfo = null;
              wx.clearStorageSync();
            }
          }
        })
      } else if (res.code == 0) {
        wx.showModal({
          title: '提示',
          content: app.globalData.errCode0Msg,
          showCancel: false,
          success: res => {
            if (res.confirm) {}
          }
        })
      } else {
        app.globalData.user.isLogin = false;
        app.globalData.user.wxInfo = null;
        wx.clearStorageSync();
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log('err: ', err)
      wx.clearStorageSync();
      wx.hideLoading();
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },
  // 获取转盘展示奖品信息列表
  getPrizeList() {
    wx.showLoading({
      mask: true,
      title: '请求中',
    })
    http.reqGetPrizeList().then(res => {
      console.log('reqGetPrizeList: ', res)
      wx.hideLoading();
      if (res.code == 1) {
        let arr = [];
        let list = res.data.list;
        for (let i = 0; i < list.length; i++) {
          arr.push({
            type: list[i].type,
            id: list[i].id,
            name: list[i].title,
            description: list[i].description,
            color: i % 2 == 0 ? '#F00' : '#FFF',
            image: list[i].img,
            imageC: list[i].imgC,
            price: list[i].price,
            probability: list[i].probability
          })
        }
        this.setData({
          showPage: true,
          awardsConfig: {
            option: app.globalData.name,
            awards: arr
          }
        })
      } else if (res.code == -2) {
        wx.showModal({
          title: '提示',
          content: '请重新登录',
          success: res => {
            if (res.confirm) {
              this.getUserInfo();
            } else if (res.cancel) {
              app.globalData.user.isLogin = false;
              app.globalData.user.wxInfo = null;
              wx.clearStorageSync();
            }
          }
        })
      } else if (res.code == 0) {
        wx.showModal({
          title: '提示',
          content: app.globalData.errCode0Msg,
          showCancel: false,
          success: res => {
            if (res.confirm) {}
          }
        })
      } else {
        wx.showToast({
          title: res.msg || '请求失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log('err: ', err)
      wx.hideLoading();
      wx.showToast({
        title: '请求失败',
        icon: 'none'
      })
      // 强制退出
    })
  },
  // 获取抽奖结果
  getRoll() {
    wx.showLoading({
      mask: true,
      title: '请求中',
    })
    http.reqGetRoll({
      muid: app.globalData.user.wxInfo.openid
    }).then(res => {
      console.log("reqGetRoll: ", res)
      wx.hideLoading();
      if (res.code == 1) {
        let price = 0;
        if (res.data.lottery.status == 1) {
          price = res.data.lottery.price;
        } else if (res.data.lottery.status == 2) {
          price = 0;
        }
        this.setData({
          currentPrize: res.data.lottery,
          rollResult: res.data.index,
          rollCount: this.data.rollCount + 1,
          userGold: Number(this.data.userGold) + price
        })
        app.globalData.user.info.gold = this.data.userGold;
        console.log(this.data.userGold, price)
        this.selectComponent('#zhuanpan')._zhuan()
      } else if (res.code == 2) {
        wx.showToast({
          icon: 'none',
          title: res.msg,
        })
      } else if (res.code == -2) {
        wx.showModal({
          title: '提示',
          content: '请重新登录',
          success: res => {
            if (res.confirm) {
              this.getUserInfo();
            } else if (res.cancel) {
              app.globalData.user.isLogin = false;
              app.globalData.user.wxInfo = null;
              wx.clearStorageSync();
            }
          }
        })
      } else if (res.code == 0) {
        wx.showModal({
          title: '提示',
          content: app.globalData.errCode0Msg,
          showCancel: false,
          success: res => {
            if (res.confirm) {}
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '请求失败',
        })
      }
    }).catch(err => {
      console.log("err: ", err)
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '请求失败',
      })
    })
  },
  // 初始化激励视频
  initRewardedVideoAd() {
    if (wx.createRewardedVideoAd) {
      // 创建激励视频广告实例
      rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: app.globalData.adVideoUnitId
      })
      rewardedVideoAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      rewardedVideoAd.onError((err) => {
        console.log('onError event emit', err)
      })
      rewardedVideoAd.onClose((res) => {
        console.log('onClose event emit', res)
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          console.log('正常播放结束，下发奖励')
          wx.showLoading({
            mask: true,
            title: '请求中',
          })
          http.reqGoldMultiple({
            muid: app.globalData.user.wxInfo.openid,
            type: this.data.openVideoType
          }).then(res => {
            wx.hideLoading();
            console.log('reqGoldMultiple: ', res)
            if (res.code == 1) {
              // this.setData({
              //   rollCount: res.data.rollDayCount,
              //   rollMax: res.data.rollDayMax,
              //   appendDayCount: res.data.appendDayCount,
              //   appendDayMax: res.data.appendDayMax
              // })
              // if (this.data.openVideoTyp == 1) {
              //   this.setData({
              //     userGold: Number(this.data.userGold) + res.data.gold || 0
              //   })
              // }
              this.getUserInfo();
            }
          }).catch(err => {
            console.log("err: ", err)
            wx.hideLoading();
            wx.showToast({
              icon: 'none',
              title: '请求失败',
            })
          })
        } else {
          // 播放中途退出，不下发游戏奖励
          console.log('播放中途退出，不下发游戏奖励')
          wx.showToast({
            icon: 'none',
            title: '没有播放完视频, 无法获取奖励',
          })
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请求失败',
      })
    }
  },
  // 贴片广告-加载成功
  adLoad() {
    console.log('adLoad')
    this.setData({
      adBanner: true
    })
  },
  // 贴片广告加载失败
  adError(err) {
    console.log('adError', err)
    this.setData({
      adBanner: false
    })
  },
  // 贴片广告加载关闭
  adClose() {
    console.log('adClose')
    this.setData({
      adBanner: false
    })
  }
})