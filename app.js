//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          //console.log(res.code)
          wx.request({
            url: 'https://buaa.hiyouga.top/login.php',
            data: {
              code: res.code
            },
            method: 'GET',
            dataType: 'json',
            success: function (cdata) {
              if (cdata.data.errcode) {
                console.log('登录失败！' + cdata.data.errmsg)
              } else {
                wx.setStorage({
                  key: "userid",
                  data: cdata.data.openid
                })
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)

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
    userInfo: null
  }
})