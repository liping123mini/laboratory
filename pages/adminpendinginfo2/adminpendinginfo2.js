
const post = require('../../utils/post')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    examineResut:'',
    isb: false,
    isa: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this 
    let id = options.id;
    that.setData({
      id:id
    })
    var postData = {
      id: id,
    }
    post.post('api/getDetailById', postData, function (res) {
      that.setData({
        userName:res.userName,  //取消上课老师
        startDate:res.startDate, //取消上课日期
        note:res.note, //取消上课原因
        labName:res.labName,//取消上课实验室
        startTime:res.startTime,  // 取消上课开始时间
        endTime:res.endTime,  //取消上课结束时间  
        classNames:res.classNames,//取消上课班级
        courseName:res.courseName,//取消上课课程
      })
    })
  },
  //审核意见
  bindTextAreaBlur(e) {
    this.setData({
      examineResut: e.detail.value
    })
  },
  //同意申请
  agree(e){
    var that=this;
      var postData={
        id: that.data.id,
        userId:wx.getStorageSync('userId'),
        handleState:"1",
        handleName:wx.getStorageSync('userName'),
        handleReason: that.data.examineResut
      }
    post.post('api/examinePlanApply', postData, function (res) {
      wx.hideLoading()
      wx.showToast({
        title: '审核成功',
        icon: 'none',
        mask: true
      })
      setTimeout(function () {
        wx.navigateBack({})
      }, 300)
      
    })
  },
  //拒绝申请
  refuse(e) {
    var that = this;
    var postData = {
      id: that.data.id,
      userId:wx.getStorageSync('userId'),
      handleState:"2",
      handleName:wx.getStorageSync('userName'),
      handleReason: that.data.examineResut
    }
    post.post('api/examinePlanApply', postData, function (res) {
      wx.hideLoading()
      wx.showToast({
        title: '已拒绝申请',
        icon: 'none',
        mask: true
      })
      setTimeout(function () {
        wx.reLaunch({
          url: '/pages/user/user',
        })
      }, 300)
    })
  },
 
  showModal(e) {
    this.setData({
      isb: true,
      isa: false,
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      isb: false,
      isa: true,
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