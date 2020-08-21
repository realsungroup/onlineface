// index.js
// const app = getApp()
const app = getApp();
Page({
  data: {
    countdowning: false,
    countdownNumber: 60,
    phone: "",
    yzm: ""
  },

  onLoad: function() {},
  selectTemplate: function(event) {
    console.log("index selectTemplate", event);
    this.setData({
      template: event.detail.value
    });
  },

  countdownClick: function() {
    this.setData({
      countdowning: true
    });
    this.timerId = setInterval(() => {
      if (this.data.countdownNumber === 0) {
        clearInterval(this.timerId);
        // 倒计时结束
        this.setData({ countdowning: false, countdownNumber: 60 });
      } else {
        this.setData({ countdownNumber: --this.data.countdownNumber });
      }
    }, 1000);
  },

  handleGetVerifyCode: function() {
    const phoneNumber = this.data.phone;

    if (!phoneNumber) {
      return wx.showToast({
        title: "请输入手机号",
        icon: "none",
        duration: 1500,
        mask: false
      });
    }
    if (phoneNumber.length < 11) {
      return wx.showToast({
        title: "手机号码为11位",
        icon: "none",
        duration: 1500,
        mask: false
      });
    }
    wx.request({
      url: "https://finisarinterview.realsun.me/api/SMS/SMS_SendValidCode",
      data: {
        telephone: phoneNumber
      },
      method: "GET",
      success: result => {
        if (result.data.error === 0) {
          wx.showToast({
            title: "验证码已发送",
            icon: "none",
            image: "",
            duration: 1500,
            mask: false
          });
          this.countdownClick();
        }
      },
      fail: () => {},
      complete: () => {}
    });
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  yzmInput: function(e) {
    this.setData({
      yzm: e.detail.value
    });
  },
  formSubmit: function() {
    const { phone, yzm } = this.data;
    if (!phone) {
      return wx.showToast({
        title: "请输入手机号",
        icon: "none",
        image: "",
        duration: 1500,
        mask: false
      });
    }
    if (phone.length < 11) {
      return wx.showToast({
        title: "手机号码为11位",
        icon: "none",
        image: "",
        duration: 1500,
        mask: false
      });
    }
    if (yzm.length < 4) {
      return wx.showToast({
        title: "验证码为4位数字",
        icon: "none",
        image: "",
        duration: 1500,
        mask: false
      });
    }
    wx.showLoading({
      title: "登录中",
      mask: true
    });
    wx.request({
      url: "https://finisarinterview.realsun.me/api/Account/Login",
      data: {
        mobileno: phone, // 手机号
        validCode: yzm, // 验证码
        loginMethod: "mobile"
      },
      method: "POST",
      success: function(res) {
        if (res.data.OpResult === "Y") {
          wx.setStorage({
            key: "userinfo",
            data: res.data
          });

          wx.navigateTo({
            url: "../index/index"
          });
          wx.showToast({
            title: "登录成功",
            icon: "none",
            image: "",
            duration: 1000,
            mask: false
          });
        } else {
          wx.showToast({
            title: res.data.ErrorMsg,
            icon: "none",
            image: "",
            duration: 1500,
            mask: false
          });
        }
      },
      fail: function(error) {
        console.log(error);
      }
    });
  }
});
