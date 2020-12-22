const app = getApp()
const getToken = require('../../utils/getToken')
const post = require('../../utils/post')
const md5 = require('../../utils/md5-min');
const CryptoJS = require('../../utils/aes');
// aes加密方法
function encrypt(word) {
	var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg22");
	var srcs = CryptoJS.enc.Utf8.parse(word);
	var encrypted = CryptoJS.AES.encrypt(srcs, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.toString()
}
// 加密
function getParam(param) {
	return encrypt(JSON.stringify(param));
}
Page({
	data: {
		cardCur: 0,
		swiperList: [],
		operList1: [{
			id: Math.random(),
			icon: "indexappo iconfont",
			text: "房间预约"
		}, {
			id: Math.random(),
			icon: "indexapproval iconfont",
			text: "待审批",
		}, {
			id: Math.random(),
			icon: "indexappre iconfont",
			text: "审批记录"
		}],
		operList2: [{
			id: Math.random(),
			icon: "indexrecord iconfont",
			text: "申请记录"
		}, {
			id: Math.random(),
			icon: "indexopen iconfont",
			text: "远程开门"
		},
		],
		userGroup: null //登录人权限
	},
	onLoad() {
		this.setData({userGroup:wx.getStorageSync("userGroup")})
		
	},
	onShow() {
		var that = this;
		let arg = {
			"sign":"",
			"data":{
				code: wx.getStorageSync("mycode")
			}
		}
		// console.log(arg)
		wx.request({
			url: app.globalData.servers + 'api/authorizeInfo',
			method: 'POST',
			dataType: 'json',
			header: {
				'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
			},
			data: {aesPostData: getParam(arg)},
			success: function(result) {
				if(result.data.code === 7012) {
					wx.showToast({
						title:result.data.message,
						icon: 'none'
					})
					wx.navigateTo({
						url: "/pages/login/login"
					})
				}else {
					post.post('api/getRotationPicUrl', {}, function(res) {
						that.setData({
							swiperList: res
						})
					})
				}
			},
			fail: function() {
				
			}
		})
		
	},
	// 点击图标事件
	tapclick: function(e) {
		if (e.currentTarget.dataset.item != undefined) {
			let text = e.currentTarget.dataset.item.text
			if (text === '房间预约') {
				wx.navigateTo({
					url: "../appointment/appointment"
				})
			} else if (text === '申请记录') {
				wx.navigateTo({
					url: "../applyhistory/applyhistory"
				})
			} else if (text === '待审批') {
				wx.navigateTo({
					url: "../adminpending/adminpending"
				})
			} else if (text === '审批记录') {
				wx.navigateTo({
					url: "../adminpendinghistory/adminpendinghistory"
				})
			} else if(text === '远程开门') {
				wx.navigateTo({
					url: "../remotedooropen/remotedooropen"
				})
			}
		}
	},
	/**
	 * 开锁功能
	 */

	code: function(e) {
		var that = this;
		wx.scanCode({
			onlyFromCamera: false,
			scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
			success: res => {
				if (res.errMsg == 'scanCode:ok') {
					var postData = {
						userId: wx.getStorageSync('userId'),
						rawData: res.result,
					}
					post.post('api/scanningQsCode', postData, function(res) {
						switch (res.data.code) {
							case 200:
								wx.hideLoading()
								wx.showToast({
									title: "开门成功！",
									icon: 'none',
									mask: true
								})
								break;
							case 7045:
								wx.hideLoading()
								wx.showToast({
									title: "二维码过期，请重新扫描",
									icon: 'none',
									mask: true
								})
								break;
							case 7044:
								wx.hideLoading()
								wx.showToast({
									title: "你没权限开门",
									icon: 'none',
									mask: true
								})
								break;
							case 7041:
								wx.hideLoading()
								wx.showToast({
									title: "设备不在线，请联系管理员",
									icon: 'none',
									mask: true
								})
								break;
							default:
								wx.hideLoading()
								wx.showToast({
									title: res.data.msg,
									icon: 'none',
									mask: true
								})
								break;
						}
					})
				}
			},
			fail: res => {
				// 接口调用失败
				wx.showToast({
					icon: 'none',
					title: '未扫码'
				})
			},
			complete: res => {
				// 接口调用结束
				console.log(res)
			}
		});
	},

	applydoor: function(e) {
		wx.navigateTo({
			url: '../applydoor/applydoor',
		})
	}
})
