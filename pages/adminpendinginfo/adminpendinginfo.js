const app = getApp();
const getToken = require('../../utils/getToken')
const post = require('../../utils/post')
const formatTime = require('../../utils/util')
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
			detail: app.globalData.item,
			userId:wx.getStorageSync('userId')
		})
	},
	//审批是否通过
	isAgree(isPass,mess) {
		let arg = {
			id: app.globalData.item.id.toString(),
			isPass: isPass,  //通过审核
			userId: this.data.userId
		}
		this.setData({ loadingHidden:false })
		post.post('api/dealApply', arg, (res) => {
			this.setData({ loadingHidden:true })
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
		  this.setData({ loadingHidden:true })
		}, 500)
	},
	//同意申请
	agree() {
		this.isAgree("1","审核成功")
	},
	//拒绝申请
	refuse() {
		this.isAgree("0","审核失败")
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
	}
})
