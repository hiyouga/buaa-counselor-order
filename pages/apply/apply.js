// pages/apply/apply.js
const app = getApp()

Page({

  data: {
    showTopTips: false,
    orders: []
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
      showTopTips: false
    })
    wx.request({
      url: app.globalData.domain + 'order.php',
      data: {
        source: 'selectByUid',
        uid: app.globalData.userId
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        res.data.forEach(function (value, key, arr) {
          var end_date = new Date(Date.parse('2000-01-01 ' + value.start_at) + Date.parse('2000-01-01 ' + value.duration) - Date.parse('2000-01-01 00:00:00'))
          value.end_at = end_date.toTimeString().substring(0, 8)
          if (value.is_complete == 0) {
            if (Date.parse(value.date + ' ' + value.start_at) - new Date() > 3600000 * 24) {
              value.can_cancel = ''
            } else {
              value.can_cancel = 'disabled'
            }
            if (value.is_complete == 0 && value.has_problem == 0) {
              _this.setData({
                showTopTips: true
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
    var mid = e.currentTarget.dataset.mid
    wx.showModal({
      title: '提示',
      content: '您确定要取消该预约吗？',
      success: status => {
        if (status.confirm) {
          wx.request({
            url: app.globalData.domain + 'order.php',
            data: {
              source: 'cancel',
              uid: app.globalData.userId,
              mid: mid,
              sign: app.makeSign(app.globalData.unique_key)
            },
            method: 'GET',
            dataType: 'json',
            success: res => {
              if (res.data.status == 'success') {
                app.globalData.userInfo.all_orders = String(Number(app.globalData.userInfo.all_orders) - 1)
                wx.setStorage({
                  key: 'userInfo',
                  data: app.globalData.userInfo
                })
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1650,
                  mask: true,
                  success: res => {
                    setTimeout(_ => {
                      this.getList()
                    }, 2000)
                  }
                })
              }
            }
          })
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