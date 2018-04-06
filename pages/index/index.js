//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  clickMe: function() {
    wx.navigateTo({
      url: '../order/order',
    })
  },
  force_real: function () {
    wx.request({
      url: 'https://buaa.hiyouga.top/user.php',
      data: {
        type: 'checkReal',
        userid: app.globalData.userId,
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        console.log(res)
        if (res.data.is_realname == 0) {
          wx.navigateTo({
            url: '../user/user?type=force_real',
          })
        }
      }
    })
  },
  onLoad: function () {
    this.force_real()
    /*if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }*/
  }
})
