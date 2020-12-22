const app = getApp()
const getToken = require('../../utils/getToken')
const post = require('../../utils/post')
const formatTime = require('../../utils/util')
const dateTimePicker = require('../../utils/dateTimePicker.js');
var that
var list = []
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		nowDate: '',
		textareaAValue: '', //申请理由
		multiIndex: [0, 0],
		listOfOne: [],
		listOfOneChild: [],
		multiArray: [],
		objectMultiArray: [],
		deptId: '',
		labIds: '', // 房间主键ids
		labNames: '', // 房间names
		appointments: [], //预约原因--标签
		appoint: {
			index: 0, //默认选第一个标签
			dictId: '', //所选标签的id
		},
		appointmenthouses: [], //可预约的房间
		houseindex: 0, //默认选择的房间
		mypickerShow: false,
		houseId: [], //所选房间id--chechjgroup
		houseId1: [], //所选房间id--卡片
		item: null, //所选的房间,
		showName: false,
		userId: null,
		//new
		startYear: new Date().getFullYear(),
		endYear: new Date().getFullYear() + 3,
		startDateArray: null,
		endDateArray: null,
		startTime: "",
		endTime: "",
		showTime: false, //开始
		showTime1: false, //结束
		userGroup: wx.getStorageSync("userGroup") //登录人权限
	},
	//new
	bindTypePickerChange: function(e) {
		this.setData({
			typeIndex: e.detail.value
		})
	},
	bindStartDateChange: function(e) {
		let startDateArray = this.data.startDateArray,
			startDate = e.detail.value
		this.setData({
			showTime: true,
			startTime: startDateArray[0][startDate[0]] + "-" + startDateArray[1][startDate[1]] + "-" + startDateArray[2][
				startDate[2]
			] + " " + startDateArray[3][startDate[3]] + ":" + startDateArray[4][startDate[4]],
			startDate: e.detail.value
		})
	},
	changeEndDateColumn(e) {

	},
	changeDateTimeColumn(e) {

	},
	bindEndDateChange: function(e) {
		let endDateArray = this.data.endDateArray,
			endDate = e.detail.value
		this.setData({
			showTime1: true,
			endTime: endDateArray[0][endDate[0]] + "-" + endDateArray[1][endDate[1]] + "-" + endDateArray[2][endDate[2]] +
				" " + endDateArray[3][endDate[3]] + ":" + endDateArray[4][endDate[4]],
			endDate: e.detail.value
		})
	},
	//new
	//获取标签列表
	getApplyTag: function() {
		let that = this
		post.post('api/getApplyTag', {}, function(res) {
			that.setData({
				appointments: res,
				"appoint.dictId": res[that.data.appoint.index].dictId
			})
		})
	},
	//获取实验室列表--对应可约房间   
	getApplyRooms: function(arg) {
		if(!this.data.showTime) {
			wx.showToast({
				title: "请先选择预约时间",
				icon: "none"
			})
		}else {
			post.post('api/getApplyRooms', arg, (res) => {
				if(res.length <= 0) {
					wx.showToast({
						title: "暂无房间可预约",
						icon: "none"
					})
				}else{
					this.setData({
						mypickerShow: !this.data.mypickerShow
					})
					res.forEach(ele => {
						ele.checked = false
					})
					this.setData({
						appointmenthouses: res
					})
				}
			})
		}
	},
	//表单提交 -- 房间预约
	addRoomApply: function(arg) {
		if (arg.des.length <= 0) {
			wx.showToast({
				title: "请填写预约原因",
				icon: "none"
			})
		} else if (arg.labIds.length <= 0) {
			wx.showToast({
				title: "请选择实验室",
				icon: "none"
			})
		} else {
			post.post('api/addRoomApply', arg, (res) => {
				if (this.data.userGroup === '4') {
					wx.navigateTo({
						url: "/pages/adminpending/adminpending"
					})
				} else {
					wx.showToast({
						title: "已预约，请等待审核",
						icon: "none"
					})
					wx.navigateBack({})
				}
			})
		}
	},
	//选择框
	checkgroup: function(e) {
		let value = e.detail.value
		let houseId = []
		value.forEach(ele => {
			houseId.push({
				id: ele.split(",")[0],
				name: ele.split(",")[1]
			})
		})
		this.setData({
			houseId: houseId
		})
	},
	//选择房间确定
	sure: function() {
		let arr = [],
			arrid = [],
			arrname = [],
			tpl = []
		arr = arr.concat(this.data.houseId).concat(this.data.houseId1)
		tpl = Array.from(new Set(arr))
		tpl.forEach(ele => {
			arrid.push(ele.id);
			arrname.push(ele.name)
		})
		arrid = Array.from(new Set(arrid))
		arrname = Array.from(new Set(arrname))
		this.setData({
			labIds: arrid.join(","),
			labNames: arrname.join(","),
			mypickerShow: false
		})
	},
	//选择房间取消
	cancle: function() {
		this.setData({
			mypickerShow: false
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function() {
		this.setData({
			userId:wx.getStorageSync('userId'),
			nowDate: formatTime.formatDate(new Date()),
		});
		this.getApplyTag(); //获取标签列表
		let that = this
		//获取实验室列表 
		var postData = {
			userId: wx.getStorageSync('userId'),
		}
		//时间选择器
		//new
		var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
		this.setData({
			startDate: obj.dateTime,
			startDateArray: obj.dateTimeArray,
			endDate: obj.dateTime,
			endDateArray: obj.dateTimeArray
		})
		//new

	},
	bindMultiPickerColumnChange: function(e) {
		// console.log("换学院")
		// console.log(e.detail.column)
		// console.log(e.detail.value)
		var multiArray = that.data.multiArray;
		var multiIndex = that.data.multiIndex;
		multiIndex[e.detail.column] = e.detail.value;
		switch (e.detail.column) {
			case 0:
				var list = []
				for (var i = 0; i < that.data.objectMultiArray.length; i++) {
					if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
						list.push(that.data.objectMultiArray[i])
					}
				}
				multiArray[1] = list
				multiIndex[1] = 0;
				break;
		}
		this.setData({
			multiArray,
			multiIndex
		})
	},

	formSubmit: function(e) {
		let arg = {
			date: this.data.nowDate,
			startTime: this.data.startTime,
			endTime: this.data.endTime,
			labIds: this.data.labIds,
			userId: this.data.userId,
			tagId: this.data.appoint.dictId,
			des: this.data.textareaAValue
		}
		if (!this.data.showTime) {
			wx.showToast({
				title: "请选择开始时间",
				icon: "none"
			})
		} else if (!this.data.showTime1) {
			wx.showToast({
				title: "请选择结束时间",
				icon: "none"
			})
		} else {
			this.addRoomApply(arg)
		}
	},


	// 时间选择 开始时间
	TimeChange(e) {
		this.setData({
			time: e.detail.value
		})
	},
	// 时间选择 结束时间
	TimeChange1(e) {
		this.setData({
			time1: e.detail.value
		})
	},
	// 日期选择
	DateChange(e) {
		this.setData({
			nowDate: e.detail.value
		})
	},
	// 文本域
	bindTextAreaBlur(e) {
		this.setData({
			textareaAValue: e.detail.value
		})
	},

	// 预约原因
	appointmentrea: function(e) {
		let index = Number(e.detail.value)
		this.setData({
			'appoint.index': index,
			'appoint.dictId': this.data.appointments[index].dictId
		})
	},
	//可控制房子弹框的开关
	appointmenthouse: function(e) {
		let arg = {
			date: this.data.nowDate,
			startTime: this.data.startTime,
			endTime: this.data.endTime,
			userId: this.data.userId
		}
		this.getApplyRooms(arg) //获取实验室列表
	},
	//选择房子
	choosehouse: function(e) {
		let index = e.currentTarget.dataset.index
		let id = e.currentTarget.dataset.item.id
		let arr = []
		this.setData({
			['appointmenthouses[' + index + '].checked']: !this.data.appointmenthouses[index].checked,
			// item: e.currentTarget.dataset.item,
		})
		let appointmenthouses = this.data.appointmenthouses
		appointmenthouses.forEach(ele => {
			if (ele.checked) {
				arr.push({
					id: ele.id.toString(),
					name: ele.name
				})
			}
		})
		this.setData({
			houseId1: arr
		})
	},
	//去掉遮挡层
	zhedang: function() {
		this.setData({
			mypickerShow: false
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		var that = this
		that.setData({
			username: wx.getStorageSync('userName'),
			userCode: wx.getStorageSync('userCode'),
		})
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
