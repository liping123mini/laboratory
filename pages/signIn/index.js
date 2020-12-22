// pages/signIn/index.js
const post = require('../../utils/post')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"",
    attendanceId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    this.setData({courseid : options.courseid})
    this.getImgUrl()
    var time = setInterval(() => {
      this.getImgUrl()
    },60000)
    this.setData({time});
  },
  //获取供签到使用的二维码
  getImgUrl(){
    var that = this
    wx.getLocation({
      success:(res)=>{
        var postData = {
          attendanceId:this.data.attendanceId,
          userId:wx.getStorageSync('userId'),
          planId:this.data.courseid,
          latitude:res.latitude.toString(),
          longitude:res.longitude.toString(),
          maxDistance:"100",
          duration:"300"
        }
        post.post("api/getQrCode",postData,function(res){
          that.setData({attendanceId:res.attendanceId.toString(),imgUrl:"data:image/jpeg;base64,"+res.base64})
          that.getTimeliness()
        })
      }
    })
  },
  getTimeliness:function(){
    var that = this
    post.post("api/getAttendanceById",{planId:this.data.courseid},function(res){
      console.log("1523615615615615615611563156315")
      console.log(res.addTimeLong)
      var daoqi = parseInt(res.addTimeLong) + res.duration
      var now = parseInt(new Date().getTime()/1000)

      var Timeliness = daoqi-now
      var m = parseInt(Timeliness/60)>=10?parseInt(Timeliness/60):"0"+parseInt(Timeliness/60)
          var s = (Timeliness)%60>=10?(Timeliness)%60:"0"+(Timeliness)%60
      var TimelinessStr = m + ":" + s
      // that.setData({Timeliness,TimelinessStr})
      if(daoqi - now >0){
        var time1 = setInterval(function(){
          if(that.data.Timeliness<=0){
            clearInterval(that.data.time);
            clearInterval(that.data.time1);
            return
          }
          var Timeliness = that.data.Timeliness - 1
          var m = parseInt(Timeliness/60)>=10?parseInt(Timeliness/60):"0"+parseInt(Timeliness/60)
          var s = (Timeliness)%60>=10?(Timeliness)%60:"0"+(Timeliness)%60
          var TimelinessStr = m + ":" + s
          that.setData({Timeliness,TimelinessStr})
        },1000)
        that.setData({Timeliness,TimelinessStr,time1})
      }
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
    clearInterval(this.data.time)
    clearInterval(this.data.time1)
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