// pages/tempform/tempform.js
const post = require('../../utils/post')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    userId: null,
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ userId:wx.getStorageSync('userId') })
    var that =this
    
    var postData = {
      userId:wx.getStorageSync('userId'),
    }
    console.log(postData)
    post.post('api/checkIsSubmit',postData, function (res) {
     console.log(res)
      that.setData({
        classId:res.classId,
        className:res.className,
        collegeId:res.collegeId,
        collegeName:res.collegeName,
        majorId:res.majorId,
        studentId:res.studentId,
        studentNum:res.studentNum,
      })
      console.log(res.code)
      if(res.code == 9002){
        wx.showToast({
          title: '已经提交过了',
          icon: 'none'
        })
        that.setData({
          disabled:true
        })
      }else if(res.code == 9001){
        wx.showToast({
          title: '不在提交时段',
          icon: 'none'
        })
        that.setData({
          disabled:true
        })
      }
      console.log(that.data.classId)
    })
  },

  formSubmit: function (e) {
    var that =this
    var tem=new RegExp('[0-9]','g');
    var tem=tem.exec(e.detail.value.tem);
    if(!tem){
        setTimeout(()=>{
            wx.showToast({
                title: '只能输入数字',
                icon: 'none'
            })
        },500);
        return
    }
    if(e.detail.value.tem > 41 || e.detail.value.tem < 35){
      setTimeout(()=>{
          wx.showToast({
              title: '请输入地球人温度',
              icon: 'none'
          })
      },500);
      return
  }

    if(e.detail.value.tem == ''||e.detail.value.tem == null){
        wx.showToast({
          title: '同学，请填写你的体温',
          icon: 'none',
          mask: true
        })
    }else{
      var postData = {
        classId:that.data.classId+"",
        className: that.data.className,
        studentNum: that.data.studentNum,
        studentId:  that.data.studentId+"",
        collegeId: that.data.collegeId,
        collegeName: that.data.collegeName,
        tem: e.detail.value.tem
       }
       console.log(postData)
       post.post('api/submitTemData',postData, function (res) {
   
         wx.showToast({
           title: '申请提交成功',
           icon: 'none',
           mask: true
         })
         setTimeout(function () {
           wx.reLaunch({
             url: '/pages/user/user',
           })
         }, 300)
       })
    }
   
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
    var that =this
    that.setData({
      username:wx.getStorageSync('userName')
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