// pages/admin/plan.js

const app = getApp()

Page({

  data: {
    showTopTips: false,
    userInfo: {},
    date: "----",
    start_time: "12:00",
    end_time: "12:00",
    types: ["导员有约", "院长下午茶", "导师预约"],
    typeIndex: 0
  },

  onLoad: function() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  showTopTips: function () {
    this.setData({
      showTopTips: true
    })
    setTimeout(_ => {
      this.setData({
        showTopTips: false
      })
    }, 2000)
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindStartTimeChange: function(e) {
    this.setData({
      start_time: e.detail.value
    })
  },

  bindEndTimeChange: function(e) {
    this.setData({
      end_time: e.detail.value
    })
  },

  bindTypeChange: function(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },

  formSubmit: function(e) {
    var formdata = e.detail.value
    if (!formdata.name || !formdata.location || !formdata.max_member) {
      this.showTopTips()
    } else {
      var duration = new Date(Date.parse('2000-01-01 ' + formdata.end_time) - Date.parse('2000-01-01 ' + formdata.start_time) + Date.parse('2000-01-01 00:00:00'))
      wx.request({
        url: app.globalData.domain + 'schedule.php',
        data: {
          uid: app.globalData.userId,
          type: 'add',
          name: formdata.name,
          ordertype: this.data.types[formdata.type],
          date: formdata.date,
          start_time: formdata.start_time + ':00',
          duration: duration.toTimeString().substring(0, 8),
          location: formdata.location,
          max_member: formdata.max_member,
          sign: app.makeSign(app.globalData.unique_key)
          //sign: app.makeSign(app.globalData.unique_key + String(Date.parse(new Date()) / 1000))
        },
        method: 'GET',
        dataType: 'json',
        success: res => {
          if (res.data.status == 'success') {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1650,
              mask: true,
              success: res => {
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            })
          } else if (res.data.status == 'denied') {
            wx.showToast({
              title: '页面过期，请刷新',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          } else {
            wx.showToast({
              title: '添加失败！_(:з」∠)_',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }
        }
      })
    }
  }
})