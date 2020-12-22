const app = getApp();
const post = require('../../utils/post')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		//new
		TabCur: 0,
		item: null,
		tabNav: ['预约', '课程'],
		loadingHidden: true, //优化页面
		roomlist: [], //房间申请记录
		classlist: [], //课程申请记录
		CustomBar: app.globalData.CustomBar,
		userId: null, //用户id,
		userGroup: null //登录人权限
	},

	//获取房间审批历史 
	getHouseList: function() {
		let arg = {
			userId: this.data.userId
		}
		this.setData({
			loadingHidden: false
		})
		post.post('api/getMyApplyRoom', arg, (res) => {
			// console.log(res)
			res.forEach(ele => {
				ele.year = ele.startTime.slice(0, 10)
				ele.time1 = ele.startTime.slice(11)
				ele.time2 = ele.overTime.slice(11)
				ele.pass = ele.isApply ? (ele.isPass ? "已通过" : "已拒绝") : "未审批"
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
	//获取课程申请历史
	getMyApplyCourse: function() {
		let arg = {
			userId: this.data.userId
		}
		this.setData({
			loadingHidden: false
		})
		post.post('api/getMyApplyCourse', arg, (res) => {
			// console.log(res)
			res.forEach(ele => {
				ele.year = ele.startDateTime.slice(0, 10)
				ele.time1 = ele.startDateTime.slice(11)
				ele.time2 = ele.endDateTime.slice(11)
				ele.tytext = ele.type === 1 ? '删除' : (ele.type === 2 ? '新增' : '修改')
				ele.origindate = ele.originStartDateTime.slice(0, 10)
				ele.pass = ele.isApply ? (ele.isPass  ? "已通过" : "已拒绝") : "未审批",
				ele.unit = ele.unit === 1 ? "单元一" : (ele.unit === 2 ? "单元二" : (ele.unit === 3 ? "单元三" : (ele.unit === 4 ? "单元四" : "单元五")))
				ele.originUnit = ele.originUnit === 1 ? "单元一" : (ele.originUnit === 2 ? "单元二" : (ele.originUnit === 3 ? "单元三" : (ele.originUnit === 4 ? "单元四" : "单元五")))
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
			console.log(index,"agagga")
			this.setData({TabCur:parseInt(index)})
			app.globalData.TabCur = parseInt(index)
		}else {
			console.log("else")
			app.globalData.TabCur = this.data.TabCur
		}
		this.setData({ userId:wx.getStorageSync('userId'),userGroup:wx.getStorageSync('userGroup') })
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		// console.log(app.globalData.TabCur)
		let index = app.globalData.TabCur
		if (index === 0) { //房间审批记录
			this.getHouseList()
		} else if (index === 1) { //课程修改审批记录
			this.getMyApplyCourse()
		}
	},
	tabSelect(e) {
		let index = e.currentTarget.dataset.id
		this.setData({
			TabCur: index,
			scrollLeft: (e.currentTarget.dataset.id - 1) * 60
		})
		if (index === 0) { //房间审批
			this.getHouseList()
		} else if (index === 1) { //课程修改审批
			this.getMyApplyCourse()
		}
	},
	//swiper切换事件
	bindchange: function(e) {
		let index = e.detail.current
		this.setData({
			TabCur: index
		})
		if (index === 0) { //房间审批
			this.getHouseList()
		} else if (index === 1) { //课程修改审批
			this.getMyApplyCourse()
		}
	},
	hideModal:function(e) {
		this.setData({
			modalName: null
		})
	},
	//申请撤回
	redo: function(e) {
		let item = e.currentTarget.dataset.item
		this.setData({
			item: item,
			modalName: e.currentTarget.dataset.target
		})
	},
	srue:function() {
		let item = this.data.item,index = this.data.TabCur
		this.setData({ loadingHidden:false })
		if(index === 0) {
			post.post('api/deleteRoomApply', { id:item.id.toString() }, (res) => {
				wx.showToast({
					title: "已撤销",
					icon: "none"
				})
				this.setData({ 
					loadingHidden: true,
					modalName: null
				})
				if (index === 0) { //房间审批记录
					this.getHouseList()
				} else if (index === 1) { //课程修改审批记录
					this.getMyApplyCourse()
				}
			})
		}else {
			post.post('api/deleteCourseApply', { id:item.id.toString() }, (res) => {
				wx.showToast({
					title: "已撤销",
					icon: "none"
				})
				this.setData({ 
					loadingHidden: true,
					modalName: null
				})
				if (index === 0) { //房间审批记录
					this.getHouseList()
				} else if (index === 1) { //课程修改审批记录
					this.getMyApplyCourse()
				}
			})
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
