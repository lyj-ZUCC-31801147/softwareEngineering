// index.js
// 获取应用实例
const app = getApp()
let ModuleItem = "Q"
let ModuleScore = "0"
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  getBDX(){
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection("QUESTIONBANK_BDX").get({
      success: res => {
        console.log('数据库获取成功',res)
      } ,fail:res=>{
        console.log('数据库获取失败',res)
      }})
  },
  getSST(){
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection("QUESTIONBANK_SST").get({
      success: res => {
        console.log('数据库获取成功',res)
      } ,fail:res=>{
        console.log('数据库获取失败',res)
      }})
  },
  getSWBT(){
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection("QUESTIONBANK_SWBT").get({
      success: res => {
        console.log('数据库获取成功',res)
        console.log(res.data[0].choice[0])
      } ,fail:res=>{
        console.log('数据库获取失败',res)
      }})
  },
  invokeRegist(){
    this.regist(
      7,
      "EVE",
    )
  },
  regist(age,name){
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection("USER_INFO").where({
      _openid:app.globalData.openid
      //_openid:openID
    }).get({
      success:res=>{
        console.log(res.data.length)
        if(res.data.length=="0"){
          console.log("新用户的处理逻辑")
          db.collection('USER_INFO').add({
            // data 字段表示需新增的 JSON 数据
            data: {name:name,age:age,_openid:openID}
          })
          .then(res => {
            console.log(res)
          })
          .catch(console.error)
          db.collection('RECORD_USER_SCORE').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              _openid:openID
            }
          }).then(res => {console.log(res)}).catch(console.error)
        }else{
          console.log("旧用户的处理逻辑")
          db.collection("RECORD_USER_SCORE").where({
            _openid:app.globalData.openid
            //_openid:openID
          }).get()
          .then(res=>{
            //将用户的旧数据存入全局变量中
            console.log(app.globalData)
            console.log(res)
            console.log("before",app.globalData.p_score)
            app.globalData=res.data[0]
            console.log("after",app.globalData)
          })
          .catch(console.error)
        }
      }
    })
  },
  getModuleName(e){
    console.log(e.detail.value)  
    ModuleItem=e.detail.value 
  },
  getModeuleScore(e){ 
    console.log(e.detail.value)
    ModuleScore=e.detail.value
    
  },
  invokeUpdateScore(){
    this.updateScore(ModuleItem,ModuleScore)
  },
  updateScore(aModule,aScore){
    console.log(aModule,aScore)
    console.log("updateScore invoked")
    wx.cloud.init()
    const db = wx.cloud.database()
    if(aModule=="P"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{p_score:aScore}}).then(res=>{ console.log('更新P成功',res)}).catch(console.error)
    }else if(aModule=="A"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{a_score:aScore}}).then(res=>{ console.log('更新A成功',res)}).catch(console.error)
    }else if(aModule=="S1"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{s1_score:aScore}}).then(res=>{ console.log('更新S1成功',res)}).catch(console.error)
    }else if(aModule=="S2"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{s2_score:aScore}}).then(res=>{ console.log('更新S2成功',res)}).catch(console.error)
    }
  },
  updatePScore(){
    wx.cloud.init()
    const db = wx.cloud.database()
    console.log(app.globalData.openid)
    let openid=null
    // console.log(app.getglobalData.userInfo._openid)
    db.collection("RECORD_USER_SCORE").where({
      _openid:app.globalData.openid
    }).update({data:{p_score:P_score}})
    // get({
    //   success:res=>{
    //     console.log(res)
    // },fail:res=>{
    //     console.log(res)
    // }})
  },
  invokeGetAnalysis(){
    this.getAnalysis(
      app.globalData.p_score,
      app.globalData.a_score,
      app.globalData.s1_score,
      app.globalData.s2_score
    )
  }
  ,
  getAnalysis(P_score,A_score,S1_score,S2_score){
    console.log("getAnalysis invoked")
    wx.cloud.init()
    const db = wx.cloud.database()
    const _ = db.command
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
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.onGetOpenid()
  },
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        console.log(app.globalData.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
