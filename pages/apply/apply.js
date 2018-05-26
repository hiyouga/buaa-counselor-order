// pages/apply/apply.js
const app = getApp()

Page({

  data: {
    hideTips: true,
    application: []
  },

  onShow: function () {
    this.getList()
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getList()
  },

  getList: function () {
    var _this = this
    this.setData({
      hideTips: true
    })
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
          if (value.is_complete == 0) {
            if (Date.parse(value.date + ' ' + value.start_at) - new Date() > 3600000 * 24) {
              value.can_cancel = ''
            } else {
              value.can_cancel = 'disabled'
            }
            if (value.has_problem == 0) {
              _this.setData({
                hideTips: false
              })
              value.prb_btn = ''
            } else {
              value.prb_btn = 'disabled'
            }
          }
        })
        this.setData({
          orders: res.data
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  cancel_order: function (e) {
    var _this = this
    var mid = e.currentTarget.dataset.mid
    wx.showModal({
      title: '提示',
      content: '您确定要取消该预约吗？',
      success: status => {
        if (status.confirm) {
          wx.request({
            url: 'https://buaa.hiyouga.top/order.php',
            data: {
              type: 'cancel',
              uid: app.globalData.userId,
              mid: mid,
              sign: app.makeSign(app.globalData.unique_key)
            },
            method: 'GET',
            dataType: 'json',
            success: res => {
              if (res.data.status == 'success') {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1650,
                  mask: true,
                  success: res => {
                    setTimeout(function () {
                      _this.getList()
                    }, 2000)
                  }
                })
              }
            }
          })
        } else if (status.cancel) {
          //order canceled
        }
      }
    })
  },
  
  write_problem: function (e) {
    wx.navigateTo({
      url: '../form/form?mid=' + e.currentTarget.dataset.mid
    })
  }
})