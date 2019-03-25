// pages/judge/judge.js\
var App = getApp()
var Config = require("../../common/js/config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: null
  },
  login: function() {
    wx.showLoading({
      title: '正在登录',
    })
    wx.login({
      success: res => {
        var that = App
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        console.log(Config.requestAddr)
        wx.hideLoading()
        wx.request({
          url: Config.requestAddr + "/login",
          data: {
            code: res.code
          },
          success: (res) => {
            that.globalData.openId = res.data.openId
            if (res.data.status == "newUser") {
              wx.reLaunch({
                url: '../quiz/quiz',
              })
            } else if (res.data.status == "oldUser") {
              that.globalData.targetOpenId = res.data.targetOpenId
              that.globalData.wssAddr = Config.wssAddr + "?openId=" + that.globalData.openId + "&targetOpenId=" + that.globalData.targetOpenId
              wx.showToast({
                title: '欢迎回来',
                image: '../../common/image/smile.png',
                duration: 4000,
                success: wx.reLaunch({
                  url: '../chat/chat',
                })
              })

            } else {
              console.log(res)
              wx.showToast({
                title: '无法连接服务器',
                image: '../../common/image/fail.png',
                duration: 200000
              })
            }
          },
          fail: (res) => {
            wx.showToast({
              title: '无法连接服务器',
              image: '../../common/image/fail.png',
              duration: 200000
            })
          }
        })
      }
    })


    // debug

    // wx.reLaunch({
    //   url: '../quiz/quiz',
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'ZenSoul'
    })
    this.login()
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

  }
})