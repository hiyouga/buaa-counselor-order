// pages/admin/review.js

const app = getApp()

Page({
  
  data: {
    schedules: []
  },

  onLoad: function () {
    this.getList()
  },

  getList: function () {
    wx.request({
      url: app.globalData.domain + 'schedule.php',
      data: {
        type: 'selectByUid',
        uid: app.globalData.userId,
        sign: app.makeSign(app.globalData.unique_key)
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        this.setData({
          schedules: res.data
        })
      }
    })
  }
})