/*
8 8 * * * ck_pupu.js
*/
const utils = require('./utils');
const Env = utils.Env;
const $ = new Env('朴朴超市');
const getData = utils.getData;
const fetch = require('node-fetch');
const notify = $.isNode() ? require('./sendNotify') : '';

const AsVow = getData().PUPU;
var info = '';

const headers = {'Host':'','User-Agent':''};

if (AsVow) {
    for (i in AsVow) {
        token = AsVow[i].token;
        pre_token = {'refresh_token': token};
        head = `=== 正对在第1个账号签到===\n`;
        info += `\n${head}`;
        url = 'https://cauth.pupuapi.com/clientauth/user/refresh_token';
        headers['Content-Type'] = 'application/json; charset=utf-8';
        headers['Host'] = 'cauth.pupuapi.com';
        headers['User-Agent'] = 'Pupumall/2.8.4;iOS 14.2.1;08E4D5FA-7C49-4411-A4EF-588BBB814259'; //修改为自己的ua
        fetch(url, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(pre_token)
          })
        .then(function(response) {
          return response.json()
        })
        .then(function(body) {
          if (body.errcode == 0) {
            true_token = body.data.access_token;
            info += `用户名：${body.data.nick_name}\n`;
            url2 = 'https://j1.pupuapi.com/client/game/sign/v2?city_zip=440300&supplement_id=';//******抓取自己的city_zip,否则可能导致签到不成功******
            delete headers['Content-Type'];
            headers['Origin'] = 'https://ma.pupumall.com';
            headers['Host'] = 'j1.pupuapi.com';
            headers['Referer'] = 'https://ma.pupumall.com/';
            headers['Authorization'] = `Bearer ${true_token}`;
            headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 D/08E4D5FA-7C49-4411-A4EF-588BBB814259';//修改为自己的ua
            fetch(url2, {
              method: 'POST',
              headers: headers
              })
            .then(function(response2) {
              return response2.json()
            })
            .then(function(body2) {
              if (body2.errcode == 0) {
                info += `每日首次签到成功：获得${body2.data.daily_sign_coin}积分\n`;
                console.log(info);
                notify.sendNotify('朴朴超市', info);
              } else if (body2.errcode == 350011) {
                info += `今日已经签到，无法重复签到～\n`;
                console.log(info);
                notify.sendNotify('朴朴超市', info);
              } else {
                info += `${body2}\n`;
                console.log(info);
                notify.sendNotify('朴朴超市', info);
              }
            })
            .catch(function(e2) {
              info += "oops 签到 error" + e2;
              console.log(info);
              notify.sendNotify('朴朴超市', info);
            });
          } else {
            info += `${body}\n`;
            console.log(info);
            notify.sendNotify('朴朴超市', info);
          }
        })
        .catch(function(e) {
          info += "oops cauth error" + e;
          console.log(info);
          notify.sendNotify('朴朴超市', info);
        });
    }
}

module.exports = pupu;
