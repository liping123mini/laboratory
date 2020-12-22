const app = getApp()
const post = require('../../utils/post')
Page({
	data: {
		//远程开门列表
		remoteList: [],
		//开门记录列表
		historylist: [],
		tablist: [{
			id: Math.random(),
			text: "开门列表"
		}, {
			id: Math.random(),
			text: "开门记录"
		}],
		currettab: 0,
		timmer: null,
		limit: 25,
		page: 1,
		userId: null,
		userName: null,
		isdaodi:{
			flag:false,
			text: ""
		}
	},
	onLoad() {
		this.setData({
			userId: wx.getStorageSync('userId'),
			userName: wx.getStorageSync('userName')
		})
	},
	//开锁
	open: function (e) {
		let item = e.currentTarget.dataset.item
		let arg = {
			devCode: item.deviceCode,
			userId: this.data.userId,
			userName: this.data.userName
		}
		if(item.lookState === '离线') {
			wx.showToast({
				title: "当前处于离线状态，无法进行操作",
				icon: "none"
			})
		}else {
			post.post('api/doorCtrTrue', arg, (res) => {
				setTimeout(() => {
					wx.showToast({
						title: "开门",
						icon: "none"
					})
					this.getLockStates()
				}, 1000)
			})
		}
		

	},
	//tab页切换
	tabchange: function (e) {
		let index = e.currentTarget.dataset.index,that = this
		this.setData({
			historylist:[],
			currettab: index,
			timmer:null
		})
		clearInterval(that.data.timmer)
		if (index === 0) {
			this.setData({ page:1 })
			this.getLockStates()
		} else {
			this.setData({ page:1 })
			this.doorCtrRocord()
		}
	},
	//swiper切换事件
	bindchange: function (e) {
		let index = e.detail.current,that = this
		this.setData({
			historylist:[],
			currettab: index,
			timmer:null
		})
		clearInterval(that.data.timmer)
		if (index === 0) {
			this.setData({ page:1 })
			this.getLockStates()
		} else {
			this.setData({ page:1 })
			this.doorCtrRocord(this.data.page)
		}
	},
	//获取设备锁状态
	getLockStates: function () {
		post.post('api/getLockStates', {
			deptId: '5'
		}, (res) => {
			res.forEach(ele => {
				ele.id = Math.random()
				ele.lookState = ele.lookState === "unlockClose" ? "锁开门关" :
					(ele.lookState === "lockClose" ? "锁闭合门关" : (
						ele.lookState === "lockOpen" ? "锁闭合门开" : (
							ele.lookState === "unlockOpen" ? "锁开门开" : (ele.lookState === "离线" ? "离线" : "获取失败"))))
			})
			this.setData({
				remoteList: res
			})
		})
	},
	//获取开门记录
	doorCtrRocord: function (page) {
		let arg = {
			userId: this.data.userId.toString(),
			limit: this.data.limit.toString(),
			page: page.toString()
		},arr = this.data.historylist
		this.setData({
			'isdaodi.flag':true,
			'isdaodi.text':"加载中"
		})
		post.post('api/doorCtrRocord', arg, res => {
			if(res.length > 0) {
				arr = arr.concat(res)
				this.setData({ historylist:arr })
				this.setData({
					'isdaodi.flag':false
				})
			}else {
				this.setData({
					'isdaodi.flag':true,
					'isdaodi.text':"到底了~~~"
				})
			}
			setTimeout(() => {
				this.setData({ 'isdaodi.flag':false })
			},1500)
			
		})
	},
	onShow: function () {
		this.getLockStates()
		let timmer = setInterval(() => {
			this.getLockStates()
		}, 1000 * 10)
		this.setData({
			timmer: timmer
		})
	},
	onUnload: function() {
		let that = this
		clearInterval(that.data.timmer)
		this.setData({ timmer:null })
	},
	chudi: function() {
		let page = parseInt(this.data.page)
		let current = this.data.currettab
		this.setData({page:++page})
		if(current === 1) {
			this.doorCtrRocord(this.data.page)
		}
	}
})