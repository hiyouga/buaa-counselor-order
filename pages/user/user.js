// pages/user/user.js
const app = getApp()

Page({

  data: {
    hideModalput: true,
    input_status: '',
    userInfo: {},
  },

  onLoad: function (options) {
    if (options.type == 'force_real') {
      this.setData({
        hideModalput: false
      })
    }
    if (!options.uid || options.uid == app.globalData.userId) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },

  update_info: function () {
    this.setData({
      hideModalput: !this.data.hideModalput
    })
  },

  confirm_info: function () {
    if (!this.data.userInfo.temp_class_id || !this.data.userInfo.temp_stu_id || !this.data.userInfo.temp_stu_name) {
      this.setData({
        input_status: '输入框不能留空！'
      })
    } else {
      wx.request({
        url: app.globalData.domain + 'user.php',
        data: {
          type: 'updateReal',
          uid: app.globalData.userId,
          class_id: this.data.userInfo.temp_class_id,
          stu_id: this.data.userInfo.temp_stu_id,
          stu_name: this.data.userInfo.temp_stu_name,
          sign: app.makeSign(app.globalData.unique_key)
        },
        method: 'GET',
        dataType: 'json',
        success: res => {
          if (res.data.status == 'success') {
            this.setData({
              ['userInfo.class_id']: this.data.userInfo.temp_class_id,
              ['userInfo.stu_id']: this.data.userInfo.temp_stu_id,
              ['userInfo.stu_name']: this.data.userInfo.temp_stu_name
            })
            app.updateInfo(this.data.userInfo)
            this.setData({
              input_status: '',
              hideModalput: true
            })
            this.setData({
              ['userInfo.temp_class_id']: '',
              ['userInfo.temp_stu_id']: '',
              ['userInfo.temp_stu_name']: ''
            })
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1650,
              mask: true,
              success: res => {
                setTimeout(function () {
                  wx.switchTab({
                    url: '../user/user'
                  })
                }, 2000)
              }
            })
          } else {
            this.setData({
              input_status: '提交出错，请重试！'
            })
          }
        }
      })
    }
  },

  cancel_info: function () {
    this.setData({
      input_status: '',
      hideModalput: true
    })
  },

  getavatar: function (e) {
    this.setData({
      ['userInfo.avatarUrl']: e.detail.userInfo.avatarUrl
    })
    app.updateInfo(this.data.userInfo)
  },

  get_input: function (e) {
    this.setData({
      ['userInfo.temp_' + e.currentTarget.dataset.name]: e.detail.value
    })
  },

  cleardata: function () {
    wx.showModal({
      title: '提示',
      content: '您确认要清除全部本地缓存吗？',
      success: status => {
        if (status.confirm) {
          wx.clearStorage({
            complete: res => {
              app.init()
              wx.reLaunch({
                url: '../index/index'
              })
            }
          })
        }
      }
    })
  }
})