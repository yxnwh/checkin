/*
37 7 * * * ck_jeotrip.js
在check.toml中添加如下，其中mobile为手机号，11位，token为32为的数字和字母组成，自己取抓包
# 无忧行【APP】
[[JEGOTRIP]]
mobile = "13xxxxxxxxx"
token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
*/
const utils = require('./utils');
const Env = utils.Env;
const getData = utils.getData;
const $ = new Env('无忧行');
const notify = $.isNode() ? require('./notify') : '';
const AsVow = getData().JEGOTRIP;
var info = '';


const headers = {
	'Host': 'app.jegotrip.com.cn',
	'Origin': 'https://cdn.jegotrip.com.cn',
	'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
};

function Log(desp) {
    console.log(desp);
}

!(async () => {
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
      } else {
        INC_Cookie = $.toStr(AsVow[i]);
        AsVow = $.toObj($.toStr(AsVow).replace(INC_Cookie,'').replace(/,]*$/, ']'));
        $.write(AsVow,'AsVow');
        Log(`⚠️自动删除不完整的Cookie\n ${INC_Cookie}`);
      }
    }
    notify.sendNotify('无忧行', info);
  } else {
    info = '签到失败：请先获取Cookie⚠️';
    Log(info)
    notify.sendNotify('无忧行', info);
  }
})().finally(() => {
  $.done();
});


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
        Log(info)
      })
      .catch((err) => {
        const error = '账号信息获取失败⚠️';
        Log(error + '\n' + err);
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
        }
      })
      .catch((err) => {
        const error = '🆕签到状态获取失败⚠️';
        Log(error + '\n' + err);
      })
      .finally(() => {
        resolve();
      });
  });
}


function UserSign(headers) {
  const url = 'https://app.jegotrip.com.cn/api/service/v1/mission/sign/userSign?token=' + token;
  headers['Referer'] = 'https://cdn.jegotrip.com.cn/static/missioncenter/index.html?token=' + token;
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
        const error = 'UserSign 🆕签到失败⚠️';
        Log(error + '\n' + err);
      })
      .finally(() => {
        resolve();
      });
  });
}
