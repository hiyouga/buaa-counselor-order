//app.js
import md5 from 'utils/md5.js'
App({
  onLaunch: function () {
    this.init()
  },

  init: function() {
    wx.getStorage({
      key: 'openid',
      success: res => {
        this.globalData.openId = res.data
        this.globalData.userId = wx.getStorageSync('userId')
        this.globalData.unique_key = wx.getStorageSync('unique_key')
        wx.getStorage({
          key: 'userInfo',
          success: res => {
            this.globalData.userInfo = res.data
          },
          fail: res => {
            this.getUserInfo(this.globalData.userId)
          }
        })
        if (this.userIdReadyCallback) {
          this.userIdReadyCallback(this.globalData.userId)
        }
        wx.request({
          url: this.globalData.domain + 'user.php',
          data: {
            source: 'updateTime',
            uid: this.globalData.userId,
          },
          method: 'GET',
          dataType: 'json',
          success: cdata => {
            if (cdata.data.status != 'success') {
              console.log('Update Time failed!')
            } else {
              //console.log('Time Updated')
            }
          }
        })
      },
      fail: res => {
        this.doLogin()
      }
    })
  },

  doLogin: function () {
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: this.globalData.domain + 'login.php',
            data: {
              code: res.code
            },
            method: 'GET',
            dataType: 'json',
            success: cdata => {
              if (cdata.data.errcode) {
                console.log('Login failed: ' + cdata.data.errMsg)
              } else {
                wx.setStorage({
                  key: "openid",
                  data: cdata.data.openid
                })
                this.globalData.openId = cdata.data.openid
                this.getUserId(cdata.data.openid)
              }
            }
          })
        } else {
          console.log('Login failed: ' + res.errMsg)
        }
      }
    })
  },
  getUserId: function (openid) {
    wx.request({
      url: this.globalData.domain + 'user.php',
      data: {
        source: 'getUserId',
        openid: openid
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        wx.setStorage({
          key: "userId",
          data: res.data.uid
        })
        wx.setStorage({
          key: 'unique_key',
          data: res.data.unique_key
        })
        this.globalData.userId = res.data.uid
        this.globalData.unique_key = res.data.unique_key
        if (this.userIdReadyCallback) {
          this.userIdReadyCallback(this.globalData.userId)
        }
        this.getUserInfo(res.data.uid)
      }
    })
  },
  getUserInfo: function (userId) {
    wx.request({
      url: this.globalData.domain + 'user.php',
      data: {
        source: 'getReal',
        uid: userId
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        this.globalData.userInfo = res.data;
        wx.setStorage({
          key: "userInfo",
          data: this.globalData.userInfo
        })
      }
    })
  },

  makeSign: function (str) {
    var encrypted = md5(str);
    return encrypted;
  },

  updateInfo: function (info) {
    this.globalData.userInfo = info
    wx.setStorage({
      key: 'userInfo',
      data: info
    })
  },

  globalData: {
    domain: 'https://buaa.hiyouga.top/',
    userId: null,
    userInfo: null
  }
})