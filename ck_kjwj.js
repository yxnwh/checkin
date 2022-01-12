/*
37 7 * * * ck_jeotrip.js
在check.toml中添加如下，其中mobile为手机号，11位，token为32为的数字和字母组成，自己抓包
# 无忧行【APP】
[[JEGOTRIP]]
mobile = "13xxxxxxxxx"
token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
*/
const utils = require('./utils');
const Env = utils.Env;
const getData = utils.getData;
const $ = new Env('科技玩家');
const notify = $.isNode() ? require('./notify') : '';
const AsVow = getData().KJWJ;
var info = '';
var desp = '';
var token = '';


const headers = {
    'Host': 'www.kejiwanjia.com';
    'Referer': 'https://www.kejiwanjia.com/mission/today';
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
};

const data = {
    'nickname': '';
    'username': usr;
    'password': pwd;
    'code': '';
    'img_code': '';
    'invitation_code': '';
    'token': '';
    'smsToken': '';
    'luoToken': '';
    'confirmPassword': '';
    'loginType': ''
};


kjwj();

async function kjwj() {
  if (AsVow) {
    for (i in AsVow) {
      username = AsVow[i].username;
      password = AsVow[i].password;
      invalid = false;
      if (username && password) {
        head = `=== 正对在 ${username} 的账号签到===\n`;
        info += `\n${head}`;
        await getauth();
        if (invalid) {
          info += 'Token已失效‼️\n\n';
          continue;
        }
        await sign();
        desp += info;
        info = '';
      } 
    }
    info += desp;
//    notify.sendNotify('科技玩家', info);
  } else {
    info = '签到失败：请先获取Cookie⚠️';
    console.log(info);
//    notify.sendNotify('科技玩家', info);
  }
}


function getauth() {
  const url = 'https://www.kejiwanjia.com/wp-json/jwt-auth/v1/token';
  headers['Referer'] = 'Referer: https://www.kejiwanjia.com/';
  headers['Content-Type'] = 'application/x-www-form-urlencoded';
  const request = {
      url: url,
      headers: headers,
      body: data
  };
  return new Promise(resolve => {
    $.http.get(request)
      .then((resp) => {
        resdata = $.toObj(resp.body);
        info += `账号：${resdata.body.name}\n`;
        info += `账号：${resdata.body.name}\n`;
        info += `ID：${resdata.body.id}\n`;
        info += `金币：${resdata.body.credit}\n`;
        info += `等级：${resdata.body.lv.lv.name}\n`;
        token = resdata.body.token;
        console.log(info);
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


function sign() {
  const url = 'https://www.kejiwanjia.com/wp-json/b2/v1/userMission';
  headers['Origin'] = 'https://www.kejiwanjia.com/';
  headers['Authorization'] = `Bearer ${token}`;
  const request = {
      url: url,
      headers: headers
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then(async (resp) => {
        resdata = resp.body;
        console.log(resdata);
        console.log(typeof resdata);
        if ((typeof desp) == string) {
          info += `已经签到过啦~：获得${resdata}金币\n\n`
        }else{
          info += "每日首次签到成功：获得金币\n\n"
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

module.exports = kjwj;
