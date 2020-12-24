const app = getApp();
const post = require('../../utils/post')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		//new
		TabCur: 0,
		count: 0,
		all_checked: false,
		houseIdArr: [],
		houseIdArr1: [],
		tabNav: ['预约', '课程'],
		loadingHidden: true, //优化页面
		userId: null, //用户id
		houseApproval:[],//房间审批
		classApproval: [],//课程修改审批
		CustomBar: app.globalData.CustomBar,
		diamess:"",
		modalName: null,
		userGroup: null //登录人权限
		
	},
	//获取房间审批列表 
	getHouseList: function() {
		this.setData({ loadingHidden: false })
		let arg = {
			userId:this.data.userId,
			isApply:"0"
		}
		post.post('api/getMyAuditRoom', arg, (res) => {
			res.forEach(ele => {
				ele.checked = false
				ele.year = ele.startTime.slice(0,10)
				ele.time1 = ele.startTime.slice(11)
				ele.time2 = ele.overTime.slice(11)
				ele.pass = ele.isApply ? (ele.isPass ? "已通过" : "已拒绝") : "未审批"
			})
			this.setData({
				loadingHidden: true,
				houseApproval: res
			})
			setTimeout(() =>{
				this.setData({
					loadingHidden: true
				})
			},10000)
		})
	},
	//获取课程调整待审批列表
	getCourseApplyList: function() {
		this.setData({
			loadingHidden: false
		})
		let arg = {
			userId:this.data.userId,
			isApply:"0"
		}
		post.post('api/getCourseApplyList', arg, (res) => {
			res.forEach(ele => {
				ele.tag = ele.type === 1 ? "删除" : (ele.type === 2 ? "新增" : "修改")
				ele.year = ele.startDateTime.slice(0,10)
				ele.time1 = ele.startDateTime.slice(11)
				ele.time2 = ele.endDateTime.slice(11)
				ele.pass = ele.isApply ? (ele.isPass ? "已通过" : "已拒绝") : "未审批"
				ele.checked = false
				ele.unit = ele.unit === 1 ? "单元一" : (ele.unit === 2 ? "单元二" : (ele.unit === 3 ? "单元三" : (ele.unit === 4 ? "单元四" : "单元五")))
				ele.originUnit = ele.originUnit === 1 ? "单元一" : (ele.originUnit === 2 ? "单元二" : (ele.originUnit === 3 ? "单元三" : (ele.originUnit === 4 ? "单元四" : "单元五")))
			})
			this.setData({
				loadingHidden: true,
				classApproval: res
			})
			setTimeout(() =>{
				this.setData({
					loadingHidden: true
				})
			},10000)
		})
	},
	//tab切换
	tabSelect: function(e) {
		let tabcur = e.currentTarget.dataset.id
		this.setData({
			TabCur: tabcur,
			count: 0,
			all_checked: false,
			houseIdArr1:[],
			houseIdArr:[],
			scrollLeft: (e.currentTarget.dataset.id - 1) * 60
		})
		if(tabcur === 0) { //房间审批
			this.getHouseList()
		}else if(tabcur === 1) { //课程修改审批
			this.getCourseApplyList()
		}
	},
	//swiper切换事件
	bindchange: function(e) {
		let index = e.detail.current
		this.setData({ TabCur:index,count:0,all_checked:false,houseIdArr1:[],houseIdArr:[] })
		if(index === 0) { //房间审批
			this.getHouseList()
		}else if(index === 1) { //课程修改审批
			this.getCourseApplyList()
		}
	},
	
	//通过或拒绝房间预约
	dealApply:function(ids,isPass,mess,jiekou) {
		this.setData({
			// loadingHidden: false
		})
		let arg = {
			id:ids,
			isPass:isPass,
			userId: this.data.userId.toString()
		}
		post.post('api/'+jiekou, arg, (res) => {
			let index = this.data.TabCur
			if(index === 0) { //房间审批
				this.getHouseList()
			}else if(index === 1) { //课程修改审批
				this.getCourseApplyList()
			}
			this.setData({
				all_checked:false,
				loadingHidden: true,
				modalName: null
			})
			wx.showToast({
				title: mess,
				icon: "none"
			})
		})
	},
	//通过或拒绝课程修改
	//多选
	change2:function(e) {
		let ids = e.detail.value
		let index1 = this.data.TabCur
		let length = index1 === 1 ? this.data.classApproval.length : this.data.houseApproval.length
		console.log(e.detail.value)
		// console.log(index1,length)
		if(ids.length >= length) {
			this.setData({all_checked:true})
		}else {
			this.setData({all_checked:false})
		}
		this.setData({ houseIdArr: ids })
	},
	change1:function() {
		if(this.data.houseApproval.length > 0 || this.data.classApproval.length > 0){
			this.setData({
				all_checked: !this.data.all_checked,
				count: 0,
				houseIdArr:[],
				houseIdArr1:[],
			})
			let index = this.data.TabCur
			let houseApproval = []
			if(index === 0) {
				houseApproval = this.data.houseApproval
			}else {
				houseApproval = this.data.classApproval
			}
			let arr1 = []
			houseApproval.forEach(ele => {
				ele.checked = this.data.all_checked
				if(ele.checked) {
					arr1.push(ele.id)
				}
			})
			this.setData({
				houseIdArr1: arr1,
				houseApproval: houseApproval,
				classApproval: houseApproval
			})
		}
	},
	hideModal:function(e) {
		this.setData({
			modalName: null
		})
	},
	pass:function(e) {
		if(this.data.houseApproval.length > 0 || this.data.classApproval.length > 0) {
			this.setData({
				diamess: "确认通过此次申请吗",
				modalName: e.currentTarget.dataset.target
			})
		}
	},
	nopass: function(e) {
		if(this.data.houseApproval.length > 0 || this.data.classApproval.length > 0) {
			this.setData({
				diamess: "确认拒绝此次申请吗",
				modalName: e.currentTarget.dataset.target
			})
		}
	},
	srue: function() {
		if(this.data.diamess === "确认通过此次申请吗") {
			let ids;
			let index = this.data.TabCur
			this.setData({ count:0 })
			if(this.data.all_checked) {
				ids = this.data.houseIdArr.join(",") || this.data.houseIdArr1.join(",")
			}else {
				ids = this.data.houseIdArr.join(",")
			}
			if(index === 0) {
				this.dealApply(ids,"1","已通过","dealApply")
			}else {
				this.dealApply(ids,"1","已通过","dealCourseApply")
			}
		}else {
			let ids;
			let index = this.data.TabCur
			this.setData({ count:0 })
			if(this.data.all_checked) {
				ids = this.data.houseIdArr.join(",")|| this.data.houseIdArr1.join(",")
			}else {
				ids = this.data.houseIdArr.join(",")
			}
			if(index  === 0) {
				this.dealApply(ids,"0","已拒绝","dealApply")
			}else {
				this.dealApply(ids,"0","已拒绝","dealCourseApply")
			}
		}
	},
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
		this.setData({ userId:wx.getStorageSync('userId'),userGroup:wx.getStorageSync('userGroup') })
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		let index = app.globalData.TabCur
		if(index === 0) { //房间审批
			this.getHouseList()
		}else if(index === 1) { //课程修改审批
			this.getCourseApplyList()
		}
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

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
