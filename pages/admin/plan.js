// pages/admin/plan.js

const app = getApp()

Page({

  data: {
    userInfo: {},
    date: "----",
    start_time: "12:00",
    end_time: "12:00",
    types: ["导员有约", "院长下午茶", "导师预约"],
    typeIndex: 0
  },

  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindStartTimeChange: function (e) {
    this.setData({
      start_time: e.detail.value
    })
  },

  bindEndTimeChange: function (e) {
    this.setData({
      end_time: e.detail.value
    })
  },

  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  }
})