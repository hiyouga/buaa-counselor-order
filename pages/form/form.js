// pages/form/form.js
const app = getApp()

Page({

  data: {
    mid: 0
  },

  onLoad: function (options) {
    this.setData({
      mid: options.mid
    })
  },
  
  formSubmit: function (e) {
    var text = e.detail.value.problem_text
    if (text == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    wx.showModal({
      title: '提示',
      content: '您确定要提交问题吗？',
      success: status => {
        if (status.confirm) {
          wx.request({
            url: app.globalData.domain + 'order.php',
            data: {
              source: 'problem',
              uid: app.globalData.userId,
              mid: this.data.mid,
              problem_text: text,
              sign: app.makeSign(app.globalData.unique_key)
            },
            method: 'GET',
            dataType: 'json',
            success: res => {
              if (res.data.status == 'success') {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1650,
                  mask: true,
                  success: res => {
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../apply/apply'
                      })
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

  formReset: function () {
    //
  }
  
})