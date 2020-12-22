const app = getApp();
const post = require('../../utils/post')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		detail: null,
		userId: null,
		loadingHidden: true, //优化页面
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function() {
		this.setData({
			userId:wx.getStorageSync('userId'),
			detail: app.globalData.item
		})
	},
	//审批是否通过
	isAgree(isPass, mess, type) {
		let arg = {
			id: app.globalData.item.id.toString(),
			isPass: isPass, //通过审核
			userId: this.data.userId,
			type: app.globalData.item.type.toString()
		}
		this.setData({
			loadingHidden: false
		})
		post.post('api/dealCourseApply', arg, (res) => {
			this.setData({
				loadingHidden: true
			})
			wx.showToast({
				title: mess,
				icon: 'none',
				mask: true
			})
			setTimeout(() => {
				wx.navigateBack({})
			}, 300)
		})
		setTimeout(() => {
			this.setData({
				loadingHidden: true
			})
		}, 500)
	},
	//同意申请
	agree() {
		this.isAgree("1","审核通过")
	},
	//拒绝申请
	refuse() {
		this.isAgree("0","审核拒绝")
	},
	showModal(e) {
		this.setData({
			modalName: e.currentTarget.dataset.target
		})
	},
	hideModal(e) {
		this.setData({
			modalName: null
		})
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

	},
})
