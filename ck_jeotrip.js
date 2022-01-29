/*
37 7 * * * ck_jeotrip.js
 * @Author: AsVow
 * @LastMod: 2022-01-20 20:43:14
Cookie说明：分为四部分「 accountid｜mobile｜token｜userid 」
点击「 我的客服 」 提取「 accountid & mobile 」
点击「 无忧币商城 」 提取「 token & userid(uid) 」
*/
const utils = require('./utils');
const CryptoJs = require('crypto-js');
const Env = utils.Env;
const getData = utils.getData;
const $ = new Env('无忧行');
const notify = $.isNode() ? require('./notify') : '';
const AsVow = getData().JEGOTRIP;
var info = '';
var desp = '';

const headers = {
    'Accept-Encoding': 'gzip, deflate, br',
    'Origin': 'http://task.jegotrip.com.cn:8080',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=utf-8',
    'Connection': 'keep-alive',
    'Host': 'task.jegotrip.com.cn:8080',
    'Accept-Language': 'en-us',
    'Referer': 'http://task.jegotrip.com.cn:8080/task/index.html'
};

jegotrip();

async function jegotrip() {
  if (AsVow) {
    for (i in AsVow) {
      accountid = AsVow[i].accountid;
      mobile = AsVow[i].mobile;
      token = AsVow[i].token;
      userid = AsVow[i].userid;
      invalid = false;
      if (accountid && mobile && token && userid) {
        star = '';
        for(x in [...Array(mobile.length-6).keys()]) star += '*';
        _mobile = mobile.slice(0,3);
        mobile_ = mobile.slice(-3);
        _mobile_ = _mobile + star + mobile_;
        head = `=== 账号${(+i)+1}：${_mobile_} ===\n`;
        info += `\n${head}`;
        headers['User-Agent'] = GetRandomUA();
        await QuerySign();
        if (invalid) {
          info += 'Token已失效‼️\n\n';
          continue;
        }
        11 == mobile.length ? await QueryVideoTask() : info += '视频任务：+86号码专属‼️\n';
        await Total();
        desp += info;
        info = '';
      } else {
        INC_Cookie = $.toStr(AsVow[i]);
        AsVow = $.toObj($.toStr(AsVow).replace(INC_Cookie,'').replace(/,]*$/, ']'));
        $.write(AsVow,'AsVow');
        console.log(`⚠️自动删除不完整的Cookie\n ${INC_Cookie}`);
      }
    }
    info += desp;
    console.log(info);
    notify.sendNotify('无忧行', info);
  } else {
    info = '签到失败：请先获取Cookie⚠️';
    notify.sendNotify('无忧行', info);
  }
}


function Total() {
  const url = 'https://app.jegotrip.com.cn/api/service/user/v1/getUserAssets?lang=zh_cn&token=' + token;
  const body = `{"token":"${token}"}`;
  headers['Host'] = 'app.jegotrip.com.cn';
  headers['Referer'] = 'http://task.jegotrip.com.cn:8080/';
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then((resp) => {
        data = $.toObj(resp.body);
        total = data.body.tripCoins;
        info += `无忧币总计：${total}💰\n`;
      })
      .catch((err) => {
        const error = '账号信息获取失败⚠️';
        console.log(error + '\n' + err);
        notify.sendNotify('无忧行', error + '\n' +'请查看日志‼️');
      })
      .finally(() => {
        resolve();
      });
  });
}


function QuerySign() {
  const url = 'https://app.jegotrip.com.cn/api/service/v1/mission/sign/querySign?token=' + token;
  headers['Origin'] = 'https://cdn.jegotrip.com.cn';
  headers['Host'] = 'app.jegotrip.com.cn';
  headers['User-Agent'] = 'Mozilla/4.0 MDN Example';
  headers['Referer'] = 'https://cdn.jegotrip.com.cn/';
  const request = {
      url: url,
      headers: headers
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then(async (resp) => {
        data = resp.body;
        if (data.includes('成功')) {
          data = $.toObj(data);
          list = data.body.reverse();
          for (var i in list) {
            isSign = list[i].isSign;
            if (isSign == '3') {
              info += '签到失败：今日已签到‼️\n';
              break;
            } else if (isSign == '2') {
              id = list[i].id;
              rewardCoin = list[i].rewardCoin;
              await UserSign(headers);
              break;
            }
          }
        } else if (data.includes('不正确')) {
          invalid = true;
          notify.sendNotify('无忧行', 'Token已失效‼️');
        }
      })
      .catch((err) => {
        const error = '签到状态获取失败⚠️';
        console.log(error + '\n' + err);
        notify.sendNotify('无忧行', error + '\n' +'请查看日志‼️');
      })
      .finally(() => {
        resolve();
      });
  });
}


function UserSign(headers) {
  const url = 'https://app.jegotrip.com.cn/api/service/v1/mission/sign/userSign?token=' + token;
  const body = `{"signConfigId":"${id}"}`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then((resp) => {
        data = resp.body;
        if (data.includes('成功')) {
          info += `签到成功：无忧币 +${rewardCoin}🎉\n`;
        }
      })
      .catch((err) => {
        const error = '签到失败⚠️';
        console.log(error + '\n' + err);
        notify.sendNotify('无忧行', error + '\n' +'请查看日志‼️');
      })
      .finally(() => {
        resolve();
      });
  });
}


function QueryVideoTask() {
  const url = 'https://uds-i.cmishow.com:1443/uds/cloud/watch/list?version=1';
  headers['Origin'] = 'https://ishow.jegotrip.com.cn';
  headers['Host'] = 'uds-i.cmishow.com:1443';
  headers['Referer'] = 'https://ishow.jegotrip.com.cn/';
  const body = `{
      "userId":"${accountid}",
      "accountId":"${mobile}"
  }`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then(async (resp) => {
        data = resp.body;
        if (data.includes('"exchangeNum":10,')) {
          info += `视频任务：今日已完成‼️\n`;
        } else {
          await VideoTask(headers);
        }
      })
      .catch((err) => {
        const error = '视频任务信息获取失败⚠️';
        console.log(error + '\n' + err);
        notify.sendNotify('无忧行', error + '\n' +'请查看日志‼️');
      })
      .finally(() => {
        resolve();
      });
  });
}


function VideoTask(headers) {
  const url = 'https://uds-i.cmishow.com:1443/uds/cloud/watch/update?version=1';
  headers['Referer'] = 'https://ishow.jegotrip.com.cn/freeStyleTourism/detail';
  const body = `{
      "userId":"${accountid}",
      "userWatchTime":"10.0",
      "accountId":"${mobile}"
  }`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then(async (resp) => {
        data = resp.body;
        if (data.includes('update success')) {
          await Exchange(headers);
        }
      })
      .catch((err) => {
        const error = '视频任务失败⚠️';
        console.log(error + '\n' + err);
        notify.sendNotify('无忧行', error + '\n' +'请查看日志‼️');
      })
      .finally(() => {
        resolve();
      });
  });
}


function Exchange(headers) {
  const url = 'https://uds-i.cmishow.com:1443/uds/cloud/watch/exchange?version=1';
  headers['Referer'] = 'https://ishow.jegotrip.com.cn/freeStyleTourism/activity';
  const body = `{
      "userId":"${accountid}",
      "exchangeTime":10,
      "exchangeNum":10,
      "accountId":"${mobile}"
  }`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then((resp) => {
        data = resp.body;
        if (data.includes('"exchangeNum":10,')) {
          info += '视频任务：无忧币 +10🎉\n';
        } else {
          console.log(`\n${head}\n兑换失败⚠️`);
          res = $.toObj(data.replace('.',''));
          info += `视频任务：${res.mes}‼️\n`;
        }
      })
      .catch((err) => {
        const error = '兑换失败⚠️';
        console.log(error + '\n' + err);
        notify.sendNotify('无忧行', error + '\n' +'请查看日志‼️');
      })
      .finally(() => {
        resolve();
      });
  });
}

function Encrypt(i) {
    if (!i || "object" != typeof i) return {};
	var t = "online_jego_h5",
        r = "93EFE107DDE6DE51",
	    n = "01";
    var o = function() {
            var i = (new Date).getTime().toString() + Math.floor(900 * Math.random() + 100).toString(),
                o = r + i,
                s = CryptoJs.MD5(o).toString().toLowerCase().slice(8, 24),
                c = CryptoJs.enc.Utf8.parse(t + ";" + i + ";" + n);
            return {
                key: s,
                sec: CryptoJs.enc.Base64.stringify(c)
            }
        }(),
        s = JSON.stringify(i),
        c = CryptoJs.enc.Utf8.parse(o.key),
        a = CryptoJs.AES.encrypt(s, c, {
            mode: CryptoJs.mode.ECB,
            padding: CryptoJs.pad.Pkcs7
        }).toString();
    return {
        sec: o.sec,
        body: a
    }
}

/*
function Decrypt(t, n) {
    if (!t || !n) return n;
    r = "93EFE107DDE6DE51";
    var i = CryptoJs.enc.Utf8.parse(function(t) {
            var n = "";
            if (!t) return n;
            var i = CryptoJs.enc.Base64.parse(t).toString(CryptoJs.enc.Utf8).split(";");
            if (i && 3 === i.length) {
                var o = r + i[1];
                n = CryptoJs.MD5(o).toString().toLowerCase().slice(8, 24)
            }
            return n
        }(t)),
        o = CryptoJs.AES.decrypt(n, i, {
            mode: CryptoJs.mode.ECB,
            padding: CryptoJs.pad.Pkcs7
        }).toString(CryptoJs.enc.Utf8),
        s = o;
    try {
        s = JSON.parse(o);
    } catch(t){}
    return s
}
*/

// 随机 User-Agent
function GetRandomUA() {
  const USER_AGENTS=['Mozilla/5.0 (Linux; Android 10; ONEPLUS A5010 Build/QKQ1.191014.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 9; Mi Note 3 Build/PKQ1.181007.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 9; 16T Build/PKQ1.190616.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 11; Redmi K30 5G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045511 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 source/jegotrip','Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 9; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 8.1.0; 16 X Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 8.0.0; HTC U-3w Build/OPR6.170623.013; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 10; LYA-AL00 Build/HUAWEILYA-AL00L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 8.1.0; MI 8 Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; Redmi K20 Pro Premium Edition Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 11; Redmi K20 Pro Premium Edition Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip'];
  const RANDOM_UA = USER_AGENTS[Math.min(Math.floor(Math.random() * USER_AGENTS.length), USER_AGENTS.length)];
  return RANDOM_UA;
}

module.exports = jegotrip;
