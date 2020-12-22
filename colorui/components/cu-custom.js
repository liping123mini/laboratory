const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    str: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: ''
    },
    isCustom: {
      default: false,
      type: [Boolean, String],
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      if (this.data.str === 'spe') {
		  console.log(this.data.str)
        wx.switchTab({
          url: "/pages/user/user"
        })
      } else {
        wx.navigateBack({
          delta: 1
        });
      }
    },
    toHome() {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
})