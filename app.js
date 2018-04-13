//app.js
import md5 from 'utils/md5.js'
App({
  onLaunch: function () {
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
          url: 'https://buaa.hiyouga.top/user.php',
          data: {
            type: 'updateTime',
            userid: this.globalData.userId, 
          },
          method: 'GET',
          dataType: 'json',
          success: cdata => {
            if (cdata.data.status != 'success') {
              console.log('Update Time failed!')
            } else {
              console.log('Time Updated')
            }
          }
        })
      },
      fail: res => {
        //console.log(res.errMsg)
        this.doLogin()
      }
    })
  },
  doLogin: function () {
    wx.login({
      success: res => {
        if (res.code) {
          //console.log('doLogin: ' + res.code)
          wx.request({
            url: 'https://buaa.hiyouga.top/login.php',
            data: {
              code: res.code
            },
            method: 'GET',
            dataType: 'json',
            success: cdata => {
              if (cdata.data.errcode) {
                console.log('Login failed: ' + cdata.data.errmsg)
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
      url: 'https://buaa.hiyouga.top/user.php',
      data: {
        type: 'getUserId',
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
  getUserInfo: function (userid) {
    wx.getUserInfo({
      lang: 'en',
      timeout: 5000,
      success: res => {
        this.globalData.userInfo = res.userInfo
        wx.request({
          url: 'https://buaa.hiyouga.top/user.php',
          data: {
            type: 'getReal',
            userid: userid
          },
          method: 'GET',
          dataType: 'json',
          success: res => {
            if (res.data.is_realname != '0') {
              this.globalData.userInfo = Object.assign(this.globalData.userInfo, res.data);
            }
            wx.setStorage({
              key: "userInfo",
              data: this.globalData.userInfo
            })
          }
        })
      }
    })
  },
  makeSign: function (str) {
    var encrypted = md5(str);
    return encrypted;
  },
  globalData: {
    userId: null,
    userInfo: null
  }
})