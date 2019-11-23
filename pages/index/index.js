//index.js
const app = getApp()

Page({
  data: {
    navbar: [
      '导员有约', 
      '院长下午茶', 
      '导师预约', 
      '尚未开放'
      ],
    navurl: ['../order/order', '../null/null', '../null/null', '../null/null'],
    navable: ['', 'disabled', 'disabled', 'disabled']
  },

  onLoad: function () {
    if (app.globalData.userId) {
      this.force_real(app.globalData.userId)
    } else {
      app.userIdReadyCallback = res => {
        this.force_real(app.globalData.userId)
      }
    }
  },
  
  navbarTap: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.href
    })
  },

  force_real: function (userid) {
    wx.request({
      url: app.globalData.domain + 'user.php',
      data: {
        source: 'checkReal',
        uid: userid,
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        //console.log(res)
        if (res.data.is_realname == 0) {
          wx.reLaunch({
            url: '../user/user?type=force_real&uid=' + userid,
          })
        }
      }
    })
  }
})
