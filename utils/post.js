const app = getApp();
const md5 = require('./md5-min');
const CryptoJS = require('./aes');
const getToken = require('getToken');
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
	var requestParam = {};
	requestParam.sign = '';
	requestParam.data = param;
	return encrypt(JSON.stringify(requestParam));
}
// 请求
const post = (url, data, callback) => {
	// wx.showLoading({
	//   title: '加载中...',
	//   mask: true
	// })
	if (typeof data == 'object') {
		var postData = data
		var callback = callback
	} else if (typeof data == 'function') {
		var postData = {}
		var callback = data
	}
	// 请求前验证是否登录并验证本地token是否过期
	getToken(function() {
		// 微信小程序请求
		// 请求参数加上token
		// console.log(wx.getStorageSync('token'))
		postData.token = wx.getStorageSync('token').data
		wx.request({
			url: app.globalData.servers + url,
			method: 'POST',
			dataType: 'json',
			header: {
				'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
			},
			data: {
				aesPostData: getParam(postData)
			},

			success(res) {
				if (res.statusCode !== 200) {
					wx.showToast({
						title: '服务器繁忙，请重试',
						icon: 'none',
						mask: true
					})
					return
				}
				// console.log('接口：'+app.globalData.servers + url)
				// console.log('请求数据：'+JSON.stringify(data))
				switch (res.data.code) {
					case 200:
						if (typeof callback === "function") {
							callback(res.data.data)
						}
						break;
						// case 401:
						//   wx.removeStorageSync('token')
						//   delete postData.token
						//   getToken(post(url,postData,callback))
						//   break;
					default:
						// wx.hideLoading()
						wx.showToast({
							title: res.data.message,
							icon: "none",
							mask: true
						})
						break;
				}
			},
			fail() {
				// wx.hideLoading()
				wx.showToast({
					title: '网络中断,请检查网络后重试 ',
					icon: 'none'
				})
			}
		})
	})
}
module.exports = {
	getParam,
	post,
}
