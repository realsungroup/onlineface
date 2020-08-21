// index.js
// const app = getApp()
const app = getApp();

Page({
  data: {
    template: "1v1",
    headerHeight: app.globalData.headerHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    name: "",
    userSig: "", //用户签名
    userID: "",
    records: [],
    loaded: false
    // entryInfos: [
    //   {
    //     icon: "../../images/call.png",
    //     title: "语音聊天室",
    //     desc: "<trtc-room>",
    //     navigateTo: "../voice-room/join-room/joinRoom"
    //   },
    //   {
    //     icon: "../../images/doubleroom.png",
    //     title: "双人通话",
    //     desc: "<trtc-room>",
    //     navigateTo: "../videocall/videocall"
    //   },
    //   {
    //     icon: "../../images/multiroom.png",
    //     title: "多人会议",
    //     desc: "<trtc-room>",
    //     navigateTo: "../meeting/meeting"
    //   }
    // ]
  },

  onLoad: function() {
    wx.getStorage({
      key: "userinfo",
      success: result => {
        const userInfo = result.data;
        const userCode = userInfo.UserCode;
        const name = userInfo.Data;
        this.setData({ userID: userCode, name: name });
        wx.showLoading({
          title: "请稍候...",
          mask: true
        });
        this.getUserSig(userInfo, this.getRecords);
      },
      fail: () => {
        wx.navigateTo({
          url: "../login/login",
          success: result => {},
          fail: () => {},
          complete: () => {}
        });
      }
    });
  },

  selectTemplate: function(event) {
    console.log("index selectTemplate", event);
    this.setData({
      template: event.detail.value
    });
  },
  handleEntry: function(e) {
    let url = this.data.entryInfos[e.currentTarget.id].navigateTo;
    wx.navigateTo({
      url: url
    });
  },
  getUserSig: function(userInfo, callback) {
    const token = userInfo.AccessToken;
    const userCode = userInfo.UserCode;
    wx.request({
      url: "https://finisarinterview.realsun.me/api/Tencent/GenSig",
      method: "GET",
      data: {
        usercode: userCode
      },
      header: {
        accessToken: token,
        userCode: userCode
      },
      success: result => {
        if (result.data.error === 0) {
          this.setData({ userSig: result.data.data });
          callback(userInfo);
        } else {
          wx.showToast({
            title: result.data.message,
            icon: "none",
            duration: 1500,
            mask: false
          });
        }
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: error.message,
          icon: "none",
          duration: 1500,
          mask: false
        });
      },
      complete: () => {}
    });
  },
  getRecords: function(userInfo) {
    const token = userInfo.AccessToken;
    const userCode = userInfo.UserCode;
    wx.request({
      url: "https://finisarinterview.realsun.me/api/100/table/Retrieve",
      data: { resid: "617650062980" },
      method: "GET",
      header: {
        accessToken: token,
        userCode: userCode
      },
      success: result => {
        if (result.data.error === 0) {
          wx.hideLoading();
          this.setData({ records: result.data.data, loaded: true });
        } else {
          console.error(error);
          wx.showToast({
            title: result.data.message,
            icon: "none",
            duration: 1500,
            mask: false
          });
        }
      },
      fail: error => {
        console.log(error);
        wx.showToast({
          title: error.message,
          icon: "none",
          duration: 1500,
          mask: false
        });
      },
      complete: () => {}
    });
  },
  enterTestRoom: function(e) {
    const roomID = 88888;
    const { userSig, userID } = this.data;
    if (userSig) {
      const url = `../room/room?roomID=${roomID}&template=${this.data.template}&debugMode=false&cloudenv=PRO&userID=${userID}&userSig=${userSig}`;
      wx.navigateTo({
        url: url
      });
    } else {
      wx.showToast({
        title: "无签名",
        icon: "none",
        duration: 1500,
        mask: false
      });
    }
  },
  enterRoom: function(e) {
    const record = this.data.records[e.currentTarget.id];
    // const roomID = Number(record.batchId.substring(0, 8));
    const roomID = Number(
      record.batchId.substring(record.batchId.length - 8, record.batchId.length)
    );
    console.log(roomID);
    const { userSig, userID } = this.data;
    if (userSig) {
      const url = `../room/room?roomID=${roomID}&template=${this.data.template}&debugMode=false&cloudenv=PRO&userID=${userID}&userSig=${userSig}`;
      wx.navigateTo({
        url: url
      });
    } else {
      wx.showToast({
        title: "无签名",
        icon: "none",
        duration: 1500,
        mask: false
      });
    }
  },
  logout: function() {
    wx.clearStorage();
    wx.navigateTo({
      url: "../login/login"
    });
  }
});
