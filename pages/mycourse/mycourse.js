const formatTime = require('../../utils/util')
const app = getApp()
const post = require('../../utils/post')
const date = new Date(); //获取系统日期
const years = []
const months = []
const days = []
const bigMonth = [1, 3, 5, 7, 8, 10, 12]

//将日期分开写入对应数组

//年
var getYear = date.getFullYear()
var getMonth = date.getMonth()
var getDate = date.getDate()
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
Page({
	data: {
		tabList: [{
			id: Math.random(),
			value: "一单元"
		}, {
			id: Math.random(),
			value: "二单元"
		}, {
			id: Math.random(),
			value: "三单元"
		}, {
			id: Math.random(),
			value: "四单元"
		}, {
			id: Math.random(),
			value: "五单元"
		}],
		currenttab: 0,
		unitname: '', //当前单元
		isShow: false, //添加弹框--修改完改为false
		isDel: false, //删除弹框
		semesters: [], //学期下拉框数据
		batchs: [], //批次下拉框数据
		// classes: [], //班级下拉框数据
		classes: [], //班级下拉框数据--测试修改
		userGroup: null, //登录人权限
		units: [{
			id: "1",
			unit: '单元一'
		}, {
			id: "2",
			unit: '单元二'
		}, {
			id: "3",
			unit: '单元三'
		}, {
			id: "4",
			unit: '单元四'
		}, {
			id: "5",
			unit: '单元五'
		}], //单元下拉框
		laboratorys: [], //实验室下拉框数据
		courselist: [], //模拟课程列表
		btnmss: "", //按钮名字
		diatitle: "", //弹框标题
		mytime: "", //显示周、日
		semId: "", //记录选择的学期id，
		nowDate: formatTime.formatDate(new Date()),
		loadingHidden: true, //加载是否显示，优化
		userId: null, //用户id
		singledata: null, //选中的单个数据
		userName: null,
		userTag: null, //用来判断是否为当前登陆人
		semdef: null, //学期的默认
		batdef: null, //批次默认
		ubitdef: null, //单元默认
		cladef: null, //班级默认
		labdef: null, //实验室默认
		reson: "", //申请理由
		mydata: { //需要提交的数据
			semId: '', //学期的id
			unit: '', //单元id
			batchNum: '', //批次号
			classIds: '', //班级id
			labId: '', //实验室主键
			date: '', //日期
			id: '', //课程主键
			classNames: '', //班级名称
			userId: null, //yonghuid
		},
		//学生端
		CustomBar: app.globalData.CustomBar,
		TabCur: 0,
		weekArray: [],
		nowWeek: {},
		courseArray: [],
		index: 0,
		disabled: false,
		disabled2: false,
		tabNav: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
		//new
		years: years,
		year: getYear,
		months: months,
		month: getMonth + 1,
		days: days,
		day: getDate,
		value: [20, getMonth, getDate - 1],
		isDaytime: true,
		timeInput: '',
		propDate: false,
	},
	//new
	dateMainBtn() {
		let setYear = this.data.year;
		let setMonth = this.data.month;
		let setDay = this.data.day
		let dateTimeBody = setYear + '-' + setMonth + '-' + setDay
		let todays = this.data.isDaytime === true ? '上午' : '下午'
		this.getMyDay({
			date: formatTime.formatDate(new Date()),
		})
		this.setData({
			propDate: true,
			nowDate: formatTime.formatDate(new Date())
		})
	},
	okBtnTime() {
		this.getCourseList({
			date: this.data.nowDate,
			unit: (this.data.currenttab + 1).toString(),
			userId: this.data.userId
		})
		this.setData({
			propDate: false
		})
	},
	noBtnTime() {
		this.setData({
			propDate: false,
			nowDate: formatTime.formatDate(new Date())
		})
		this.getMyDay({
			date: this.data.nowDate,
		})
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
			isDaytime: !val[3]
		})
		// console.log(setYear,setMonth)
		let dateTimeBody = setYear + '-' + setMonth + '-' + setDay
		let todays = !val[3] === true ? '上午' : '下午'
		// wx.setStorageSync("dateTimeBody",dateTimeBody)
		this.setData({nowDate:dateTimeBody})
		this.getMyDay({
			date: dateTimeBody,
		})
	},
	// 选择子女所在的年级
	bindPickerChange: function(e) {
		this.setData({
			index: e.detail.value
		})
	},
	//new
	//学生端--start
	sponsorSignIn(e) {
		var courseid = e.currentTarget.dataset.courseid //课程id
		wx.getSetting({
			success(res) {
				if (!res.authSetting['scope.userLocation']) {
					wx.authorize({
						scope: 'scope.userLocation',
						success() {
							wx.navigateTo({
								url: '/pages/signIn/index?course' + courseid,
							})
						}
					})
				} else {
					wx.navigateTo({
						url: '/pages/signIn/index?courseid=' + courseid,
					})
				}
			}
		})
	},
	//学生端
	signIn(e) {
		var courseid = e.currentTarget.dataset.courseid //课程id
		wx.scanCode({
			onlyFromCamera: true,
			success(res) {
				if (res.scanType == "WX_CODE" && res.path) {
					var time = res.path.split("?")[1].split("=")[1].split("&")[0]
					var attendanceId = res.path.split("?")[1].split("=")[1].split("&")[1]
					var newTime = parseInt(new Date().getTime() / 1000)
					if (newTime - time < 60) {
						wx.getLocation({
							success: (res) => {
								var postData = {
									planId: courseid,
									attendanceId: attendanceId,
									userId: wx.getStorageSync('userId'),
									latitude: res.latitude.toString(),
									longitude: res.longitude.toString(),
								}
								post.post("api/signIn", postData, function(res) {
									wx.showToast({
										title: '签到成功',
										icon: "success"
									})
								})
							}
						})
					}
				} else {
					wx: wx.showToast({
						title: '小程序码不正确',
						icon: "none",
						mask: true,
					})
				}
			}
		})
	},
	//学生端
	toList(e) {
		var courseid = e.currentTarget.dataset.courseid //课程id
		wx.navigateTo({
			url: '/pages/signInList/index?courseid=' + courseid,
		})
	},

	//非学生端
	tabSelect(e) {
		this.setData({
			TabCur: e.currentTarget.dataset.id,
			scrollLeft: (e.currentTarget.dataset.id - 1) * 60
		})
	},
	//学生端
	tabSelect1(e) {
		this.setData({
			TabCur: e.currentTarget.dataset.id,
			scrollLeft: (e.currentTarget.dataset.id - 1) * 60
		})
	},
	//非学生端
	bindPickerChange: function(e) {
		var that = this;
		this.setData({
			index: e.detail.value,
			loadModal: true,
			TabCur: 0
		})
		this.changeCourse()
	},

	//学生端
	afterweek: function(e) {
		var that = this;
		var nowWeek;
		nowWeek = parseInt(that.data.index)
		that.setData({
			index: nowWeek - 1,
			loadModal: true,
			TabCur: 0
		})

		this.changeCourse();
	},
	//学生端
	nextweek: function(e) {
		var that = this;
		var now;
		now = parseInt(that.data.index)
		that.setData({
			index: now + 1,
			loadModal: true,
			TabCur: 0
		})
		this.changeCourse();
	},
	//处理课程--学生端
	a(arr) {
		var newArr = []
		var that = this;
		for (var i in arr) {
			arr[i].unit = "第" + that.changeNumber(i - 0 + 1, false) + "课时"
			//  "第" + this.changeNumber(arr[i].unit) + "课时"
			newArr.push(arr[i])
		}
		return newArr
	},
	//阿拉伯数字转换为简写汉字--学生端
	changeNumber(num, type) {
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
					newString = type ? "日" : "七";
					break;
				case "8":
					newString = "八";
					break;
			}
		}
		return newString
	},
	onLoad(options) {
		this.setData({
			userId:wx.getStorageSync('userId'),
			userGroup:wx.getStorageSync("userGroup"),
			userName:wx.getStorageSync("userName"),
			userTag:wx.getStorageSync("userTag"),
			'mydata.userId':wx.getStorageSync('userId')
		})
		if (this.data.userGroup === '3') {
			var that = this

			function getWeekDate() {
				var now = new Date();
				var day = now.getDay();
				var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
				var week = weeks[day];
				var index = weeks.findIndex(item => item === week.toString());
				return index;
			}
			var today = getWeekDate()
			var today1 = "" + today
			for (var i in today1) {
				switch (today1) {
					case "0":
						that.setData({
							TabCur: 6
						})
						break;
					case "1":
						that.setData({
							TabCur: 0
						})
						break;
					case "2":
						that.setData({
							TabCur: 1
						})
						break;
					case "3":
						that.setData({
							TabCur: 2
						})
						break;
					case "4":
						that.setData({
							TabCur: 3
						})
						break;
					case "5":
						that.setData({
							TabCur: 4
						})
						break;
					case "6":
						that.setData({
							TabCur: 5
						})
						break;
				}
			}

			if (options.scene) {
				var time = options.scene.split("&")[0]
				var attendanceId = options.scene.split("&")[1]
				var newTime = parseInt(new Date().getTime() / 1000)
				if (newTime - time < 60) {
					wx.getLocation({
						success: (res) => {
							var postData = {
								attendanceId: attendanceId,
								userId: wx.getStorageSync('userId'),
								latitude: res.latitude.toString(),
								longitude: res.longitude.toString(),
							}
							post.post("api/signIn", postData, function(res) {
								wx.showToast({
									title: '签到成功',
									icon: "success"
								})
							})
						}
					})
				}
			}
		} else {
			this.getMyDay({
				date: this.data.nowDate
			}) //获取周、日
			this.getChooseSem() //获取可选择的学期列表
			this.getCourseList({
				date: this.data.nowDate,
				unit: (this.data.currenttab + 1).toString(),
				userId: this.data.userId
			}) //获取课程
		}
	},
	//获取当前时间
	getCurrentTime() {
		let date = new Date()
		let Y = date.getFullYear()
		let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
		let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
		let hours = date.getHours()
		let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
		let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
		date = Y + '-' + M + '-' + D
		return date
	},
	getCurrentTime1() {
		let date = new Date()
		let Y = date.getFullYear()
		let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
		let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
		let hours = date.getHours()
		let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
		let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
		// date = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds // 2019-10-12 15:19:28
		date = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes // 2019-10-12 15:19:28
		// date = Y + '-' + M + '-' + D
		return date
	},
	/**
	 * 生命周期函数--监听页面显示--学生端
	 */
	onShow: function() {
		var that = this;
		//8:00-9:40--1
		//10:20-12:00--2
		//2:00-3:40 --3
		//4:20-6:00 ---4
		//7:00-9:00  --5
		// let si1 = formatTime.formatDate()+" "+"4:20" //4:20-6:00 getCurrentTime1
		let nowTime = new Date(this.getCurrentTime1()).getTime()
		let yi1 = new Date(this.getCurrentTime() + " " + "8:00").getTime()
		let yi2 = new Date(this.getCurrentTime() + " " + "9:40").getTime()
		// let er1 = new Date(this.getCurrentTime()+" "+"10:20").getTime()
		let er2 = new Date(this.getCurrentTime() + " " + "12:00").getTime()
		// let san1 = new Date(this.getCurrentTime()+" "+"14:00").getTime()
		let san2 = new Date(this.getCurrentTime() + " " + "15:40").getTime()
		// let si1 = new Date(this.getCurrentTime()+" "+"16:20").getTime()
		let si2 = new Date(this.getCurrentTime() + " " + "18:00").getTime()
		let wu2 = new Date(this.getCurrentTime() + " " + "21:00").getTime()
		if (nowTime >= yi1 && nowTime <= yi2) {
			this.setData({
				currenttab: 0
			})
		} else if (nowTime <= er2) {
			this.setData({
				currenttab: 1
			})
		} else if (nowTime <= san2) {
			this.setData({
				currenttab: 2
			})
		} else if (nowTime <= si2) {
			this.setData({
				currenttab: 3
			})
		} else if (nowTime <= wu2) {
			this.setData({
				currenttab: 4
			})
		} else {
			this.setData({
				currenttab: 0
			})
		}
		this.setData({
			userGroup: wx.getStorageSync('userGroup')
		})
		post.post('api/getWeeksAndNowWeek', {}, function(res) {
			for (var i in res) {
				if (res[i].nowWeek == 1) {
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
			var weekNums = parseInt(that.data.index) + 1
			var postData = {
				userId: wx.getStorageSync('userId'),
				weekNums: weekNums.toString()
			}
			post.post('api/getCoursePlanInfo', postData, function(res) {
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
	//学生端
	changeCourse: function() {
		var that = this
		var weekNums = parseInt(that.data.index) + 1
		var postData = {
			userId: wx.getStorageSync('userId'),
			weekNums: weekNums.toString()
		}
		post.post('api/getCoursePlanInfo', postData, function(res) {
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
	//班级选择
	chooseClas(e) {
		//先判断是数组还是对象 object
		this.setData({
			'mydata.classIds': e.detail.classids,
			'mydata.classNames': e.detail.classnames
		})
	},
	//上一天
	upday() {
		var curDate = new Date(this.data.nowDate);
		var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);

		var strDate = preDate.getFullYear() + "-";
		if ((preDate.getMonth() + 1) < 10) {
			strDate += '0' + preDate.getMonth() + 1 + "-";
		} else {
			strDate += preDate.getMonth() + 1 + "-";
		}
		if (preDate.getDate() < 10) {
			strDate += "0" + preDate.getDate();
		} else {
			strDate += preDate.getDate();
		}

		this.setData({
			nowDate: strDate
		})
		// strDate += preDate.getHours() + ":";
		// strDate += preDate.getMinutes() + ":";
		// strDate += preDate.getSeconds();
		this.getMyDay({
			date: strDate
		}) //获取当前周、日
		this.getCourseList({
			date: strDate,
			unit: (this.data.currenttab + 1).toString(),
			userId: this.data.userId
		}) //获取课程
	},
	//下一天
	dnday() {
		var curDate = new Date(this.data.nowDate);
		var nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);
		var strDate = nextDate.getFullYear() + "-";
		if ((nextDate.getMonth() + 1) < 10) {
			strDate += '0' + nextDate.getMonth() + 1 + "-";
		} else {
			strDate += nextDate.getMonth() + 1 + "-";
		}
		if (nextDate.getDate() < 10) {
			strDate += '0' + nextDate.getDate();
		} else {
			strDate += nextDate.getDate();
		}
		// strDate += nextDate.getHours() + ":";
		// strDate += nextDate.getMinutes() + ":";
		// strDate += nextDate.getSeconds();
		this.setData({
			nowDate: strDate
		})
		this.getMyDay({
			date: strDate
		}) //获取当前周、日
		this.getCourseList({
			date: strDate,
			unit: (this.data.currenttab + 1).toString(),
			userId: this.data.userId
		}) //获取课程
	},
	// tab切换
	tabSelect(e) {
		let index = e.currentTarget.dataset.index
		this.setData({
			currenttab: index
		})
		this.getCourseList({
			date: this.data.nowDate,
			unit: (index + 1).toString(),
			userId: this.data.userId
		}) //获取课程

	},
	//swiper
	bindchange(e) {
		let index = e.detail.current
		this.setData({
			currenttab: index
		})
		this.getCourseList({
			date: this.data.nowDate,
			unit: (index + 1).toString(),
			userId: this.data.userId
		}) //获取课程
	},
	//textarea所对应的事件
	intreason(e) {
		this.setData({
			reson: e.detail.value
		})
	},
	//获取可用实验室
	getCourseRooms(arg, e) {
		post.post('api/getCourseRooms', arg, res => {
			let arr = e.detail === undefined ? e.split("$") : e.detail.id.split("$"),
				batchNum = arr[0],
				classId = arr[1].split(","), //班级id
				className = arr[2].split(","), //班级名称
				courseId = arr[5],
				classArr = []
			className.forEach((ele, index) => {
				classArr.push({
					claname: ele,
					id: classId[index],
					checked: false
				})
			})
			res.forEach(ele => {
				ele.labname = ele.name
			})
			this.setData({
				laboratorys: res,
				"mydata.batchNum": batchNum,
				classes: classArr,
				'mydata.id': courseId
			})
		})
	},
	//编辑课程
	edit(e) {
		let state = e.currentTarget.dataset.item.state
		let type  = e.currentTarget.dataset.item.type
		if (type === 1) {
			wx.showToast({
				title: "房间已被预约，无法操作",
				icon: "none"
			})
		}else if(type === 2){
			wx.showToast({
				title: "房间已被禁用，无法操作",
				icon: "none"
			})
		}else if(state === 2) {
			wx.showToast({
				title: "审批中，无法操作",
				icon: "none"
			})
		} else {
			this.setData({
				isShow: true,
				btnmss: "编辑",
				diatitle: "编辑课程",
				loadingHidden: false,
				singledata: e.currentTarget.dataset.item
			})
			let that = this,
				id = e.currentTarget.dataset.item.id.toString() //获取当前条的id
			post.post('api/getCourseDetail', {
				id: id
			}, function(res) {
				let arg = {
					semId: res.semId.toString(), //学期的id
					unit: res.unit, //单元id
					batchNum: res.batchNum, //批次号
					classIds: res.classIds, //班级id
					labId: res.labId.toString(), //实验室主键
					id: id, //当前条的主键
					classNames: res.classNames, //班级名称
					date: that.data.nowDate, //日期
					userId: wx.getStorageSync('userId'), //yonghuid
				}
				that.setData({
					loadingHidden: true,
					mydata: arg,
					semdef: {
						name: res.semName
					},
					batdef: {
						name: res.teacherNames + "-" + res.courseNames + "-" + res.classNames
					},
					ubitdef: {
						name: res.unit === "1" ? "单元一" : (res.unit === "2" ? "单元二" : (
							res.unit === "3" ? "单元三" : (
								res.unit === "3" ? "单元四" : "单元五")))
					},
					cladef: {
						name: res.classNames
					},
					labdef: {
						name: res.labName
					}
				})
				let newid = res.batchNum + "$" + res.classIds + "$" + res.classNames + "$" + res.labNames + "$" + res.labIds +
					"$" + res.courseId
				that.getCourseRooms({
					date: that.data.nowDate,
					unit: (that.data.currenttab + 1).toString(),
					batchNum: res.batchNum
				}, newid)
				// that.getChooseSem()
			})
		}
	},
	//删除课程
	del(e) {
		let state = e.currentTarget.dataset.item.state
		let type  = e.currentTarget.dataset.item.type
		if (type === 2) {
			wx.showToast({
				title: "房间已被禁用，无法操作",
				icon: "none"
			})
		}else if(state === 2) {
			wx.showToast({
				title: "审批中，无法操作",
				icon: "none"
			})
		} else {
			this.setData({
				isDel: true,
				singledata: e.currentTarget.dataset.item
			})
		}

	},
	//弹框确定
	diasure() {
		let arg = {
				id: this.data.singledata.id.toString(),
				userId: this.data.userId,
				type: this.data.singledata.type.toString(),
				des: this.data.reson,
				labId: this.data.singledata.labId.toString(),
			},
			that = this
		if (this.data.reson.length <= 0) {
			wx.showToast({
				title: "请填写申请原因",
				icon: "none"
			})
		} else {
			this.setData({
				loadingHidden: false
			})
			post.post('api/deleteCourse', arg, function(res) {
				that.setData({
					loadingHidden: true,
					isDel: false
				})
				that.getCourseList({
					date: that.data.nowDate,
					unit: (that.data.currenttab + 1).toString(),
					userId: that.data.userId
				})
				wx.showToast({
					title: that.data.userGroup === "4" ? "已删除" : "已申请，审核处理中...",
					icon: "none"
				})
			})
		}

	},
	//添加课程
	addcourse() {
		let that = this
		let currenttab = this.data.currenttab
		let arg = {
			semId: '', //学期的id
			unit: (currenttab + 1).toString(), //单元id
			batchNum: '', //批次号
			classIds: '', //班级id
			labId: '', //实验室主键
			date: this.data.nowDate, //日期
			id: '', //课程主键
			classNames: '', //班级名称
			userId:this.data.userId, //yonghuid
		}
		this.setData({
			mydata: arg,
			isShow: true,
			btnmss: "添加",
			diatitle: "添加课程",
			semdef: {
				name: "第一学期"
			},
			unitname: currenttab === 0 ? '单元一' : (currenttab === 1 ? '单元二' : (currenttab === 2 ? '单元三' : (currenttab === 3 ?
				"单元四" : '单元五'))),
		})
		this.getChooseSem()
	},
	//学期下拉框
	semchange(e) {
		let id = e.detail.id.toString()
		this.setData({
			'mydata.semId': id
		})
		this.getBatchSelect({
			semId: id,
			userId: this.data.userId
		}) //获取批次列表
	},
	//批次下拉框
	batchange(e) {
		let arr = e.detail.id.split("$"),
			batchNum = arr[0]
		this.getCourseRooms({
			date: this.data.nowDate,
			unit: (this.data.currenttab + 1).toString(),
			batchNum: batchNum
		}, e)
	},
	//班级下拉框
	clachange(e) {
		let index = e.detail.index
		let arr = this.data.classes
		// console.log(arr)
		// arr[index].checked = !arr[index].checked
		this.setData({
			classes: arr
		})
	},
	//实验室下拉框
	labchange(e) {
		this.setData({
			'mydata.labId': e.detail.id.toString()
		})
	},
	//单元下拉框
	unitchange(e) {
		this.setData({
			'mydata.unit': e.detail.id
		})
	},
	//取消弹框--一级
	cancle() {
		this.setData({
			isDel: false,
			isShow: false,
		})
	},
	//增加对应的表单提交
	mysubmit() {
		let obj = this.data.mydata,
			that = this
		if (this.data.btnmss === '添加') { //添加表单
			post.post('api/addCourse', obj, function(res) {
				that.getCourseList({
					date: that.data.nowDate,
					unit: (that.data.currenttab + 1).toString(),
					userId: that.data.userId
				})
				wx.showToast({
					title: "添加成功",
					icon: "none",
					mask: true
				})
				that.setData({
					isShow: false
				})
			})
		} else { //编辑表单
			obj.des = that.data.reson
			obj.id = that.data.singledata.id.toString()
			if (obj.des.length <= 0) {
				wx.showToast({
					title: "请填写申请原因",
					icon: "none"
				})
			} else {
				post.post('api/editCourse', obj, function(res) {
					that.getCourseList({
						date: that.data.nowDate,
						unit: (that.data.currenttab + 1).toString(),
						userId: that.data.userId
					})
					wx.showToast({
						title: that.data.userGroup === "4" ? "编辑成功" : "已申请，审核处理中...",
						icon: "none"
					})
					that.setData({
						isShow: false
					})
				})
			}
		}
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
	//获取课程列表
	getCourseList(arg) {
		let that = this
		this.setData({
			loadingHidden: false
		})
		post.post('api/getCoursePlanList', arg, (res) => {
			res.forEach(ele => {
				ele.newtype = ele.type === '' ? '' : (ele.type === 1 ? "房间预约" : "房间禁用")
				ele.statustext = ele.state === 2 ? '审批中' : '',
					ele.panduan = ((ele.teacherIds.split(",").indexOf(that.data.userTag) >= 0 || this.data.userGroup === "4")&&ele.type.length <= 0) ? true : false
				// ele.teacherNames = ele.teacherNames.split(",")
			})
			that.setData({
				courselist: res,
				loadingHidden: true
			})
		})
	},
	// 获取可选择的学期列表
	getChooseSem() {
		let that = this
		this.setData({
			loadingHidden: false
		})
		post.post('api/getSemsSelect', {}, function(res) {
			that.setData({
				semesters: res,
				loadingHidden: true,
				'mydata.semId': res[0].id.toString()
			})
			that.getBatchSelect({
				semId: res[0].id.toString(),
				userId: that.data.userId
			})
		})
	},
	//获取可选择的批次列表  batchs classes
	getBatchSelect(arg) {
		let that = this
		post.post('api/getBatchSelect', arg, function(res) {
			res.forEach(ele => {
				ele.newid = ele.batchNum + "$" + ele.classIds + "$" + ele.classNames + "$" + ele.labNames + "$" + ele.labIds +
					"$" + ele.courseId
				ele.batchName = ele.teacherNames + "-" + ele.courseName + "-" + ele.classNames
				if (that.data.mydata.batchNum === ele.batchNum) { //如果是当前批次执行下边操作
					that.getCourseRooms({
						date: that.data.nowDate,
						unit: (that.data.currenttab + 1).toString(),
						batchNum: ele.batchNum,
						labId: that.data.mydata.labId
					}, ele.newid)
				}
			})
			that.setData({
				batchs: res
			})
		})
	}
})
