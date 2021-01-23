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
    db.collection("bdx").get({
      success: res => {
        console.log('数据库获取成功',res)
      } ,fail:res=>{
        console.log('数据库获取失败',res)
      }})
  },
  invokeGetBDX(){
    this.getBDX("1")
  },
  getBDX(aDiffculty){
    console.log(aDiffculty)
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection("bdx").where({bdx_degree_difficulty:aDiffculty}).get({
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
  invokeGetSWBT(){
    this.getSWBT("1")
  },
  getSWBT(aDiffculty){
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection("QUESTIONBANK_SWBT").where({
      swbt_degree_difficulty:aDiffculty
    }).get({
      success: res => {
        console.log('数据库获取成功',res)
        console.log(res.data[0].choice[0])
      } ,fail:res=>{
        console.log('数据库获取失败',res)
      }})
  },
  invokeRegist(){
    this.regist(22,"ZYO")
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
            data: {name:name,age:age}
          })
          .then(res => {
            console.log(res)
          })
          .catch(console.error)
          db.collection('RECORD_USER_SCORE').add({
            // data 字段表示需新增的 JSON 数据
            data: {
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
    this.updateScore(ModuleItem,parseInt(ModuleScore))
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
    }else if(aModule=="SST"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{sst_score:aScore}}).then(res=>{ console.log('更新三视图成功',res)}).catch(console.error)
    }else if(aModule=="BDX"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{bdx_score:aScore}}).then(res=>{ console.log('更新比大小成功',res)}).catch(console.error)
    }else if(aModule=="SWBT"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{swbt_score:aScore}}).then(res=>{ console.log('更新识文辨图成功',res)}).catch(console.error)
    }else if(aModule=="WKSZ"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{wksz_score:aScore}}).then(res=>{ console.log('更新挖空数字成功',res)}).catch(console.error)
    }else if(aModule=="ZMPD"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{zmpd_score:aScore}}).then(res=>{ console.log('更新字母配对成功',res)}).catch(console.error)
    }else if(aModule=="SZPP"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{szpp_score:aScore}}).then(res=>{ console.log('更新数字匹配成功',res)}).catch(console.error)
    }
  },
  invokeCaluScore(){
    this.caluScore()
  },
  caluScore(){
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection("RECORD_USER_SCORE").where({
      _openid:app.globalData.openid
    }).get()
    .then(res=>{
      //caluPScore SZPP
      const BDX=res.data[0].bdx_score
      const SST=res.data[0].sst_score
      const SWBT=res.data[0].swbt_score
      const SZPP=res.data[0].szpp_score
      const WKSZ=res.data[0].wksz_score
      const ZMPD=res.data[0].zmpd_score
      const PScore=parseInt(SZPP/6)
      const AScore=parseInt((BDX+ZMPD)/12)
      const S1Score=parseInt((SST+SWBT)/12)
      const S2Score=parseInt(WKSZ/6)
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({
        data:{
          p_score:PScore,
          a_score:AScore,
          s1_score:S1Score,
          s2_score:S2Score
        }
      })
      console.log(PScore)
      console.log(AScore)
      console.log(S1Score)
      console.log(S2Score)
    })
    .catch(console.error)

    
    //caluAScore
    //caluS1Score
    //caluS2Score
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
    wx.cloud.init()
    const db = wx.cloud.database()
    const _ = db.command
    db.collection("RECORD_USER_SCORE").where({
      _openid:app.globalData.openid
      //_openid:openID
    }).get()
    .then(res=>{
      app.getAnalysis(
        parseInt(res.data[0].p_score),
        parseInt(res.data[0].a_score),
        parseInt(res.data[0].s1_score),
        parseInt(res.data[0].s2_score))
      console.log(res)
     },
      
    
    )
    .catch(console.log)
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
