// pages/list/list.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pagedate: '',
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    wx.request({
      url: 'https://buaa.hiyouga.top/list.php?date=' + options.date,
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        res.data.forEach(function(value, key, arr) {
          var end_date = new Date(Date.parse('2000-01-01 ' + value.start_at) + Date.parse('2000-01-01 ' + value.duration) - Date.parse('2000-01-01 00:00:00'))
          value.end_at = end_date.toTimeString().substring(0, 8)
          //console.log(value)
        })
        _this.setData({
          pagedate: options.date,
          orders: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  confirm: function (e) {
    var _this = this
    var sid = e.currentTarget.dataset.idx
    wx.request({
      url: 'https://buaa.hiyouga.top/list.php?sid=' + sid,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        //console.log(res)
        var text = '您确认要预约' + res.data.name + '在' + res.data.date + ' ' + res.data.start_at + '于' + res.data.location + '开办的活动吗？'
        wx.showModal({
          title: '提示',
          content: text,
          success: function (status) {
            if (status.confirm) {
              //console.log('用户点击确认')
              //_this.order(sid)
            } else if (status.cancel) {
              //console.log('用户点击取消')
            }
          }
        })
      }
    })
  },

  order: function (sid) {
    //
  }
})