/*
* @url: https://raw.githubusercontent.com/BlueSkyClouds/Script/master/nodejs/iQIYI-bak.js
* @author: BlueSkyClouds
登录网页获取cookie，将cookie全部字段写入cookie
28 8 * * * ck_iqiyi.js
*/
const utils = require('./utils');
const Env = utils.Env;
const getData = utils.getData;
const $ = new Env('爱奇艺');
const notify = $.isNode() ? require('./notify') : '';
const AsVow = getData().IQIYI;

var cookie = '';

let P00001 = ''; //无需填写 自动取cookie内容拆分
let P00003 = ''; //无需填写 自动取cookie内容拆分
let dfp = '';    //无需填写 自动取cookie内容拆分


const timestamp = new Date().getTime()
var LogDetails = false; // 响应日志
var tasks = ["8a2186bb5f7bedd4", "b6e688905d4e7184", "acf8adbb5870eb29", "843376c6b3e2bf00", "8ba31f70013989a8", "CHANGE_SKIN"]; //浏览任务号

var out = 10000; // 超时 (毫秒) 如填写, 则不少于3000

var $nobyda = nobyda();
var desp = '';
var info = '';

iqiyi();

async function iqiyi() {
  if (AsVow) {
    for (i in AsVow) {
        cookie = AsVow[i].cookie;
        if(cookie.includes("__dfp") && cookie.includes("P00001") && cookie.includes("P00003")){
        dfp = cookie.match(/__dfp=(.*?)@/)[1];
        P00001 = cookie.match(/P00001=(.*?);/)[1];
        P00003 = cookie.match(/P00003=(.*?);/)[1];
        }
        if (P00001 !== "" && P00003 !== "" && dfp !== "") {
          await login();
          await Checkin();
          await WebCheckin();
          await Lottery(500);
          for (let i = 0; i < tasks.length; i++){
            await joinTask(tasks[i]);
            await notifyTask(tasks[i]);
            await new Promise(r => setTimeout(r, 5000));
            await getTaskRewards(tasks[i]);
          }
          await $nobyda.time();
          desp += info;
          info = '';
        } else {
          info += '签到终止, 由于爱奇艺更新了新的签到获取Cookie方式有所变更详情查看https://github.com/MayoBlueSky/My-Actions/blob/master/Secrets.md';
          $nobyda.notice("爱奇艺会员", "", info);
          //$nobyda.notice("爱奇艺会员", "", "签到终止, 未获取Cookie");
        }
        info += desp;
        notify.sendNotify('爱奇艺', info);
    }
  }else {
    info += '签到失败：请先获取Cookie⚠️';
    $nobyda.notice("爱奇艺会员", "", info);
    notify.sendNotify('爱奇艺', info);
  }
}

function login() {
  return new Promise(resolve => {
    var URL = {
      url: 'https://serv.vip.iqiyi.com/vipgrowth/query.action?P00001=' + P00001,
    }
    $nobyda.get(URL, function(error, response, data) {
      const obj = JSON.parse(data)
      const Details = LogDetails ? data ? `response:\n${data}` : '' : ''
      if (!error && obj.code === "A00000" ) {
        const level = obj.data.level  // VIP等级
        const growthvalue = obj.data.growthvalue  // 当前 VIP 成长值
        const distance = obj.data.distance  // 升级需要成长值
        let deadline = obj.data.deadline  // VIP 到期时间
        const today_growth_value = obj.data.todayGrowthValue
        if(deadline === undefined){deadline = "非 VIP 用户"}
        $nobyda.expire = ("\nVIP 等级: " + level + "\n当前成长值: " + growthvalue + "\n升级需成长值: " + distance + "\n今日成长值: " + today_growth_value + "\nVIP 到期时间: " + deadline)
        //P00003 = data.match(/img7.iqiyipic.com\/passport\/.+?passport_(.*?)_/)[1]   //通过头像链接获取userid P00003
        info += `爱奇艺-查询成功: ${$nobyda.expire} ${Details}\n`;
        console.log(info);
      } else {
        info += `爱奇艺-查询失败${error || ': 无到期数据 ⚠️'} ${Details}\n`;
        console.log(info);
      }
      resolve()
    })
    if (out) setTimeout(resolve, out)
  })
}

function Checkin() {
  const stringRandom = (length) => {
      var rdm62, ret = '';
      while (length--) {
          rdm62 = 0 | Math.random() * 62;
          ret += String.fromCharCode(rdm62 + (rdm62 < 10 ? 48 : rdm62 < 36 ? 55 : 61))
      }
      return ret;
  };
  return new Promise(resolve => {
    const sign_date = {
      agentType: "1",
      agentversion: "1.0",
      appKey: "basic_pcw",
      authCookie: P00001,
      qyid: md5(stringRandom(16)),
      task_code: "natural_month_sign",
      timestamp: timestamp,
      typeCode: "point",
      userId: P00003,
    };
    const post_date = {
	  "natural_month_sign": {
		"agentType": "1",
		"agentversion": "1",
		"authCookie": P00001,
		"qyid": md5(stringRandom(16)),
		"taskCode": "iQIYI_mofhr",
		"verticalCode": "iQIYI"
      }
    };
    const sign = k("UKobMjDMsDoScuWOfp6F", sign_date, {
      split: "|",
      sort: !0,
      splitSecretKey: !0
    });
    var URL = {
      url: 'https://community.iqiyi.com/openApi/task/execute?' + w(sign_date) + "&sign=" + sign,
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(post_date)
    }
    $nobyda.post(URL, function(error, response, data) {
      if (error) {
        $nobyda.data = "签到失败: 接口请求出错 ‼️";
        info += "签到失败: 接口请求出错 ‼️";
        console.log(info);
      } else {
        if(!isJSON_test(data)){
          return false;
        }
        const obj = JSON.parse(data)
        const Details = LogDetails ? `response:\n${data}` : ''
        if (obj.code === "A00000") {
          if (obj.data.code === "A0000") {
            var quantity = obj.data.data.rewards[0].rewardCount;
            var continued = obj.data.data.signDays;
            $nobyda.data = "签到成功: 获得积分" + quantity + ", 累计签到" + continued + "天 🎉";
            info += "签到成功: 获得积分" + quantity + ", 累计签到" + continued + "天 🎉\n";
            console.log(`爱奇艺-${$nobyda.data} ${Details}`)
          } else {
            $nobyda.data = "签到失败: " + obj.data.msg + " ⚠️";
            info += "签到失败: " + obj.data.msg + " ⚠️\n";
            console.log(`爱奇艺-${$nobyda.data} ${Details}`)
          }
        } else {
          $nobyda.data = "签到失败: Cookie无效 ⚠️";
          info += "签到失败: Cookie无效 ⚠️\n";
          console.log(`爱奇艺-${$nobyda.data} ${Details}`)
        }
      }
      resolve()
    })
    if (out) setTimeout(resolve, out)
  })
}

function WebCheckin() {
  return new Promise(resolve => {
    const web_sign_date = {
      agenttype: "1",
      agentversion: "0",
      appKey: "basic_pca",
      appver: "0",
      authCookie: P00001,
      channelCode: "sign_pcw",
      dfp: dfp,
      scoreType: "1",
      srcplatform: "1",
      typeCode: "point",
      userId: P00003,
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
      verticalCode: "iQIYI"
    };

    const sign = k("DO58SzN6ip9nbJ4QkM8H", web_sign_date, {
      split: "|",
      sort: !0,
      splitSecretKey: !0
    });
    var URL = {
      url: 'https://community.iqiyi.com/openApi/score/add?' + w(web_sign_date) + "&sign=" + sign
    }
    $nobyda.get(URL, function(error, response, data) {
      if (error) {
        $nobyda.data = "网页端签到失败: 接口请求出错 ‼️";
        info += "网页端签到失败: 接口请求出错 ‼️\n";
        console.log(`爱奇艺-${$nobyda.data} ${error}`)
      } else {
        if(!isJSON_test(data)){
          return false;
        }
        const obj = JSON.parse(data)
        const Details = LogDetails ? `response:\n${data}` : ''
        if (obj.code === "A00000") {
          if (obj.data[0].code === "A0000") {
            var quantity = obj.data[0].score;
            var continued = obj.data[0].continuousValue;
            $nobyda.data = "网页端签到成功: 获得积分" + quantity + ", 累计签到" + continued + "天 🎉";
            info += "网页端签到成功: 获得积分" + quantity + ", 累计签到" + continued + "天 🎉\n";
            console.log(`爱奇艺-${$nobyda.data} ${Details}`)
          } else {
            $nobyda.data = "网页端签到失败: " + obj.data[0].message + " ⚠️";
            info += "网页端签到失败: " + obj.data[0].message + " ⚠️\n";
            console.log(`爱奇艺-${$nobyda.data} ${Details}`)
          }
        } else {
          $nobyda.data = "网页端签到失败: Cookie无效 ⚠️";
          info += "网页端签到失败: Cookie无效 ⚠️\n";
          console.log(`爱奇艺-${$nobyda.data} ${Details}`)
        }
      }
      resolve()
    })
    if (out) setTimeout(resolve, out)
  })
}

function Lottery(s) {
  return new Promise(resolve => {
    $nobyda.times++
      const URL = {
        url: 'https://iface2.iqiyi.com/aggregate/3.0/lottery_activity?app_k=0&app_v=0&platform_id=0&dev_os=0&dev_ua=0&net_sts=0&qyid=0&psp_uid=0&psp_cki=' + P00001 + '&psp_status=0&secure_p=0&secure_v=0&req_sn=0'
      }
    setTimeout(() => {
      $nobyda.get(URL, async function(error, response, data) {
        if (error) {
          $nobyda.data += "\n抽奖失败: 接口请求出错 ‼️"
          info += "抽奖失败: 接口请求出错 ‼️\n";
          console.log(`爱奇艺-抽奖失败: 接口请求出错 ‼️ ${error} (${$nobyda.times})`)
          //$nobyda.notice("爱奇艺", "", $nobyda.data)
        } else {
          const obj = JSON.parse(data);
          const Details = LogDetails ? `response:\n${data}` : ''
          $nobyda.last = !!data.match(/(机会|已经)用完/)
          if (obj.awardName && obj.code === 0) {
            $nobyda.data += !$nobyda.last ? `\n抽奖成功: ${obj.awardName.replace(/《.+》/, "未中奖")} 🎉` : `\n抽奖失败: 今日已抽奖 ⚠️`
            info += `爱奇艺-抽奖明细: ${obj.awardName.replace(/《.+》/, "未中奖")} 🎉 (${$nobyda.times}) ${Details}\n`;
            console.log(`爱奇艺-抽奖明细: ${obj.awardName.replace(/《.+》/, "未中奖")} 🎉 (${$nobyda.times}) ${Details}`)
          } else if (data.match(/\"errorReason\"/)) {
            const msg = data.match(/msg=.+?\)/) ? data.match(/msg=(.+?)\)/)[1].replace(/用户(未登录|不存在)/, "Cookie无效") : ""
            $nobyda.data += `\n抽奖失败: ${msg || `未知错误 Cookie疑似失效`} ⚠️`
            info += `爱奇艺-抽奖失败: ${msg || `未知错误 Cookie疑似失效`} ⚠️ (${$nobyda.times}) ${msg ? Details : `response:\n${data}`}\n`;
            console.log(`爱奇艺-抽奖失败: ${msg || `未知错误 Cookie疑似失效`} ⚠️ (${$nobyda.times}) ${msg ? Details : `response:\n${data}`}`)
            console.log(data)
            s = s + 500;
            if(s <= 4500){
              await Lottery(s)
            }
          } else {
            $nobyda.data += "\n抽奖错误: 已输出日志 ⚠️";
            info += "抽奖错误: 已输出日志 ⚠️\n";
            console.log(`爱奇艺-抽奖失败: \n${data} (${$nobyda.times})`)
          }
        }
        if (!$nobyda.last && $nobyda.times < 3) {
          await Lottery(s)
        } else {
          const expires = $nobyda.expire ? $nobyda.expire.replace(/\u5230\u671f/, "") : "获取失败 ⚠️"
        }
        resolve()
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  })
}

function joinTask(task) {
  return new Promise(resolve => {
    $nobyda.get('https://tc.vip.iqiyi.com/taskCenter/task/joinTask?taskCode=' + task + '&lang=zh_CN&platform=0000000000000000&P00001=' + P00001, function (error, response, data) {resolve()})
    if (out) setTimeout(resolve, out)
  })
}

function notifyTask(task) {
  return new Promise(resolve => {
    $nobyda.get('https://tc.vip.iqiyi.com/taskCenter/task/notify?taskCode=' + task + '&lang=zh_CN&platform=0000000000000000&P00001=' + P00001, function (error, response, data) {resolve()})
    if (out) setTimeout(resolve, out)
  })
}

function getTaskRewards(task) {
  return new Promise(resolve => {
    $nobyda.get('https://tc.vip.iqiyi.com/taskCenter/task/getTaskRewards?taskCode=' + task + '&lang=zh_CN&platform=0000000000000000&P00001=' + P00001, function (error, response, data) {
      if (error) {
        $nobyda.data += "\n浏览奖励失败: 接口请求出错 ‼️";
        info += "浏览奖励失败: 接口请求出错 ‼️\n";
        console.log(`爱奇艺-抽奖失败: \n${data} (${$nobyda.times})`)
      } else {
        const obj = JSON.parse(data)
        const Details = LogDetails ? `response:\n${data}` : ''
        if (obj.msg === "成功") {
          if (obj.code === "A00000") {
            if(obj.dataNew[0] !== undefined){ //任务未完成
              $nobyda.data += `\n浏览奖励成功: ${obj.dataNew[0].name + obj.dataNew[0].value} 🎉`;
              info += `浏览奖励成功: ${obj.dataNew[0].name + obj.dataNew[0].value} 🎉\n`;
              console.log(`爱奇艺-浏览奖励成功: ${obj.dataNew[0].name + obj.dataNew[0].value} 🎉`)
            }
          } else {
            $nobyda.data += `\n浏览奖励失败: ${obj.msg} ⚠️`;
            info += `浏览奖励失败: ${obj.msg} ⚠️\n`;
            console.log(`爱奇艺-抽奖失败: ${obj.msg || `未知错误`} ⚠️ (${$nobyda.times}) ${msg ? Details : `response:\n${data}`}`)
          }
        } else {
          $nobyda.data += "\n浏览奖励失败: Cookie无效/接口失效 ⚠️";
          info += "浏览奖励失败: Cookie无效/接口失效 ⚠️\n";
          console.log(`爱奇艺-浏览奖励失败: \n${data}`)
        }
        resolve()
      }
    })
    if (out) setTimeout(resolve, out)
  })
}

function nobyda() {
  const times = 0
  const start = Date.now()
  const node = (() => {
    const request = require('request');
    return ({
      request
    })
  })()
  const notice = (title, subtitle, message) => {
    log('\n' + title + '\n' + subtitle + '\n' + message)
  }
  const adapterStatus = (response) => {
    if (response) {
      if (response.status) {
        response["statusCode"] = response.status
      } else if (response.statusCode) {
        response["status"] = response.statusCode
      }
    }
    return response
  }
  const get = (options, callback) => {
      node.request(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
  }
  const post = (options, callback) => {
      node.request.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
  }

  const log = (message) => console.log(message)
  const time = () => {
    const end = ((Date.now() - start) / 1000).toFixed(2)
    return console.log('\n签到用时: ' + end + ' 秒')
  }

  return {
    notice,
    get,
    post,
    log,
    time,
    times,
  }
};

function isJSON_test(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            //console.log('转换成功：'+obj);
            return true;
        } catch(e) {
            console.log('no json');
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    //console.log('It is not a string!')
}

function k(e, t) {
  var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
    , n = a.split
    , c = void 0 === n ? "|" : n
    , r = a.sort
    , s = void 0 === r || r
    , o = a.splitSecretKey
    , i = void 0 !== o && o
    , l = s ? Object.keys(t).sort() : Object.keys(t)
    , u = l.map((function (e) {
      return "".concat(e, "=").concat(t[e])
    }
    )).join(c) + (i ? c : "") + e;
  return md5(u)
}
function w(){
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
    , t = [];
  return Object.keys(e).forEach((function (a) {
    t.push("".concat(a, "=").concat(e[a]))
  }
  )),
    t.join("&")
}

module.exports = iqiyi;

// Modified from https://github.com/blueimp/JavaScript-MD5
function md5(string){function RotateLeft(lValue,iShiftBits){return(lValue<<iShiftBits)|(lValue>>>(32-iShiftBits))}function AddUnsigned(lX,lY){var lX4,lY4,lX8,lY8,lResult;lX8=(lX&0x80000000);lY8=(lY&0x80000000);lX4=(lX&0x40000000);lY4=(lY&0x40000000);lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);if(lX4&lY4){return(lResult^0x80000000^lX8^lY8)}if(lX4|lY4){if(lResult&0x40000000){return(lResult^0xC0000000^lX8^lY8)}else{return(lResult^0x40000000^lX8^lY8)}}else{return(lResult^lX8^lY8)}}function F(x,y,z){return(x&y)|((~x)&z)}function G(x,y,z){return(x&z)|(y&(~z))}function H(x,y,z){return(x^y^z)}function I(x,y,z){return(y^(x|(~z)))}function FF(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(F(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b)};function GG(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(G(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b)};function HH(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(H(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b)};function II(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(I(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b)};function ConvertToWordArray(string){var lWordCount;var lMessageLength=string.length;var lNumberOfWords_temp1=lMessageLength+8;var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;var lNumberOfWords=(lNumberOfWords_temp2+1)*16;var lWordArray=Array(lNumberOfWords-1);var lBytePosition=0;var lByteCount=0;while(lByteCount<lMessageLength){lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=(lWordArray[lWordCount]|(string.charCodeAt(lByteCount)<<lBytePosition));lByteCount++}lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=lWordArray[lWordCount]|(0x80<<lBytePosition);lWordArray[lNumberOfWords-2]=lMessageLength<<3;lWordArray[lNumberOfWords-1]=lMessageLength>>>29;return lWordArray};function WordToHex(lValue){var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;WordToHexValue_temp="0"+lByte.toString(16);WordToHexValue=WordToHexValue+WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2)}return WordToHexValue};function Utf8Encode(string){string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c)}else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128)}else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128)}}return utftext};var x=Array();var k,AA,BB,CC,DD,a,b,c,d;var S11=7,S12=12,S13=17,S14=22;var S21=5,S22=9,S23=14,S24=20;var S31=4,S32=11,S33=16,S34=23;var S41=6,S42=10,S43=15,S44=21;string=Utf8Encode(string);x=ConvertToWordArray(string);a=0x67452301;b=0xEFCDAB89;c=0x98BADCFE;d=0x10325476;for(k=0;k<x.length;k+=16){AA=a;BB=b;CC=c;DD=d;a=FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=FF(c,d,a,b,x[k+2],S13,0x242070DB);b=FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);a=FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=FF(c,d,a,b,x[k+6],S13,0xA8304613);b=FF(b,c,d,a,x[k+7],S14,0xFD469501);a=FF(a,b,c,d,x[k+8],S11,0x698098D8);d=FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);a=FF(a,b,c,d,x[k+12],S11,0x6B901122);d=FF(d,a,b,c,x[k+13],S12,0xFD987193);c=FF(c,d,a,b,x[k+14],S13,0xA679438E);b=FF(b,c,d,a,x[k+15],S14,0x49B40821);a=GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=GG(d,a,b,c,x[k+6],S22,0xC040B340);c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);a=GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=GG(d,a,b,c,x[k+10],S22,0x2441453);c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);a=GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=GG(b,c,d,a,x[k+8],S24,0x455A14ED);a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);a=HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=HH(d,a,b,c,x[k+8],S32,0x8771F681);c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);a=HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=HH(b,c,d,a,x[k+6],S34,0x4881D05);a=HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=HH(b,c,d,a,x[k+2],S34,0xC4AC5665);a=II(a,b,c,d,x[k+0],S41,0xF4292244);d=II(d,a,b,c,x[k+7],S42,0x432AFF97);c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=II(b,c,d,a,x[k+5],S44,0xFC93A039);a=II(a,b,c,d,x[k+12],S41,0x655B59C3);d=II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=II(b,c,d,a,x[k+1],S44,0x85845DD1);a=II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=II(c,d,a,b,x[k+6],S43,0xA3014314);b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);a=II(a,b,c,d,x[k+4],S41,0xF7537E82);d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=II(b,c,d,a,x[k+9],S44,0xEB86D391);a=AddUnsigned(a,AA);b=AddUnsigned(b,BB);c=AddUnsigned(c,CC);d=AddUnsigned(d,DD)}var temp=WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);return temp.toLowerCase()}
