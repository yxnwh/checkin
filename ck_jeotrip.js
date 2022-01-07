const utils = require('./utils');
const Env = utils.Env;
const getData = utils.getData;
const $ = new Env('无忧行');
const notify = $.isNode() ? require('./notify') : '';
const AsVow = getData().JEGOTRIP;
var info = '';


const headers = {
    'Accept-Encoding': 'gzip, deflate, br',
    'Origin': '\u0068\u0074\u0074\u0070\u003a\u002f\u002f\u0074\u0061\u0073\u006b\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u003a\u0038\u0030\u0038\u0030',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=utf-8',
    'Connection': 'keep-alive',
    'Host': '\u0074\u0061\u0073\u006b\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u003a\u0038\u0030\u0038\u0030',
    'Accept-Language': 'en-us',
    'Referer': '\u0068\u0074\u0074\u0070\u003a\u002f\u002f\u0074\u0061\u0073\u006b\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u003a\u0038\u0030\u0038\u0030\u002f\u0074\u0061\u0073\u006b\u002f\u0069\u006e\u0064\u0065\u0078\u002e\u0068\u0074\u006d\u006c'
};


!(async () => {
  if (typeof $request != 'undefined') {
    GetCookie();
  } else if (AsVow) {
    if (isNode) {
      AsVow = $.toObj(AsVow.replace(/(['"])?(\w+)(['"])?/g, '"$2"'));
    }
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
        await QuerySign();
        if (invalid) {
          info += 'Token已失效‼️\n\n';
          continue;
        }
        headers['User-Agent'] = GetRandomUA();
        await QuerySign_Old();
        11 == mobile.length ? await QueryVideoTask() : info += '视频任务：+86号码专属‼️\n';
        await Total();
      } else {
        INC_Cookie = $.toStr(AsVow[i]);
        AsVow = $.toObj($.toStr(AsVow).replace(INC_Cookie,'').replace(/,]*$/, ']'));
        $.write(AsVow,'AsVow');
        $.error(`⚠️自动删除不完整的Cookie\n ${INC_Cookie}`);
      }
    }
    notify.sendNotify('无忧行', info);
  } else {
    info = '签到失败：请先获取Cookie⚠️';
    notify.sendNotify('无忧行', info);
  }
})().finally(() => {
  $.done();
});


function Total() {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0061\u0070\u0070\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f\u0061\u0070\u0069\u002f\u0073\u0065\u0072\u0076\u0069\u0063\u0065\u002f\u0075\u0073\u0065\u0072\u002f\u0076\u0031\u002f\u0067\u0065\u0074\u0055\u0073\u0065\u0072\u0041\u0073\u0073\u0065\u0074\u0073\u003f\u006c\u0061\u006e\u0067\u003d\u007a\u0068\u005f\u0063\u006e\u0026\u0074\u006f\u006b\u0065\u006e\u003d' + token;
  const body = `{"token":"${token}"}`;
  headers['Host'] = '\u0061\u0070\u0070\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e';
  headers['Referer'] = '\u0068\u0074\u0074\u0070\u003a\u002f\u002f\u0074\u0061\u0073\u006b\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u003a\u0038\u0030\u0038\u0030\u002f';
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then((resp) => {
        $.log(`\nTotal body: \n${$.toStr(resp)}`);
        data = $.toObj(resp.body);
        total = data.body.tripCoins;
        info += `无忧币总计：${total}💰\n`;
      })
      .catch((err) => {
        const error = '账号信息获取失败⚠️';
        $.error(error + '\n' + err);
		notify.sendNotify('无忧行', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function QuerySign() {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0061\u0070\u0070\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f\u0061\u0070\u0069\u002f\u0073\u0065\u0072\u0076\u0069\u0063\u0065\u002f\u0076\u0031\u002f\u006d\u0069\u0073\u0073\u0069\u006f\u006e\u002f\u0073\u0069\u0067\u006e\u002f\u0071\u0075\u0065\u0072\u0079\u0053\u0069\u0067\u006e\u003f\u0074\u006f\u006b\u0065\u006e\u003d' + token;
  headers['Origin'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0063\u0064\u006e\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e';
  headers['Host'] = '\u0061\u0070\u0070\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e';
  headers['User-Agent'] = 'Mozilla/4.0 MDN Example';
  headers['Referer'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0063\u0064\u006e\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f';
  const request = {
      url: url,
      headers: headers
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then(async (resp) => {
        $.log(`\nQuerySign body: \n${resp}`);
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
		  notify.sendNotify('无忧行', `${head}\nToken已失效‼️`);
        }
      })
      .catch((err) => {
        const error = '🆕签到状态获取失败⚠️';
        $.error(error + '\n' + err);
		notify.sendNotify('无忧行', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function UserSign(headers) {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0061\u0070\u0070\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f\u0061\u0070\u0069\u002f\u0073\u0065\u0072\u0076\u0069\u0063\u0065\u002f\u0076\u0031\u002f\u006d\u0069\u0073\u0073\u0069\u006f\u006e\u002f\u0073\u0069\u0067\u006e\u002f\u0075\u0073\u0065\u0072\u0053\u0069\u0067\u006e\u003f\u0074\u006f\u006b\u0065\u006e\u003d' + token;
  const body = `{"signConfigId":"${id}"}`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then((resp) => {
        $.log(`\nUserSign body: \n${resp}`);
        data = resp.body;
        if (data.includes('成功')) {
          info += `签到成功：无忧币 +${rewardCoin}🎉\n`;
        }
      })
      .catch((err) => {
        const error = '🆕签到失败⚠️';
        $.error(error + '\n' + err);
		notify.sendNotify('无忧行', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function QuerySign_Old() {
  delete headers['Origin'];
  const url = '\u0068\u0074\u0074\u0070\u003a\u002f\u002f\u0074\u0061\u0073\u006b\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u003a\u0038\u0030\u0038\u0030\u002f\u0061\u0070\u0070\u002f\u0074\u0061\u0073\u006b\u0073\u003f\u0075\u0073\u0065\u0072\u0069\u0064\u003d' + userid;
  const request = {
      url: url,
      headers: headers
  };
  return new Promise(resolve => {
    $.http.get(request)
      .then(async (resp) => {
        $.log(`\nQuerySign_Old body: \n${resp}`);
        data = $.toObj(resp.body);
        list = data.rtn.tasks['日常任务'][0];
        status = list.triggerAction;
        if (status == '已签到') {
          info += info.match(mobile_ + '.*\n.*' + '失败') ? `` : `签到失败：今日已签到🍷‼️\n`;
        } else {
          coins = list.credits;
          taskid = list.id;
          await Checkin();
        }
      })
      .catch((err) => {
        const error = '签到状态获取失败⚠️';
        $.error(error + '\n' + err);
        notify.sendNotify('无忧行', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function Checkin() {
  const url = '\u0068\u0074\u0074\u0070\u003a\u002f\u002f\u0074\u0061\u0073\u006b\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u003a\u0038\u0030\u0038\u0030\u002f\u0061\u0070\u0070\u002f\u0073\u0069\u0067\u006e';
  const body = `{
      "userid":"${userid}",
      "taskId":"${taskid}"
  }`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then((resp) => {
        $.log(`\nCheckin body: \n${resp}`);
        data = resp.body;
        if (data.includes('true')) {
          reger = new RegExp(_mobile + '.*' + mobile_ + '.*\n.*' + rewardCoin,'gm');
          info.match(reger) ? info = info.replace(reger,`${_mobile_} ===\n签到成功：无忧币 +${(+rewardCoin)+(+coins)}`) : info += `签到成功：无忧币 +${coins}🍷🎉\n`;
        }
      })
      .catch((err) => {
        const error = '签到失败⚠️';
        $.error(error + '\n' + err);
        notify.sendNotify('无忧行', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function QueryVideoTask() {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0075\u0064\u0073\u002d\u0069\u002e\u0063\u006d\u0069\u0073\u0068\u006f\u0077\u002e\u0063\u006f\u006d\u003a\u0031\u0034\u0034\u0033\u002f\u0075\u0064\u0073\u002f\u0063\u006c\u006f\u0075\u0064\u002f\u0077\u0061\u0074\u0063\u0068\u002f\u006c\u0069\u0073\u0074\u003f\u0076\u0065\u0072\u0073\u0069\u006f\u006e\u003d\u0031';
  headers['Origin'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0069\u0073\u0068\u006f\u0077\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e';
  headers['Host'] = '\u0075\u0064\u0073\u002d\u0069\u002e\u0063\u006d\u0069\u0073\u0068\u006f\u0077\u002e\u0063\u006f\u006d\u003a\u0031\u0034\u0034\u0033';
  headers['Referer'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0069\u0073\u0068\u006f\u0077\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f';
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
        $.log(`\nQueryVideoTask body: \n${resp}`);
        data = resp.body;
        if (data.includes('"exchangeNum":10,')) {
          info += `视频任务：今日已完成‼️\n`;
        } else {
          await VideoTask(headers);
        }
      })
      .catch((err) => {
        const error = '视频任务信息获取失败⚠️';
        $.error(error + '\n' + err);
        notify.sendNotify('无忧行', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function VideoTask(headers) {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0075\u0064\u0073\u002d\u0069\u002e\u0063\u006d\u0069\u0073\u0068\u006f\u0077\u002e\u0063\u006f\u006d\u003a\u0031\u0034\u0034\u0033\u002f\u0075\u0064\u0073\u002f\u0063\u006c\u006f\u0075\u0064\u002f\u0077\u0061\u0074\u0063\u0068\u002f\u0075\u0070\u0064\u0061\u0074\u0065\u003f\u0076\u0065\u0072\u0073\u0069\u006f\u006e\u003d\u0031';
  headers['Referer'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0069\u0073\u0068\u006f\u0077\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f\u0066\u0072\u0065\u0065\u0053\u0074\u0079\u006c\u0065\u0054\u006f\u0075\u0072\u0069\u0073\u006d\u002f\u0064\u0065\u0074\u0061\u0069\u006c';
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
        $.log(`\nVideoTask body: \n${resp}`);
        data = resp.body;
        if (data.includes('update success')) {
          await Exchange(headers);
        }
      })
      .catch((err) => {
        const error = '视频任务失败⚠️';
        $.error(error + '\n' + err);
        notify.sendNotify('无忧行', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function Exchange(headers) {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0075\u0064\u0073\u002d\u0069\u002e\u0063\u006d\u0069\u0073\u0068\u006f\u0077\u002e\u0063\u006f\u006d\u003a\u0031\u0034\u0034\u0033\u002f\u0075\u0064\u0073\u002f\u0063\u006c\u006f\u0075\u0064\u002f\u0077\u0061\u0074\u0063\u0068\u002f\u0065\u0078\u0063\u0068\u0061\u006e\u0067\u0065\u003f\u0076\u0065\u0072\u0073\u0069\u006f\u006e\u003d\u0031';
  headers['Referer'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0069\u0073\u0068\u006f\u0077\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f\u0066\u0072\u0065\u0065\u0053\u0074\u0079\u006c\u0065\u0054\u006f\u0075\u0072\u0069\u0073\u006d\u002f\u0061\u0063\u0074\u0069\u0076\u0069\u0074\u0079';
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
        $.log(`\nExchange body: \n${resp}`);
        data = resp.body;
        if (data.includes('"exchangeNum":10,')) {
          info += '视频任务：无忧币 +10🎉\n';
        } else {
          $.error(`\n${head}\n兑换失败⚠️`);
          res = $.toObj(data.replace('.',''));
          info += `视频任务：${res.mes}‼️\n`;
        }
      })
      .catch((err) => {
        const error = '兑换失败⚠️';
        $.error(error + '\n' + err);
        notify.sendNotify('无忧行', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function GetCookie() {
  const { headers, url, method } = $request;
  const { body } = $response;
  if (url.includes('accountid') && url.includes('call_phone')) {
    const accountid = url.match(/accountid=(\d+)/)[1];
    const mobile = url.match(/call_phone=(\d+)/)[1];
    SetCookie('accountid',accountid,'mobile',mobile);
  }
  if (url.includes('logonFree') && body.includes('uid')) {
    const token = url.match(/token=(\w+)/)[1];
    const userid = body.match(/uid=(\w+)/)[1];
    SetCookie('token',token,'userid',userid);
  }
  if (info.length > 10) {
    notify.sendNotify('无忧行', info);
  }
  if (info.includes('\n')) {
    info = `=== 账号${AsVow.length}：${AsVow.pop().mobile} ===\nCookie完整🎉`;
	notify.sendNotify('无忧行', info);
  }
}


function SetCookie(k1,v1,k2,v2) {
  if (typeof AsVow != 'undefined') {
    if (!$.toStr(AsVow).includes(`'${k1}':'${v1}','${k2}':'${v2}'`)) {
      i = AsVow.length;
      if (k1 == 'token'){
        for (j in AsVow) {
          if (AsVow[j].userid == v2) {
            info = `=== 账号 ${AsVow[j].mobile} ===\n`
            AsVow[j][k1] = v1;
            $.write(AsVow, 'AsVow');
            $.read('AsVow') == AsVow ? info = '更新token成功🎉' : info = '更新token失败‼️';
            return;
          }
        }
      }
      if (Object.keys(AsVow[i-1]).length < 4){
        AsVow[i-1][k1] = v1;
        AsVow[i-1][k2] = v2;
      } else {
        AsVow[i] = {[k1]:v1,[k2]:v2};
      }
      $.write(AsVow, 'AsVow');
      $.read('AsVow') == AsVow ? info = `写入 ${k1} & ${k2} 成功🎉` : info = `写入 ${k1} & ${k2} 失败‼️`;
    }
  } else {
    AsVow = [{[k1]:v1,[k2]:v2}];
    $.write(AsVow, 'AsVow');
      $.read('AsVow') == AsVow ? info = `写入 ${k1} & ${k2} 成功🎉` : info = `写入 ${k1} & ${k2} 失败‼️`;
  }
  Cookie = $.toStr(AsVow[AsVow.length-1]);
  if (Cookie.match('accountid.*mobile') && Cookie.match('token.*userid')) {
    info += `\n`;
  }
}

// 随机 User-Agent
function GetRandomUA() {
  const USER_AGENTS=['Mozilla/5.0 (Linux; Android 10; ONEPLUS A5010 Build/QKQ1.191014.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 9; Mi Note 3 Build/PKQ1.181007.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 9; 16T Build/PKQ1.190616.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 11; Redmi K30 5G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045511 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 source/jegotrip','Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 9; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 8.1.0; 16 X Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 8.0.0; HTC U-3w Build/OPR6.170623.013; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 10; LYA-AL00 Build/HUAWEILYA-AL00L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 8.1.0; MI 8 Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; Redmi K20 Pro Premium Edition Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 11; Redmi K20 Pro Premium Edition Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip'];
  const RANDOM_UA = USER_AGENTS[Math.min(Math.floor(Math.random() * USER_AGENTS.length), USER_AGENTS.length)];
  return RANDOM_UA;
}

module.exports = jeotrip;
