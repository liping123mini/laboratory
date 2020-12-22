const login = require('../../utils/login')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		account: "", //学号
		password: "", //密码
	},
	accountinp(e) {
		this.setData({
			account: e.detail.value
		})
	},
	accountpwd(e) {
		this.setData({
			password: e.detail.value
		})
	},
	//
	login1(e) {
		let arg = {
			username: this.data.account,
			password: this.data.password
		}
		wx.requestSubscribeMessage({
			tmplIds: ['IH3pYgtDCz4uNNJxDJwS1-9il_4qE5AYJE2JQjJP2R4'],
			success(res) {
				for (var i in res) {
					if (i != 'errMsg') {
						if (res[i] != 'accept') {
							wx.showToast({
								title: '请同意',
								icon: 'none'
							})
							return
						}
					}
				}
				login(arg)
			},
			fail(res) {
				console.log(res)
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

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
