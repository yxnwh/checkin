/*
11 8 * * * ck_xiaoyi.js
*/
const utils = require('./utils');
const HmacSha1 = require('crypto-js/hmac-sha1');
const Base64 = require('crypto-js/enc-base64');
const Qs = require('qs');
const Env = utils.Env;
const getData = utils.getData;
const sleep = utils.sleep;
const $ = new Env('小蚁');
const notify = $.isNode() ? require('./notify') : '';
const AsVow = getData().XIAOYI;
var info = '';
var desp = '';



const headers = {
      'Host': 'gw.xiaoyi.com',
      'Origin': 'http://app.xiaoyi.com',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 APP/com.360ants.yihome APPV/5.4.4 iosPassportSDK/2.2.2 iOS/14.2.1',
      'Referer': 'http://app.xiaoyi.com/cnApph5/integral/?rewardType=1&taskType=10&subTask=0'
};


xiaoyi();

async function xiaoyi() {
  if (AsVow) {
    for (i in AsVow) {
      refresh_token = AsVow[i].token;
      var userid = '';
      var mobile = '';
      var live_num = 0;
      var video_num = 0;
      var alert_num = 0;
      var ss = {};
      await getauth();
      if (refresh_token) {
        head = `=== 正对在 ${mobile} 的账号签到===\n`;
        info += `\n${head}`;
        await sign();
        await query_tsknum();
        await sleep(Math.floor((Math.random() * 10) + 32));
        for(var i=1;i<video_num+1;i++) {
            await videotask(i);
            await sleep(Math.floor((Math.random() * 10) + 32));
        }
        for(var i=1;i<live_num+1;i++) {
            await receive_livetask(i);
            await sleep(Math.floor((Math.random() * 10) + 32));
            await livetask(i);
            await sleep(Math.floor((Math.random() * 10) + 10));
        }
        for(var i=1;i<alert_num+1;i++) {
            await receive_alerttask(i);
            await sleep(Math.floor((Math.random() * 10) + 10));
            await alerttask(i);
            await sleep(Math.floor((Math.random() * 10) + 10));
        }
        desp += info;
        info = '';
      } 
    }
    info += desp;
    console.log(info);
    notify.sendNotify('小蚁', info);
  } else {
    info = '签到失败：请先获取Cookie⚠️';
    console.log(info);
    notify.sendNotify('小蚁', info);
  }
}

function getauth() {
  url = `https://gw.xiaoyi.com/v2/auth/wechat/login?auth_refresh_token=${refresh_token}&auth_type=13&dev_id=&dev_name=Apple&dev_os_version=iOS_14.2.1&dev_type=iPhone13%2C2&opt_type=1`;
  headers['User-Agent'] = '小蚁摄像机/5.4.4 rv:5.4.401271500 (iPhone; iOS 14.2.1; zh_CN)';
  delete headers['Referer'];
  delete headers['Origin'];
  return new Promise(resolve => {
    fetch(url, {
        method: 'PUT',
        headers: headers
    }).then(function(response) {
        return response.json()
    }).then(function(body) {
        if (body.code == "20000") {
            mobile = body.data.mobile;
            userid = body.data.userid;
            ss.token = body.data.token;
            ss.token_secret = body.data.token_secret;
    }).catch(function(e) {
        error = 'auth信息可能失效⚠️';
        console.log(error + '\n' + e);
    }).finally(() => {
        resolve();
    });
  });
}

function sign() {
  time = new Date().getTime();
  hh = 'appPlatform=yihome&region=CN&seq=1&timestamp='+time+'&userid='+userid;
  suffix = t(hh,ss);
  url = 'https://gw.xiaoyi.com/urs/v8/task/sign/14990653?${suffix}';
  return new Promise(resolve => {
    fetch(url, {
        method: 'GET',
        headers: headers
    }).then(function(response) {
        return response.json()
    }).then(function(body) {
        if (body.code == "20000" && body.msg == "success") {
            if (body.data == 0) {
                info += '签到成功\n';
            } else {
                info += '今天已经签到过啦\n';
            }
    }).catch(function(e) {
        const error = '签到出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    }).finally(() => {
        resolve();
    });
  });
}

function query_tsknum() {
  time = new Date().getTime();
  hh = 'appPlatform=yihome&region=CN&seq=1&timestamp='+time+'&userid='+userid;
  suffix = t(hh,ss);
  url = 'https://gw.xiaoyi.com/urs/v8/task/list?${suffix}';
  return new Promise(resolve => {
    fetch(url, {
        method: 'GET',
        headers: headers
    }).then(function(response) {
        return response.json()
    }).then(function(body) {
        if (body.code == "20000" && body.msg == "success") {
            video_num = body.data[0].total - body.data[0].currentTotal;
            live_num = body.data[1].total - body.data[1].currentTotal;
            alert_num = body.data[2].total - body.data[2].currentTotal;
            info += '获取视频任务数量成功\n';
    }).catch(function(e) {
        const error = '获取视频任务数量出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    }).finally(() => {
        resolve();
    });
  });
}

function videotask(t) {
  url = 'https://gw.xiaoyi.com/urs/v8/task/do';
  headers['Content-Type'] = 'application/x-www-form-urlencoded';
  nonce = Math.random().toString().slice(-6);
  time = new Date().getTime();
  hh = {"appPlatform":"yihome","nonce":nonce,"region":"CN","seq":1,"subTask":0,"taskType":20,"timestamp":time,"userid":userid};
  cc =Qs.stringify(hh);
  hh.hmac = decodeURIComponent(t(cc,ss).replace('&'+cc,'').slice(5));
  return new Promise(resolve => {
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: Qs.stringify(hh),
    }).then(function(response) {
        return response.json()
    }).then(function(body) {
        if (body.code == "20000" && body.msg == "success") {
            info += '完成第 ${t} 次看视频任务：\n获得${body.data.reward}分\n';

    }).catch(function(e) {
        const error = '看视频任务出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    }).finally(() => {
        resolve();
    });
  });
}

function receive_livetask(t) {
  url = 'https://gw.xiaoyi.com/urs/v8/task/receive';
  headers['Content-Type'] = 'application/x-www-form-urlencoded';
  nonce = Math.random().toString().slice(-6);
  time = new Date().getTime();
  hh = {"appPlatform":"yihome","nonce":nonce,"region":"CN","seq":1,"subTask":0,"taskType":80,"timestamp":time,"userid":userid};
  cc =Qs.stringify(hh);
  hh.hmac = decodeURIComponent(t(cc,ss).replace('&'+cc,'').slice(5));
  return new Promise(resolve => {
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: Qs.stringify(hh),
    }).then(function(response) {
        return response.json()
    }).then(function(body) {
        if (body.code == "20000" && body.msg == "success") {
            info += '接受第 ${t} 次看直播任务：\n';
    }).catch(function(e) {
        const error = '接受看直播任务出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    }).finally(() => {
        resolve();
    });
  });
}

function livetask(t) {
  url = 'https://gw.xiaoyi.com/urs/v8/task/do';
  headers['Content-Type'] = 'application/x-www-form-urlencoded';
  nonce = Math.random().toString().slice(-6);
  time = new Date().getTime();
  hh = {"appPlatform":"yihome","nonce":nonce,"region":"CN","seq":1,"subTask":0,"taskType":80,"timestamp":time,"userid":userid};
  cc =Qs.stringify(hh);
  hh.hmac = decodeURIComponent(t(cc,ss).replace('&'+cc,'').slice(5));
  return new Promise(resolve => {
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: Qs.stringify(hh),
    }).then(function(response) {
        return response.json()
    }).then(function(body) {
        if (body.code == "20000" && body.msg == "success") {
            info += '完成第 ${t} 次看直播任务：\n获得${body.data.reward}分\n';
    }).catch(function(e) {
        const error = '看直播任务出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    }).finally(() => {
        resolve();
    });
  });
}

function receive_alerttask(t) {
  url = 'https://gw.xiaoyi.com/urs/v8/task/receive';
  headers['Content-Type'] = 'application/x-www-form-urlencoded';
  nonce = Math.random().toString().slice(-6);
  time = new Date().getTime();
  hh = {"appPlatform":"yihome","nonce":nonce,"region":"CN","seq":1,"subTask":0,"taskType":70,"timestamp":time,"userid":userid};
  cc =Qs.stringify(hh);
  hh.hmac = decodeURIComponent(t(cc,ss).replace('&'+cc,'').slice(5));
  return new Promise(resolve => {
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: Qs.stringify(hh),
    }).then(function(response) {
        return response.json()
    }).then(function(body) {
        if (body.code == "20000" && body.msg == "success") {
            info += '接受第 ${t} 次看报警视频任务：\n';
    }).catch(function(e) {
        const error = '接受看报警视频任务出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    }).finally(() => {
        resolve();
    });
  });
}

function alerttask(t) {
  url = 'https://gw.xiaoyi.com/urs/v8/task/do';
  headers['Content-Type'] = 'application/x-www-form-urlencoded';
  nonce = Math.random().toString().slice(-6);
  time = new Date().getTime();
  hh = {"appPlatform":"yihome","nonce":nonce,"region":"CN","seq":1,"subTask":0,"taskType":70,"timestamp":time,"userid":userid};
  cc =Qs.stringify(hh);
  hh.hmac = decodeURIComponent(t(cc,ss).replace('&'+cc,'').slice(5));
  return new Promise(resolve => {
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: Qs.stringify(hh),
    }).then(function(response) {
        return response.json()
    }).then(function(body) {
        if (body.code == "20000" && body.msg == "success") {
            info += '完成第 ${t} 次看报警视频任务：\n获得${body.data.reward}分\n';
    }).catch(function(e) {
        const error = '看报警视频任务出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    }).finally(() => {
        resolve();
    });
  });
}

function t(a, b)
{
    m = b.token,
    n = b.token_secret,
    o = Base64.stringify((HmacSha1(a,m+'&'+n)));
    c = 'hmac=' + encodeURIComponent(o) + '&' + a;
    console.log(c);
   	return c
}

module.exports = xiaoyi;
