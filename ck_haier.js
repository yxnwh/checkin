/*
1 8 * * * ck_haier.js
*/
const utils = require('./utils');
const Env = utils.Env;
const $ = new Env('海尔');
const getData = utils.getData;
const fetch = require('node-fetch');
const notify = $.isNode() ? require('./sendNotify') : '';

const AsVow = getData().HAIER;
var info = '';

const headers = {
	'Host': 'zj.haier.net',
  'Content-Type': 'application/json',
	'User-Agent': 'Uplus/7.8.0 (iPhone; iOS 14.2.1; Scale/3.00)'
};

haier();

function haier() {
    if (AsVow) {
        for (i in AsVow) {
            token = AsVow[i].token;
            head = `=== 正对在第1个账号签到===\n`;
            info += `\n${head}`;
            url = 'https://113.16.212.181/zjapi/zjBaseServer/daily/sign';
            headers['accountToken'] = token;
            body = {};
            fetch(url, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(body)
              })
            .then(function(response) {
              return response.json()
            })
            .then(function(body) {
              if (body.retInfo)
            })
            .catch(function(e) {
              info += "oops cauth error" + e;
              console.log(info);
              notify.sendNotify('朴朴超市', info);
            });
        }
    }
}
module.exports = haier;
