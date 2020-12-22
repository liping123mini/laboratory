const app = getApp()
const md5 = require('./md5-min')
const post = require('post')
const CryptoJS = require('./aes')
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
// 加密--授权
// function getParam1(param) {
//   return encrypt(JSON.stringify(param));
// }
// 加密
function getParam(param) {
  var requestParam = {};
  requestParam.sign = md5(JSON.stringify(param));
  requestParam.data = param;
  return encrypt(JSON.stringify(requestParam));
}
// 登录
function login(data) {
    wx.showLoading({
      title: '正在登录',
      mask: true
    })
    wx.login({
      success(res) {
        var code = res.code
            var postData = {
              password: data.password,
              userName: data.username,
              code: code
            }
			wx.setStorageSync("mycode",res.code)
            wx.request({
              url: app.globalData.servers + 'api/userLogin',
              method: 'POST',
              dataType: 'json',
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
              },
              data: { aesPostData: post.getParam(postData)},
              success(res) {
                if (res.statusCode != 200) {
                  wx.showToast({
                    title: '服务器繁忙，请重试',
                    icon: 'none',
                    mask: true
                  })
                  return
                }
                if (res.data.code == 200) {
                  wx.showToast({
                    title: '登录成功',
                    mask: true,
                  })
                  wx.setStorageSync('userName', res.data.data.userName)
                  wx.setStorageSync('userCode', res.data.data.userCode)  //登录人权限，3--学生
                  wx.setStorageSync('userGroup', res.data.data.userGroup)
                  wx.setStorageSync('userId', res.data.data.userId)
				  wx.setStorageSync('userTag',res.data.data.userTag)
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  }, 1500)
                }else{
                  wx.showToast({
                    title: res.data.message,
                    icon: "none",
                    mask: true,
                  })
                }
              },
              complete(){
                wx.hideLoading({
                  fail(){}
                })
              }
            })
          },
      fail() {
        wx.hideLoading()
        wx.showToast({
          title: '授权失败,请重新授权',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  }
// 将login方法暴露出去
module.exports = login






