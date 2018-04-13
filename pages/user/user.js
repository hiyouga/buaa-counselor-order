// pages/user/user.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideModalput: true,
    input_status: '',
    userInfo: {},    
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
      console.log('mine')
    }
  },

  update_info: function () {
    this.setData({
      hideModalput: !this.data.hideModalput
    })
  },

  confirm_info: function () {
    if (this.data.userInfo.class_id == '' || this.data.userInfo.stu_id == '' || this.data.userInfo.stu_name == '') {
      this.setData({
        input_status: '输入框不能留空！'
      })
    } else {
      wx.request({
        url: 'https://buaa.hiyouga.top/user.php',
        data: {
          type: 'updateReal',
          userid: app.globalData.userId,
          class_id: this.data.userInfo.class_id,
          stu_id: this.data.userInfo.stu_id,
          stu_name: this.data.userInfo.stu_name,
          sign: app.makeSign(app.globalData.unique_key + String(Date.parse(new Date()) / 1000))
        },
        method: 'GET',
        dataType: 'json',
        success: res => {
          if (res.data.status == 'success') {
            wx.setStorage({
              key: 'userInfo',
              data: this.data.userInfo
            })
            this.setData({
              input_status: '',
              hideModalput: true
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

  get_input: function (e) {
    this.setData({
      ['userInfo.' + e.currentTarget.dataset.name]: e.detail.value
    })
  }
})