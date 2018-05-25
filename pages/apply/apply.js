// pages/apply/apply.js
const app = getApp()

Page({

  data: {
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
          if (Date.parse(value.date + ' ' + value.start_at) - new Date() > 3600000 * 24) {
            value.can_cancel = ''
          } else {
            value.can_cancel = 'disabled'
          }
          if (value.has_problem == 0) {
            value.prb_btn = ''
          } else {
            value.prb_btn = 'disabled'
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
              } else {
                wx.showToast({
                  title: '预约失败！_(:з」∠)_',
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
              }
            }
          })
        } else if (status.cancel) {
          //order canceled
        }
      }
    })
  }
})