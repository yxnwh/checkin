/*
3-59/32 7 * * * ck_10000.js
*/
const utils = require('./utils');
const Env = utils.Env;
const getData = utils.getData;
const $ = new Env('中国电信')
$.CryptoJS = require('crypto-js')
const notify = require('./notify');
const AsVow = getData().DIANXIN;
var info = '';
var desp = '';

const headers = {
    'Content-Type': 'application/json;charset=UTF-8'
};

dianxin();

async function dianxin() {
  if (AsVow) {
    for (i in AsVow) {
        phone = AsVow[i].phone;
        if (phone) {
          head = `== 对 ${phone} 账号签到==\n`;
          info += `\n${head}`;
          await signapp()
          //await gethomeinfo()
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
    const bodystr = `{"phone":"${phone}","date":${new Date().getTime()},"sysType":"20004"}`
    const body = JSON.stringify({ encode: encrypt(bodystr) })
    const request = {
        url: 'https://wapside.189.cn:9001/jt-sign/api/home/sign',
        headers: headers,
        body: body
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

/*
function gethomeinfo() {
    return new Promise((resolve) => {
    const bodystr = `{"phone":"${phone}"}`
    const body = JSON.stringify({ encode: encrypt(bodystr) })
	const url = { url: 'https://wapside.189.cn:9001/jt-sign/api/exchange/homeInfo', body, headers: {} }
    url.headers['Content-Type'] = 'application/json;charset=UTF-8'
	if (!homebody)
        {
            resolve()
            return;
        }
	$.post(url, (err, resp, data) => {
		   try {
		       const _data = JSON.parse(data);
			   if  (_data.resoultCode == "0") 
			   {
				  $.info.signs[0].homeinfo = `金币总数：${_data.data.userInfo.totalCoin}`  
			   } else
			   {
				  $.info.signs[0].homeinfo = `获取金币信息失败：${_data.resoultMsg}`;  
			   }
		   } catch (e) {
		       $.info.signs[0].homeinfo = `获取金币信息失败：${e.message}`;
		   } finally {
           resolve()
       }
	   })
	})
}
*/

function encrypt(t) {
  const srcs = $.CryptoJS.enc.Utf8.parse(t)
  const key = $.CryptoJS.enc.Utf8.parse('34d7cb0bcdf07523')
  const encrypted = $.CryptoJS.AES.encrypt(srcs, key, { mode: $.CryptoJS.mode.ECB, padding: $.CryptoJS.pad.Pkcs7 })
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
module.exports = dianxin;
