const utils = require('./utils');
const sleep = utils.sleep;
const getData = utils.getData;
const Env = utils.Env;
const $ = new Env('和彩云')
const Qs = require('qs');
const fetch = require('node-fetch');
const JSEncrypt = require('./jsencrypt-2.3-mod.js');
const notify = $.isNode() ? require('./notify') : '';
const AsVow = getData().MCLOUD;
var info = '';
var desp = '';

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MCloudApp/8.10.0'
};

const pubbkey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEdVKnXpmib/xkN/SYguTHTTd4f1N3K8L/QmcWLKtyrdoFwENaaAZC1v471+ge9y3cAgsSZJNbW9LmPD/7W0KZ3K1HXLS5PBMAGFW/CybJ8nE8+xCH6ypOhFMq504q9mDujhtOI54XvDC1BZnDvA5J1OpxeJuOtRAQar/7BgU1nwIDAQAB";

mcloud();

async function mcloud() {
  if (AsVow) {
    for (i in AsVow) {
      ss = {};
      ss.cookie = AsVow[i].cookie;
      ss.referer = AsVow[i].referer;
      pat = new RegExp("account=([0-9]+)");
      ss.account = pat.exec(ss.referer)[1];
      if (ss.cookie && ss.referer) {
        headers['Referer'] = ss.referer;
        headers['cookie'] = ss.cookie;
        info += `=== 正对在第 ${(+i)+1} 个账号签到===\n`;
        //await getime().then (function(time){uxtime = time});
        //await enlogin;
        await signin().then (function(data){encryptphone = data});
        //await pageinfo().then (function(data){toreceive = data});
        //if (toreceive != 0) {
        //    await receivepts();
        //}
        //await sleep(Math.floor((Math.random() * 10000) + 2000));
        desp += info;
        info = '';
      } else {
        info += '请检查Cookie和Referer是否正确填写⚠️';
        console.log(`请检查Cookie和Referer是否正确填写⚠️`);
      }
    }
    info += desp;
    console.log(info);
    notify.sendNotify('和彩云', info);
  } else {
    info = '签到失败：请先获取Cookie⚠️';
    notify.sendNotify('和彩云', info);
  }
}

function signin() {
  url = 'https://caiyun.feixin.10086.cn:7071/portal/ajax/common/caiYunSignIn.action';
  headers['token'] = getoken();
  data = {"op":"code"};
  return new Promise(resolve => {
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: Qs.stringify(data)
    }).then(function(response) {
      return response.json()
    }).then(function(body) {
      if (body.msg.includes('success')) {
          encryptphone = body.result;
          console.log(`获取到的加密手机号为：${encryptphone}`);
          resolve(encryptphone);
      } else {
          info += "签到返回错误，请重新调试";
          console.log(info);
      }
    }).catch(function(e) {
        const error = '签到出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    })
  });
}

function pageinfo() {
  url = 'https://caiyun.feixin.10086.cn:7071/market/signin/page/info';
  headers['token'] = getoken();
  return new Promise(resolve => {
    fetch(url, {
      method: 'GET',
      headers: headers,
    }).then(function(response) {
      return response.json()
    }).then(function(body) {
      if (body.msg.includes('success')) {
          if (body.result.todaySignIn) {
              info += `签到成功，积分总计：${body.result.total}💰，本月已签到：${body.result.monthDays}天`;
              toreceive = body.result.toReceive;
              resolve(toreceive);
          } else {
              info += `今日还为签到，请查找原因`;
          }
      } else {
          info += "信息页面返回错误，请重新调试";
          console.log(info);
      }
    }).catch(function(e) {
        const error = '信息页面出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    })
  });
}

function receivepts() {
  url = 'https://caiyun.feixin.10086.cn:7071/market/signin/page/receive';
  headers['token'] = getoken();
  return new Promise(resolve => {
    fetch(url, {
      method: 'GET',
      headers: headers,
    }).then(function(response) {
      return response.json()
    }).then(function(body) {
      if (body.msg.includes('success')) {
          info += `收取${body.result.receive}积分成功，积分总计：${body.result.total}💰\n`;
      } else {
          info += "收取页面返回错误，请重新调试";
          console.log(info);
      }
    }).catch(function(e) {
        const error = '收取页面出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    }).finally(() => {
        resolve()
    })
  });
}

function endata(t){
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(pubbkey);
  encrypted = encrypt.encrypt(JSON.stringify(t));
  return encrypted
}

function getoken(){
  var headtoken = endata(parseInt(ss.account) + '-' + new Date().getTime());
  return headtoken
}

/*
function getime() {
  url = 'https://caiyun.feixin.10086.cn:7071/portal/ajax/tools/opRequest.action';
  data = {"op":"currentTimeMillis"};
  return new Promise(resolve => {
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: Qs.stringify(data)
    }).then(function(response) {
      return response.json()
    }).then(function(body) {
      if (body.msg.includes('success')) {
          time = body.result;
          resolve(time)
      } else {
          info += "获取时间返回错误，请重新调试";
          console.log(info);
      }
    }).catch(function(e) {
        const error = '获取时间出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    })
  });
}

function enlogin() {
  url = 'https://caiyun.feixin.10086.cn:7071/portal/auth/encryptDataLogin.action';
  data = {account:ss.account,encryptTime:uxtime};
  formdata = {data:endata(data),token:ss.token,op:"tokenLogin"};
  return new Promise(resolve => {
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: Qs.stringify(formdata)
    }).then(function(response) {
      return response.json()
    }).then(function(body) {
      if (body.code == 10000) {
          info += `加密登录成功\n`;
          console.log(body);
      } else {
          info += `加密登录返回错误调⚠️，信息如下：\n${JSON.stringify(body)}`;
          console.log(info);
      }
    }).catch(function(e) {
        const error = '加密登录出现错误，请检查⚠️';
        console.log(error + '\n' + e);
    }).finally(() => {
        resolve()
    })
  });
}
*/
module.exports = mcloud;
