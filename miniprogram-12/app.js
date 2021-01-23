// app.js
App({
  globalData: {
    userInfo: null,
    openid:"",
    // finalscore:[0,0],
    // temptime:0,
    // Presult:[0,0],
    // Pfinalscore:'',
    // age:1,
    // s1Game1:0,
    // s1Game2:0,
    // s1Game1Count:1,
    // s1Game2Count:1,
    // s1score:0,
    // score:0
  },
  getAnalysis(P_score,A_score,S1_score,S2_score){
    console.log("getAnalysis invoked")
    wx.cloud.init()
    const db = wx.cloud.database()
    const _ = db.command
    console.log(P_score)
    console.log(A_score)
    console.log(S1_score)
    db.collection("ANALYSIS").where(_.or([
      {module_item:"P",module_score:P_score},
      {module_item:"A",module_score:A_score},
      {module_item:"S1",module_score:S1_score},
      {module_item:"S2",module_score:S2_score}])).get({
        success:res=>{
          console.log('get analysis success',res)
        }
        }
      )
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'ruangong8-7g9zocgh6c6192c5',
        traceUser: true,
      })
    }
    wx.cloud.init()
    const db = wx.cloud.database()

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
})
