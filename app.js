//app.js
App({
  onLaunch: function () {
    wx.getStorage({
      key: 'openid',
      success: res => {
        //console.log(res.data)
        //this.globalData.openId = res.data
        this.globalData.userId = wx.getStorageSync('userid')
        this.globalData.userInfo = wx.getStorageSync('userinfo')
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
              console.log('Updated')
            }
          }
        })
      },
      fail: res => {
        console.log(res.errMsg)
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
                //this.globalData.openId = cdata.data.openid
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
          key: "userid",
          data: res.data.userid
        })
        this.globalData.userId = res.data.userid
        if (res.data.new_user) {
          this.getUserInfo(res.data.userid)
        }
      }
    })
  },
  getUserInfo: function (userid) {
    wx.getUserInfo({
      lang: 'en',
      timeout: 5000,
      success: res => {
        //console.log(res.userInfo)
        this.globalData.userInfo = res.userInfo
        wx.setStorage({
          key: "userinfo",
          data: res.userInfo
        })
        wx.request({
          url: 'https://buaa.hiyouga.top/user.php',
          data: {
            type: 'updateUserInfo',
            userid: userid,
            nickname: res.userInfo.nickName,
            avatar: res.userInfo.avatarUrl
          },
          method: 'GET',
          dataType: 'json',
          success: res => {
            if (res.data.status != 'success') {
              console.log('Update Userinfo failed!')
            }
          }
        })
      }
    })
  },
  globalData: {
    userId: null,
    userInfo: null
  }
})