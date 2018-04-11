// pages/apply/apply.js
const app = getApp()

Page({

  data: {
    application: []
  },

  onLoad: function () {
    wx.request({
      url: 'https://buaa.hiyouga.top/list.php',
      data: {
        type: 'selectByUid',
        uid: app.globalData.userId
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        res.data.forEach(function (value, key, arr) {
          var end_date = new Date(Date.parse('2000-01-01 ' + value.start_at) + Date.parse('2000-01-01 ' + value.duration) - Date.parse('2000-01-01 00:00:00'))
          value.end_at = end_date.toTimeString().substring(0, 8)
          //console.log(value)
        })
        this.setData({
          orders: res.data
        })
      }
    })
  },
})