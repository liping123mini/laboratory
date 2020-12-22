const app = getApp();
const post = require('../../utils/post')

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		//new
		TabCur: 0,
		CustomBar: app.globalData.CustomBar,
		tabNav: ['预约', '课程'],
		roomlist: [],//房间审批记录
		classlist:[], //课程审批激励
		userId: null,
		loadingHidden: true, //优化页面
		isDel:false,
		reson: '',
		item: null
	},

	//
	intreason(e) {
		this.setData({
			reson: e.detail.value
		})
	},
	mydel: function(e) {
		this.setData({ isDel:true,item:e.currentTarget.dataset.item })
	},
	diasure: function() {
		let arg = {
			id: this.data.item.id.toString(),
			userId: this.data.userId,
			type: "1",
			des: this.data.reson
		}
		if(this.data.reson.length > 0) {
			post.post('api/deleteCourse', arg, (res) => {
				this.setData({ isDel:false })
				this.getMyAuditRoom()
				wx.showToast({
					title: "已删除",
					icon: "none"
				})
			})
		}else {
			wx.showToast({
				title: "请填写申请理由",
				icon: "none"
			})
		}
	},
	cancle: function() {
		this.setData({ isDel:false })
	},
	//获取房间审批记录,
	getMyAuditRoom: function() {
		let arg = {
			userId: this.data.userId,
			isApply: "1"
		}
		this.setData({ loadingHidden:false })
		post.post('api/getMyAuditRoom', arg, (res) => {
			res.forEach(ele => {
				console.log(ele)
				ele.year = ele.startTime.slice(0,10)
				ele.pass = ele.isPass ? "已通过" : "已拒绝"
			})
			this.setData({
				loadingHidden: true,
				roomlist: res
			})
		})
		setTimeout(() =>{
			this.setData({
				loadingHidden: true
			})
		},10000)
	},
	//获取我的课程调整审批记录
	getCourseApplyList: function() {
		let arg = {
			userId: this.data.userId,
			isApply: "1"
		}
		this.setData({ loadingHidden:false })
		post.post('api/getCourseApplyList', arg, (res) => {
			res.forEach(ele => {
				ele.typetext = ele.type === 1 ? "删除" : (ele.type === 2 ? '添加' : '编辑')
				ele.year = ele.startDateTime.slice(0,10)
				ele.pass = ele.isPass ? "已通过" : "已拒绝"
				ele.unit = ele.unit === 1 ? '单元一' : (ele.unit === 2 ? "单元二" : (ele.unit === 3 ? '单元三' : (ele.unit === 4 ? '单元四' : '单元五')))
				ele.originUnit = ele.originUnit === 1 ? "单元一" : (ele.originUnit === 2 ? "单元二" : (ele.originUnit === 3 ? '单元三' : (ele.originUnit === 4 ? '单元四' : '单元五')))
				ele.origintime = ele.originStartDateTime.slice(0,10)
			})
			this.setData({
				loadingHidden: true,
				classlist: res
			})
		})
		setTimeout(() =>{
			this.setData({
				loadingHidden: true
			})
		},10000)
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		let index = options.index
		if(index !== undefined) {
			console.log(index,"hhaha")
			this.setData({TabCur:parseInt(index)})
			app.globalData.TabCur = this.data.TabCur
		}else {
			console.log("else")
			app.globalData.TabCur = this.data.TabCur
		}
		this.setData({userId: wx.getStorageSync("userId")})
	},
	onShow: function() {
		let index = app.globalData.TabCur
		if(index === 0) { //房间审批记录
			this.getMyAuditRoom()
		}else if(index === 1) { //课程修改审批记录
			this.getCourseApplyList()
		}
	},
	info: function(e) {
		let item = e.currentTarget.dataset.item;
		app.globalData.item = item
		app.globalData.TabCur = this.data.TabCur
		wx.navigateTo({
			url: '../adminpendinghistoryinfo/adminpendinghistoryinfo'
		})
	},
	info1: function(e) {
		let item = e.currentTarget.dataset.item;
		app.globalData.item = item
		app.globalData.TabCur = this.data.TabCur
		wx.navigateTo({
			url: '../adminpendinghistoryinfo1/adminpendinghistoryinfo1'
		})
	},
	//tab页切换
	tabSelect(e) {
		let index = e.currentTarget.dataset.id
		this.setData({
			TabCur: index,
			scrollLeft: (e.currentTarget.dataset.id - 1) * 60
		})
		if(index === 0) { //房间审批
			this.getMyAuditRoom()
		}else if(index === 1) { //课程修改审批
			this.getCourseApplyList()
		}
	},
	//swiper切换事件
	bindchange: function(e) {
		let index = e.detail.current
		this.setData({ TabCur:index })
		if(index === 0) { //房间审批
			this.getMyAuditRoom()
		}else if(index === 1) { //课程修改审批
			this.getCourseApplyList()
		}
	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
