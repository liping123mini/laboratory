const app = getApp()
const getToken = require('../../utils/getToken')
const post = require('../../utils/post')
const formatTime = require('../../utils/util')
const dateTimePicker = require('../../utils/dateTimePicker.js');
var that
var list = []
//new
const date = new Date(); //获取系统日期
const years = []
const months = []
const days = []
const hours = []
const minutes = []
const bigMonth = [1, 3, 5, 7, 8, 10, 12]

//将日期分开写入对应数组

//年
var getYear = date.getFullYear()
var getMonth = date.getMonth()
var getDate = date.getDate()
var getHour = date.getHours()
var getMinute = date.getMinutes()
for (let i = getYear - 20; i <= getYear + 20; i++) {
	years.push(i);
}

//月
for (let i = 1; i <= 12; i++) {
	months.push(i);
}

//日
for (let i = 1; i <= 31; i++) {
	days.push(i);
}
//时
for(let i=1;i<=23;i++) {
	hours.push(i)
}
//分  minute
for(let i=1;i<=59;i++) {
	minutes.push(i)
}
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
		userGroup:null, //登录人权限
		//new
		mytime:"",
		myDate:"",
		years: years,
		year: getYear,
		months: months,
		month: getMonth + 1,
		days: days,
		day: getDate,
		hours:hours,
		getHour:getHour,
		minutes:minutes,
		getMinute:getMinute,
		value: [20, getMonth, getDate - 1,getHour-1,getMinute-1],
		isDaytime: true,
		timeInput: '',
		propDate: false,
		showTime:false,
		showTime1:false,
		
		myDate1:"",
		years1: years,
		year1: getYear,
		months1: months,
		month1: getMonth + 1,
		days1: days,
		day1: getDate,
		hours1:hours,
		getHour1:getHour,
		minutes1:minutes,
		getMinute1:getMinute,
		value1: [20, getMonth, getDate - 1,getHour-1,getMinute-1],
	},
	//new
	onUnload() {
		wx.setStorageSync("myDate","")
		wx.setStorageSync("myDate1","")
	},
	//new
	dateMainBtn() {
		let setYear = getYear;
		let setMonth = (getMonth+1) < 10 ? "0"+( (getMonth+1)) :  (getMonth+1);
		let setDay = getDate < 10 ? "0"+getDate : getDate;
		let setHour = getHour < 10 ? "0"+getHour : getHour;
		let setMin = getMinute <10 ? "0"+getMinute : getMinute;
		// let dateTimeBody = setYear + '-' + setMonth + '-' + setDay + " " + setHour + ":" + setMin
		let todays = this.data.isDaytime === true ? '上午' : '下午'
		this.getMyDay({
			date: formatTime.formatDate(new Date()),
		})
		let Year = new Date().getFullYear();
		let Month = (new Date().getMonth()+1) < 10 ? "0"+( (new Date().getMonth()+1)) :  (new Date().getMonth()+1);
		let Day = new Date().getDate() < 10 ? "0"+ new Date().getDate() :  new Date().getDate();
		let Hour = new Date().getHours() < 10 ? "0"+new Date().getHours() : new Date().getHours();
		let Min = new Date().getMinutes() <10 ? "0"+new Date().getMinutes() : new Date().getMinutes();
		let dateTimeBody = Year + '-' + Month + '-' + setDay + " " + Hour + ":" + Min
		// console.log(setMonth,setDay,setHour,setMin)
		wx.setStorageSync("myDate",dateTimeBody)
		this.setData({
			propDate: true,
			// myDate:dateTimeBody,
			// value:[20,setMonth,setDay-1,setHour,setMin],
			nowDate: formatTime.formatDate(new Date())
		})
	},
	dateMainBtn1() {
		let setYear = getYear;
		let setMonth = (getMonth+1) < 10 ? "0"+( (getMonth+1)) :  (getMonth+1);
		let setDay = getDate < 10 ? "0"+getDate : getDate;
		let setHour = getHour < 10 ? "0"+getHour : getHour;
		let setMin = getMinute <10 ? "0"+getMinute : getMinute;
		// let dateTimeBody = setYear + '-' + setMonth + '-' + setDay + " " + setHour + ":" + setMin
		let todays = this.data.isDaytime === true ? '上午' : '下午'
		this.getMyDay({
			date: formatTime.formatDate(new Date()),
		})
		
		let Year = new Date().getFullYear();
		let Month = (new Date().getMonth()+1) < 10 ? "0"+( (new Date().getMonth()+1)) :  (new Date().getMonth()+1);
		let Day = new Date().getDate() < 10 ? "0"+ new Date().getDate() :  new Date().getDate();
		let Hour = new Date().getHours() < 10 ? "0"+new Date().getHours() : new Date().getHours();
		let Min = new Date().getMinutes() <10 ? "0"+new Date().getMinutes() : new Date().getMinutes();
		let dateTimeBody = Year + '-' + Month + '-' + setDay + " " + Hour + ":" + Min
		wx.setStorageSync("myDate1",dateTimeBody)
		this.setData({
			propDate1: true,
			// myDate1:dateTimeBody,
			// value1:[20,setMonth,setDay-1,setHour,setMin],
			nowDate: formatTime.formatDate(new Date())
		})
	},
	okBtnTime() {
		this.setData({
			propDate: false,
			showTime: true,
			myDate:wx.getStorageSync("myDate")
		})
	},
	okBtnTime1() {
		this.setData({
			propDate1: false,
			showTime1: true,
			myDate1:wx.getStorageSync("myDate1")
		})
	},
	noBtnTime() {
		if(this.data.showTime) {
			this.setData({
				propDate: false,
				nowDate: formatTime.formatDate(new Date())
			})
		}else {
			this.setData({
				propDate: false,
				showTime:false
			})
		}
		
	},
	noBtnTime1() {
		if(this.data.showTime1) {
			this.setData({
				propDate1: false,
				nowDate: formatTime.formatDate(new Date())
			})
		}else {
			this.setData({
				propDate1: false,
				showTime1:false
			})
		}
		
	},
	//判断元素是否在一个数组
	contains: function(arr, obj) {
		var i = arr.length;
		while (i--) {
			if (arr[i] === obj) {
				return true;
			}
		}
		return false;
	},
	setDays: function(day) {
		const temp = [];
		for (let i = 1; i <= day; i++) {
			temp.push(i)
		}
		this.setData({
			days: temp,
		})
	},
	//选择滚动器改变触发事件
	bindChange: function(e) {
		const val = e.detail.value;
		//判断月的天数
		const setYear = this.data.years[val[0]];
		const setMonth = this.data.months[val[1]];
		const setDay = this.data.days[val[2]]
		const setHour = this.data.hours[val[3]]
		const setMin = this.data.minutes[val[4]]
		//闰年
		if (setMonth === 2) {
			if (setYear % 4 === 0 && setYear % 100 !== 0) {
				this.setDays(29);
			} else {
				this.setDays(28);
			}
		} else {
			//大月
			if (this.contains(bigMonth, setMonth)) {
				this.setDays(31)
			} else {
				this.setDays(30)
			}
		}
		this.setData({
			year: setYear,
			month: setMonth,
			day: setDay,
			getHour: setHour,
			getMinute: setMin,
			isDaytime: !val[3]
		})
		// console.log(setYear,setMonth)
		let dateTimeBody = setYear + '-' + (setMonth<10?"0"+setMonth:setMonth) + '-' + (setDay<10?"0"+setDay:setDay) + " " + (setHour<10?"0"+setHour:setHour) + ":" + (setMin<10?"0"+setMin:setMin)
		let todays = !val[3] === true ? '上午' : '下午'
		wx.setStorageSync("myDate",dateTimeBody)
		// this.setData({myDate:dateTimeBody})
		this.getMyDay({
			date: dateTimeBody,
		})
	},
	//选择滚动器改变触发事件
	bindChange1: function(e) {
		const val = e.detail.value;
		//判断月的天数
		const setYear = this.data.years1[val[0]];
		const setMonth = this.data.months1[val[1]];
		const setDay = this.data.days1[val[2]]
		const setHour = this.data.hours1[val[3]]
		const setMin = this.data.minutes1[val[4]]
		//闰年
		if (setMonth === 2) {
			if (setYear % 4 === 0 && setYear % 100 !== 0) {
				this.setDays(29);
			} else {
				this.setDays(28);
			}
		} else {
			//大月
			if (this.contains(bigMonth, setMonth)) {
				this.setDays(31)
			} else {
				this.setDays(30)
			}
		}
		this.setData({
			year1: setYear,
			month1: setMonth,
			day1: setDay,
			getHour1: setHour,
			getMinute1: setMin,
			isDaytime: !val[3]
		})
		// console.log(setYear,setMonth)
		let dateTimeBody = setYear + '-' + (setMonth<10?"0"+setMonth:setMonth) + '-' + (setDay<10?"0"+setDay:setDay) + " " + (setHour<10?"0"+setHour:setHour) + ":" + (setMin<10?"0"+setMin:setMin)
		let todays = !val[3] === true ? '上午' : '下午'
		wx.setStorageSync("myDate1",dateTimeBody)
		// this.setData({myDate1:dateTimeBody})
		this.getMyDay({
			date: dateTimeBody,
		})
	},
	//获取当前日期
	getMyDay(arg) {
		let that = this
		post.post('api/getSemDay', arg, function(res) {
			that.setData({
				mytime: res
			})
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
			userGroup:wx.getStorageSync("userGroup"),
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
			startTime: this.data.myDate,
			endTime: this.data.myDate1,
			labIds: this.data.labIds,
			userId: this.data.userId,
			tagId: this.data.appoint.dictId,
			des: this.data.textareaAValue
		}
		// console.log(arg)
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
			startTime: this.data.myDate,
			endTime: this.data.myDate1,
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
