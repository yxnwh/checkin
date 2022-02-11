/*
3-59/32 7 * * * ck_10000.js
*/
const utils = require('./utils');
const Env = utils.Env;
const getData = utils.getData;
const $ = new Env('中国电信')
$.CryptoJS = require('crypto-js')
const notify = require('./notify');
const JSEncrypt = require('./jsencrypt-3.0-mod.js');
const AsVow = getData().DIANXIN;
var info = '';
var desp = '';

const headers = {
    'Content-Type': 'application/json;charset=UTF-8'
};

const pubbkey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+ugG5A8cZ3FqUKDwM57GM4io6JGcStivT8UdGt67PEOihLZTw3P7371+N47PrmsCpnTRzbTgcupKtUv8ImZalYk65dU8rjC/ridwhw9ffW2LBwvkEnDkkKKRi2liWIItDftJVBiWOh17o6gfbPoNrWORcAdcbpk2L+udld5kZNwIDAQAB";

dianxin();

async function dianxin() {
  if (AsVow) {
    for (i in AsVow) {
        phone = AsVow[i].phone;
        if (phone) {
          head = `== 对 ${phone} 账号签到==\n`;
          info += `\n${head}`;
          await signapp();
          await coinfo();
          desp += info;
          info = '';
        }
    }
    info += desp;
    console.log(info);
    notify.sendNotify('中国电信', info);
  }else {
    info = '签到失败：请先获取Cookie⚠️';
    console.log(info);
    notify.sendNotify('中国电信', info);
  }
}

function signapp() {
    const bodystr = `{"phone":"${phone}","date":${new Date().getTime()},"sysType":"20004"}`;
    const request = {
        url: 'https://wapside.189.cn:9001/jt-sign/api/home/sign',
        headers: headers,
        body: JSON.stringify({ encode: encrypt(bodystr) })
    };
    return new Promise((resolve) => {
      $.http.post(request)
        .then((resp) => {
            data = JSON.parse(resp.body);
            if (data.data.msg.includes('成功')) {
                info += `每日首次签到成功：金豆 +${data.data.coin}🎉\n已连续签到：+${data.data.continuousDay}天🎉\n本月已签到：+${data.data.totalDay}天🎉\n`;
            }else {
                info += `${data.data.msg}⚠️\n`;
            }
        })
        .catch((err) => {
            const error = '签到状态获取失败⚠️';
            console.log(error + '\n' + err);
            notify.sendNotify('中国电信', head + error + '\n' +'请查看日志‼️');
        })    
        .finally(() => {
            resolve();
        })
      });
}

function coinfo() {
    const bodystr = {"phone":phone};
    const request = {
        url: 'https://wapside.189.cn:9001/jt-sign/api/home/userCoinInfo',
        headers: headers,
        body: enphone(bodystr)
    };
    return new Promise((resolve) => {
      $.http.post(request)
        .then((resp) => {
            data = JSON.parse(resp.body);
            if (data.resoultMsg.includes('成功')) {
                info += `共有金豆：${data.totalCoin}🎉\n`;
            }else {
                info += `${data.resoultMsg}⚠️\n`;
            }
        })
        .catch((err) => {
            const error = '金豆状态获取失败⚠️';
            console.log(error + '\n' + err);
            notify.sendNotify('中国电信', head + error + '\n' +'请查看日志‼️');
        })    
        .finally(() => {
            resolve();
        })
      });
}

function enphone(t){
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(pubbkey);
  encrypted = encrypt.encode(JSON.stringify(t));
  data = {para:encrypted};
  return JSON.stringify(data);
}

function encrypt(t) {
  const srcs = $.CryptoJS.enc.Utf8.parse(t);
  const key = $.CryptoJS.enc.Utf8.parse('34d7cb0bcdf07523');
  const encrypted = $.CryptoJS.AES.encrypt(srcs, key, { mode: $.CryptoJS.mode.ECB, padding: $.CryptoJS.pad.Pkcs7 });
  return $.CryptoJS.enc.Hex.stringify($.CryptoJS.enc.Base64.parse(encrypted.toString()))
}

/*
function decrypt(t){
	var e = $.CryptoJS.enc.Hex.parse(t),
		i = $.CryptoJS.enc.Base64.stringify(e);
	return $.CryptoJS.AES.decrypt(i, n,
	{
		mode: $.CryptoJS.mode.ECB,
		padding: $.CryptoJS.pad.Pkcs7
	}).toString($.CryptoJS.enc.Utf8).toString()
};
*/
module.exports = dianxin;
