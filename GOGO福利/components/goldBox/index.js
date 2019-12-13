// components/goleBox/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tImg: {
      type: String,
      value: ""
    }, 
    lightImage: {
    type: String,
    value: ""
    },
    number: {
      type: String || Number,
      value: 0,
      observer: function(newVal, oldVal, changedPath) {
        this.changeNumber(newVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('close')
    },
    changeNumber(val) {
      this.setData({
        number: val
      })
    }
  }
})