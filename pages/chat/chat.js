var utils = require("../../util/util.js")
var Config = require("../../common/js/config.js")
var App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: [],
    input: null,
    hasUserInfo: null
  },
  showModal(e) {
    this.setData({
      modalName: "notice"
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hasUserInfo: App.globalData.hasUserInfo
    })
    if (this.data.hasUserInfo == null) {
      wx.showToast({
        title: '请先授权',
        image: '/common/image/fail.png',
        duration: 2500,
        complete: wx.reLaunch({
          url: '../profile/profile',
        })
      })
    } else {

      wx.setNavigationBarTitle({
        title: '匿名聊天',
      })
      var that = this;
      // wx.getStorage({
      //   key: 'OPENID',
      //   success: function (res) {
      //     that.setData({
      //       openid: res.data
      //     })
      //   },
      // })
      //建立连接
      // var openId = "xxx"
      // var targetOpenId = "yyy"
      App.globalData.wssAddr = Config.wssAddr + "?openId=" + App.globalData.openId + "&targetOpenId=" + App.globalData.targetOpenId
      wx.connectSocket({
        url: App.globalData.wssAddr,
      })
      console.log(App.globalData.wssAddr)
      wx.showLoading({
        title: '聊天建立中',
      })
      //连接成功
      wx.onSocketOpen(function () {
        console.log('连接成功');
        wx.hideLoading()
      })
      wx.onSocketMessage(function (res) {

        var list = [];
        list = that.data.newsList;
        var array = res.data.split("@#$.")
        console.log(res.data)
        if (array[3] != App.globalData.openId) {
          var temp = { 'message': array[0], 'type': array[1], 'date': array[2], 'status': 'recv' };
          list.push(temp);
        }
        // console.log(list)
        that.setData({
          newsList: list
        })
      })
      this.showModal()
    }

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
  send: function () {
    var that = this;
    var date = utils.formatTime(new Date());
    var type = "text"
    if (that.data.input) {
      var temp = { 'message': that.data.input,'type':type, 'date': date, 'status': 'send' };
      var msg = that.data.input + "@#$." + "text" + "@#$." + date + "@#$." + App.globalData.openId
      wx.sendSocketMessage({
        data:msg
      })
      // console.log(that.data.input)
      var list = [];
      list = this.data.newsList;
      list.push(temp);
      this.setData({
        newsList: list,
        input: null
      })
    }
  },
  bindChange: function (res) {
    this.setData({
      input: res.detail.value
    })
  },
  back: function () {
    wx.closeSocket();
    console.log('连接断开');
  }
})