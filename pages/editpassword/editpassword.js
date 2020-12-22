const app = getApp();
const getToken = require('../../utils/getToken')
const post = require('../../utils/post')
const formatTime = require('../../utils/util')+
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.newPassword != e.detail.value.newPassword1){
      wx.hideLoading()
      wx.showToast({
        title: '两次新密码输入的不一致',
        icon: 'none',
        mask: true
      })
    } else if (e.detail.value.oldPassword.length == 0 || e.detail.value.newPassword.length == 0 || e.detail.value.newPassword1.length == 0){
      wx.hideLoading()
      wx.showToast({
        title: '输入项不可为空',
        icon: 'none',
        mask: true
      })
    }else{
      var postData = {
        oldPassword: e.detail.value.oldPassword,
        newPassword: e.detail.value.newPassword,
        userId: wx.getStorageSync('userId')
      }
      post.post('api/updatePassword', postData, function (res) {
        if (res.code == 1) {
              wx.hideLoading()
              wx.showToast({
                title: '密码修改成功,请重新登录',
                icon: 'none',
                mask: true
              })
             wx.clearStorage()
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              }, 300)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              mask: true,
            })
          }
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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