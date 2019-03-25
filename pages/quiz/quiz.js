// pages/quiz/quiz.js
var App = getApp()
var Config = require("../../common/js/config.js")
var Question = require("../../common/js/question.js")
var Result = require("../../common/js/result.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: Question.Question

  },
  showModal: function (e) {
    this.setData({
      modalName: "result"
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  startchat(e) {
    wx.showToast({
      title: '匹配中',
      image: '../../common/image/smile.png',
      duration: 3000,
      complete: wx.reLaunch({
        url: '../chat/chat',
      })
    })
  },
  formSubmit: function (e) {
    var result = e.detail.value
    var answer = ""
    var ok = true
    for(var i in result) {
      if (result[i]=="") {
        wx.showToast({
          title: '请完成全部测试',
          image: '../../common/image/fail.png',
          duration: 1500,
          mask: true
        })
        ok = false
      }
      answer += result[i]
    }
    // console.log(App.globalData.loginInfo.openId)
    if (ok) {
      wx.showLoading({
        title: '提交中',
        duration: 1500
      })
      var that = this
      wx.request({
        url: Config.requestAddr + '/quiz',
        data: {
          openId: App.globalData.openId,
          answer: answer
        },
        success(res) {
          console.log(res)
          var response = res.data
          if (response.status == "registerOk") {
            App.globalData.targetOpenId = response.targetOpenId
            // wx.reLaunch({
            //   url: '../chat/chat',
            // })
            wx.hideLoading()
            that.showModal()
          } else if (response.status == "unique") {
            wx.showToast({
              title: '当前用户过少无法匹配',
              url: '/common/image/sad.png'
            })
          } else {
            wx.showToast({
              title: '无法连接服务器',
              image: '../../common/image/fail.png'
            })
          }
        },
        // complete: wx.hideLoading()
      })
    }
    // console.log(e.detail.value["question2"])
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var slogan
    if (App.globalData.openId==null) {
      slogan = '欢迎加入'
    } else {
      slogan = '重新测试'
    }
    wx.showToast({
      title: slogan,
      image: '/common/image/emoji.png'
    })
    this.setData({
      result: Result.Result[Math.round(Math.random()*15)]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data.question[0])
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