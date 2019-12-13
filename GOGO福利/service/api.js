import {
  baseUrl,
  _get,
  _post,
  _put,
  _delete
} from './https.js'

let channel = 'wx';
// 定义接口地址
let url = {
  userLoginUrl: "/getWxInfo",
  getuserinfoUrl: "/getUserInfo",
  getPrizeListUrl: "/getPrizeList",
  getRollUrl: "/roll",
  goldMultipleUrl: "/goldMultiple",
  getLotteryListUrl: "/getLotteryList",
  getRealPrizeListUrl: "/getRealPrizeList",
  exchangeUrl: "/exchange",
  playVideoUrl: "/playVideo",
  getRegulationsUrl: "/getRegulations",
  logoutUrl: "/logout"
}

module.exports = {
  // 用户登陆
  reqUserLogin(param) {
    return _get(url.userLoginUrl + "?jsCode=" + param.code, {
      "Content-Type": "application/json"
    }, param)
  },
  // 获取用户信息
  reqGetUserInfo(param) {
    let openid = wx.getStorageSync('openid');
    let sessionKey = wx.getStorageSync('session_key');
    let commonParams = "?muid=" + openid + "&channel=" + channel + "&sessionKey=" + sessionKey;
    console.log(commonParams)
    return _get(url.getuserinfoUrl + commonParams, {
      "Content-Type": "application/json"
    }, param)
  },
  // 获取转盘展示奖品信息
  reqGetPrizeList(param) {
    return _get(url.getPrizeListUrl + "?channel=" + channel, {
      "Content-Type": "application/json"
    }, param)
  },
  // 获取抽奖结果
  reqGetRoll(param) {
    let openid = wx.getStorageSync('openid');
    let sessionKey = wx.getStorageSync('session_key');
    let commonParams = "?muid=" + openid + "&channel=" + channel + "&sessionKey=" + sessionKey;
    return _get(url.getRollUrl + commonParams, {
      "Content-Type": "application/json"
    }, param)
  },
  // 金币翻倍(看完激励视频)
  reqGoldMultiple(param) {
    let openid = wx.getStorageSync('openid');
    let sessionKey = wx.getStorageSync('session_key');
    let commonParams = "?muid=" + openid + "&channel=" + channel + "&sessionKey=" + sessionKey;
    return _get(url.goldMultipleUrl + commonParams, {
      "Content-Type": "application/json"
    }, param)
  },
  // 抽奖纪录(最近10次)
  reqGetLotteryList(param) {
    let openid = wx.getStorageSync('openid');
    let sessionKey = wx.getStorageSync('session_key');
    let commonParams = "?muid=" + openid + "&channel=" + channel + "&sessionKey=" + sessionKey;
    return _get(url.getLotteryListUrl + commonParams, {
      "Content-Type": "application/json"
    }, param)
  },
  // 可兑换奖品列表
  reqGetRealPrizeList(param) {
    let openid = wx.getStorageSync('openid');
    let sessionKey = wx.getStorageSync('session_key');
    let commonParams = "?muid=" + openid + "&channel=" + channel + "&sessionKey=" + sessionKey;
    return _get(url.getRealPrizeListUrl + commonParams, {
      "Content-Type": "application/json"
    }, param)
  },
  // 兑换奖品
  reqExchange(param) {
    let openid = wx.getStorageSync('openid');
    let sessionKey = wx.getStorageSync('session_key');
    let commonParams = "?muid=" + openid + "&channel=" + channel + "&sessionKey=" + sessionKey;
    let params = "&type=" + param.type + "&objectId=" + param.objectId + "&phoneNumber=" + param.phoneNumber + "&name=" + param.name + "&address=" + param.address;
    return _get(url.exchangeUrl + commonParams + params, {
      "Content-Type": "application/json"
    }, param)
  },
  // 看视频增加抽奖次数
  reqPlayVideo(param) {
    let openid = wx.getStorageSync('openid');
    let sessionKey = wx.getStorageSync('session_key');
    let commonParams = "?muid=" + openid + "&channel=" + channel + "&sessionKey=" + sessionKey;
    return _get(url.playVideoUrl + commonParams, {
      "Content-Type": "application/json"
    }, param)
  },
  // 看视频增加抽奖次数
  reqGetRegulations(param) {
    return _get(url.getRegulationsUrl, {
      "Content-Type": "application/json"
    }, param)
  },
  reqLogout(param) {
    let openid = wx.getStorageSync('openid');
    let sessionKey = wx.getStorageSync('session_key');
    let commonParams = "?muid=" + openid + "&channel=" + channel + "&sessionKey=" + sessionKey;
    return _get(url.logoutUrl + commonParams, {
      "Content-Type": "application/json"
    }, param)
  }
}