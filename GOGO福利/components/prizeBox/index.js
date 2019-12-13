// components/prizeBox/index.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tImg: {
      type: String,
      value: ""
    },
    adImg: {
      type: String,
      value: ""
    },
    lightImage: {
      type: String,
      value: ""
    },
    goldImage: {
      type: String,
      value: ""
    },
    prize: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal, changedPath) {
        this.setCurrentPrize(newVal);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentPrize: null,
    adBanner: true,
    adUnitId: app.globalData.adUnitId2,
    adRefreshTime: app.globalData.adRefreshTime
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('close')
    },
    // 看视频
    handleClickVideo() {
      this.triggerEvent('switchPage', 'video')
    },
    // 领取实物奖励
    handleClickPrize() {
      this.triggerEvent('switchPage', 'order')
    },
    // 更新奖励信息
    setCurrentPrize(prize) {
      this.setData({
        currentPrize: prize
      })
    },
    // 贴片广告-加载成功
    adLoad() {
      this.setData({
        adBanner: true
      })
    },
    // 贴片广告加载失败
    adError() {
      this.setData({
        adBanner: false
      })
    },
    // 贴片广告加载关闭
    adClose() {
      this.setData({
        adBanner: false
      })
    }
  }
})