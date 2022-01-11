/*
37 7 * * * ck_jeotrip.js
在check.toml中添加如下，其中mobile为手机号，11位，token为32为的数字和字母组成，自己抓包
# 无忧行【APP】
[[JEGOTRIP]]
mobile = "13xxxxxxxxx"
token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
*/
const utils = require('./utils');
const CryptoJs = require('crypto-js');
const Env = utils.Env;
const getData = utils.getData;
const $ = new Env('无忧行');
const notify = $.isNode() ? require('./notify') : '';
const AsVow = getData().JEGOTRIP;
var info = '';


const headers = {
	'Host': 'app.jegotrip.com.cn',
	'Origin': 'https://cdn.jegotrip.com.cn',
	//User-Agent最好更换为自己的
	'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
};

jegotrip();

async function jegotrip() {
  if (AsVow) {
    for (i in AsVow) {
      mobile = AsVow[i].mobile;
      token = AsVow[i].token;
      invalid = false;
      if (mobile && token) {
        star = '';
        for(x in [...Array(mobile.length-6).keys()]) star += '*';
        _mobile = mobile.slice(0,3);
        mobile_ = mobile.slice(-3);
        _mobile_ = _mobile + star + mobile_;
        head = `=== 账号${(+i)+1}：${_mobile_} ===\n`;
        info += `\n${head}`;
        await QuerySign();
        if (invalid) {
          info += 'Token已失效‼️\n\n';
          continue;
        }
        await Total();
        notify.sendNotify('无忧行', info);
        info = '';
      } else {
        INC_Cookie = $.toStr(AsVow[i]);
        AsVow = $.toObj($.toStr(AsVow).replace(INC_Cookie,'').replace(/,]*$/, ']'));
        $.write(AsVow,'AsVow');
        console.log(`⚠️自动删除不完整的Cookie\n ${INC_Cookie}`);
      }
    }
  } else {
    info = '签到失败：请先获取Cookie⚠️';
    Log(info)
    notify.sendNotify('无忧行', info);
  }
}


function Total() {
  const url = 'https://app.jegotrip.com.cn/api/service/user/v1/getUserAssets?lang=zh_cn&token=' + token;
  const body = `{"token":"${token}"}`;
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
        console.log(info)
      })
      .catch((err) => {
        const error = '账号信息获取失败⚠️';
        console.log(error + '\n' + err);
      })
      .finally(() => {
        resolve();
      });
  });
}


function QuerySign() {
  const url = 'https://app.jegotrip.com.cn/api/service/v1/mission/sign/querySign?token=' + token;
  headers['Referer'] = 'https://cdn.jegotrip.com.cn/static/missioncenter/index.html?token=' + token;
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
              info += `签到失败：今日已签到‼️\n\n已获得无忧币: +${list[i].rewardCoin}\n`;
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
        }
      })
      .catch((err) => {
        const error = '🆕签到状态获取失败⚠️';
        console.log(error + '\n' + err);
      })
      .finally(() => {
        resolve();
      });
  });
}


function UserSign(headers) {
  const url = 'https://app.jegotrip.com.cn/api/service/v1/mission/sign/userSign?token=' + token;
  headers['Referer'] = 'https://cdn.jegotrip.com.cn/static/missioncenter/index.html?token=' + token;
  headers['Accept'] = 'application/json';
  headers['Content-Type'] = 'application/json';
  bdata = {"signConfigId":id};
  body = Encrypt(bdata);
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  console.log(request);
  return new Promise(resolve => {
    $.http.post(request)
      .then((resp) => {
        data = resp.body;
        if (data.includes('成功')) {
          info += `签到成功：无忧币 +${rewardCoin}🎉\n`;
        }
      })
      .catch((err) => {
        const error = 'UserSign 🆕签到失败⚠️';
        console.log(error + '\n' + err);
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
module.exports = jegotrip;
