const app = getApp();
const getToken = require('../../utils/getToken')
const post = require('../../utils/post')
const formatTime = require('../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    weekArray: [],
    nowWeek:{},
    courseArray:[],
    index:0,
    disabled: false,
    disabled2: false,
    tabNav: ['周一', '周二', '周三', '周四', '周五','周六','周日']
  },
  sponsorSignIn(e){
    var courseid = e.currentTarget.dataset.courseid//课程id
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success () {
              wx.navigateTo({
                url: '/pages/signIn/index?course'+courseid,
              })
            }
          })
        }else{
          wx.navigateTo({
            url: '/pages/signIn/index?courseid='+courseid,
          })
        }
      }
    })
  },
  signIn(e){
    var courseid = e.currentTarget.dataset.courseid//课程id
    wx.scanCode({
      onlyFromCamera: true,
      success(res){
        if(res.scanType == "WX_CODE" && res.path){
          var time = res.path.split("?")[1].split("=")[1].split("&")[0]
          var attendanceId = res.path.split("?")[1].split("=")[1].split("&")[1]
          var newTime = parseInt(new Date().getTime()/1000)
          if(newTime - time < 60){
            wx.getLocation({
              success:(res)=>{
                var postData = {
                  planId:courseid,
                  attendanceId:attendanceId,
                  userId:wx.getStorageSync('userId'),
                  latitude:res.latitude.toString(),
                  longitude:res.longitude.toString(),
                }
                post.post("api/signIn",postData,function(res){
                  wx.showToast({
                    title: '签到成功',
                    icon:"success"
                  })
                })
              }
            })
          }
        }else{
          wx:wx.showToast({
            title: '小程序码不正确',
            icon: "none",
            mask: true,
          })
        }
      }
    })
  },
  toList(e){
    var courseid = e.currentTarget.dataset.courseid//课程id
    wx.navigateTo({
      url: '/pages/signInList/index?courseid='+courseid,
    })
  },


  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },


  bindPickerChange: function (e) {
    var that = this;
    this.setData({
      index: e.detail.value,
      loadModal: true,
      TabCur:0
    })
    this.changeCourse()
  },
  
  afterweek: function (e) {
    var that = this;
    var nowWeek;
    nowWeek = parseInt(that.data.index)
    that.setData({
      index:  nowWeek-1,
      loadModal: true,
      TabCur:0
    })

    this.changeCourse();
  },
  nextweek: function (e) {
    var that = this;
    var now;
    now = parseInt(that.data.index)
    that.setData({
      index: now + 1,
      loadModal: true,
      TabCur:0
    })
    this.changeCourse();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this
     function getWeekDate() {
       var now = new Date();
       var day = now.getDay();
       var weeks = new Array("星期日","星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
       var week = weeks[day];
       var index = weeks.findIndex(item=> item=== week.toString());
       return index;
    }
    var today = getWeekDate()
    var today1 = ""+today
    for(var i in today1){
      switch(today1){
        case "0":
          that.setData({
            TabCur:6
          })
          break;                          
        case "1":                       
          that.setData({                 
            TabCur:0                    
          })
          break;
        case "2":
          that.setData({
            TabCur:1
          })
          break;
        case "3":
          that.setData({
            TabCur:2
          })
          break;
        case "4":
          that.setData({
            TabCur:3
          })
          break;
        case "5":
          that.setData({
            TabCur:4
          })
          break;
        case "6":
          that.setData({
            TabCur:5
          })
          break;
      }
    }

    if(options.scene){
      var time = options.scene.split("&")[0]
      var attendanceId = options.scene.split("&")[1]
      var newTime = parseInt(new Date().getTime()/1000)
      if(newTime - time < 60){
        wx.getLocation({
          success:(res)=>{
            var postData = {
              attendanceId:attendanceId,
              userId:wx.getStorageSync('userId'),
              latitude:res.latitude.toString(),
              longitude:res.longitude.toString(),
            }
            post.post("api/signIn",postData,function(res){
              wx.showToast({
                title: '签到成功',
                icon:"success"
              })
            })
          }
        })
      }
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
    var that = this;
    this.setData({userGroup:wx.getStorageSync('userGroup')})
    post.post('api/getWeeksAndNowWeek', {}, function (res) {
      for(var i in res){
        if(res[i].nowWeek == 1){
          var now = i;
          that.setData({ 
            nowWeek: res[i],
            index: parseInt(now)
         })
        }
      }
      that.setData({ 
        weekArray: res
     })
          //本周课程start
          var  weekNums=parseInt(that.data.index)+1
          var postData = {
            userId:wx.getStorageSync('userId'),
            weekNums: weekNums.toString()    
          }
          post.post('api/getCoursePlanInfo', postData, function (res) {
            var courseArray = []
            for (var i in res) {
              var obj = {
                name: "周" + that.changeNumber(i - 0 + 1, true),
                list: that.a(res[i])
              }
              courseArray.push(obj)
            }
            that.setData({ 
              courseArray: courseArray,
              loadModal: false
              })
          })
          //本周课程end

    })
   
  },

  changeCourse: function () {
    var that = this
    var weekNums= parseInt(that.data.index)+1
    var postData = {
      userId:wx.getStorageSync('userId'),
      weekNums: weekNums.toString()    
    }
    post.post('api/getCoursePlanInfo', postData, function (res) {
      var courseArray = []
      for (var i in res) {
        var obj = {
          name: "周" + that.changeNumber(i - 0 + 1, true),
          list: that.a(res[i])
        }
        courseArray.push(obj)
      }
      that.setData({ 
        courseArray: courseArray,
        loadModal: false
       })
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
    
  },


 

  //处理课程
  a(arr){
    var newArr = []
    var that = this;
    for(var i in arr){
      arr[i].unit = "第" + that.changeNumber(i - 0 + 1, false) + "课时"
      //  "第" + this.changeNumber(arr[i].unit) + "课时"
      newArr.push(arr[i])
    }
    return newArr
  },
  //阿拉伯数字转换为简写汉字
  changeNumber(num,type){
    var string = ""+num
    var newString
    for(var i in string){
      switch(string){
        case "1":
          newString = "一";
          break;
        case "2":
          newString = "二";
          break;
        case "3":
          newString = "三";
          break;
        case "4":
          newString = "四";
          break;
        case "5":
          newString = "五";
          break;
        case "6":
          newString = "六";
          break;
        case "7":
          newString = type?"日":"七";
          break;
        case "8":
          newString = "八";
          break;
      }
    }
    return newString
  },

})









