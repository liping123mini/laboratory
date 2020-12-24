//app.js
let servers = "https://sys.nciae.edu.cn/"
// let servers = "http://9he62f.natappfree.cc/"
const md5 = require('./utils/md5-min');
const CryptoJS = require('./utils/aes');
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
App({
	onLaunch: function() {
		//控制自定义头部高
		console.log("ahah")
		wx.getSystemInfo({
			success: e => {
				this.globalData.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				this.globalData.Custom = custom;
				this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
			}
		})
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)
		// 登录mycode
		
		// wx.login({
		// 	success:res => {
				
		// 	}
		// })
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							console.log(res, "appp")
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo
							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				}
			}
		})
	},
	globalData: {
		userInfo: null,
		// servers: "http://r5mbx7.natappfree.cc/"
		servers: servers
		// servers: "http://192.168.1.103:8899/"
	}
})
