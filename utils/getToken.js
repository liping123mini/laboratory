const app = getApp();
const md5 = require('./md5-min');
const CryptoJS = require('./aes');
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

// 验证token方法
const getToken = function (callback) {
  var user = wx.getStorageSync('userId')//缓存用户信息
  if(user !=""&&user !=null){
    callback()
  }else{
    login(callback)
  }
}

// 登录，使用openid换token，如未登录过则无token
function login(callback) {
  wx.login({
    success(res) {
      var code =res.code
          var postData = {
            sign: "",
            data: {
                code: code
            }
          }
          wx.request({
            url: app.globalData.servers + 'api/authorizeInfo',
            method: 'POST',
            dataType: 'json',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: { aesPostData: getParam(postData)},
            success(res) {
              // if (res.statusCode != 200) {
              //   wx.hideLoading()
              //   wx.showToast({
              //     title: '服务器繁忙，请重试',
              //     icon: 'none',
              //     mask: true
              //   })
              //   return
              // }
              switch (res.data.code) {
                case 200:
                  if (res.data.data.token) {
                  
                    !wx.setStorageSync('userName') && wx.setStorageSync('userName', res.data.data.userName)
                    !wx.setStorageSync('userCode') && wx.setStorageSync('userCode', res.data.data.userCode)
                    !wx.setStorageSync('userGroup') && wx.setStorageSync('userGroup', res.data.data.userGroup)
                    !wx.setStorageSync('userId') && wx.setStorageSync('userId', res.data.data.userId)
                  

                  }
                  if (typeof callback === "function") {
                    callback()
                  }
                  break;
                case 7012:
                  wx.hideLoading()
                  wx.showToast({
                    title: '为保证操作正常,请登录',
                    icon: "none",
                    mask: true
                  })
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '/pages/login/login',
                    })
                  }, 1000)
                  break; 
				  
                default:
                  wx.hideLoading()
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    mask: true
                  })
                  break;
              }
            },
            fail() {
              console.log("失败")
              wx.hideLoading()
              wx.showToast({
                title: '授权失败,请关闭程序重新进入',
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
          })
    }
  })
}
module.exports =  getToken