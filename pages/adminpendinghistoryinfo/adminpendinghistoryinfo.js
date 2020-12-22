const post = require('../../utils/post')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this 
    let id = options.id;
    var postData = {
      id: id,
    }
    post.post('api/getDetailById', postData, function (res) {
      that.setData({
        teacherNames:res.teacherNames,  //上课老师
        startDate:res.startDate, //上课日期
        classNames:res.classNames,//上课班级
        courseName:res.courseName,
        note:res.note, //申请原因
        labName:res.labName,//上课实验室
        startTime:res.startTime,  // 上课开始时间
        endTime:res.endTime,  //上课结束时间 
        handleReason:res.handleReason, 
      })
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

  //阿拉伯数字转换为简写汉字
  changeNumber(num) {
    var string = "" + num
    var newString
    for (var i in string) {
      switch (string) {
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
          newString = "日"
          break;
      }
    }
    return newString
  },

})