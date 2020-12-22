const app = getApp()
const getToken = require('../../utils/getToken')
const post = require('../../utils/post')
const formatTime = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  tiwen: function (e) {
    wx.navigateTo({
      url: '../tempform/tempform',
    })
  },
  //申请预约
  appointment: function (e) {
    wx.navigateTo({
      url: '../appointment/appointment',
    })
  },
  //远程开门
  remDoorOpen: function(e) {
	  wx.navigateTo({
	    url: '../remotedooropen/remotedooropen',
	  })
  },
  //申请记录
  applyhistory: function (e) {
    wx.navigateTo({
      url: '../applyhistory/applyhistory',
    })
  },
  adminpending: function (e) {
    wx.navigateTo({
      url: '../adminpending/adminpending',
    })
  },
  adminpendinghistory: function (e) {
    wx.navigateTo({
      url: '../adminpendinghistory/adminpendinghistory',
    })
  },
  userinfo: function (e) {
    wx.navigateTo({
      url: '../userinfo/userinfo',
    })
  },
  password: function (e) {
    wx.navigateTo({
      url: '../editpassword/editpassword',
    })
  },

  telbind: function (e) {
    wx.navigateTo({
      url: '../telbind/telbind',
    })
  },
  toLogin: function (res) {
    app.globalData.userInfo = res
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  agree: function (e) {
    var postData = {
        userId:wx.getStorageSync('userId')
    }

    post.post('api/loginOut',postData, function (res) {
      // console.log("退出登录")
      // console.log(res)
    })
    wx.clearStorage()
    setTimeout(function () {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }, 300)


  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.setData({
      username: wx.getStorageSync('userName'),
      userCode: wx.getStorageSync('userCode'),
      userType: wx.getStorageSync('userGroup')
    })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})