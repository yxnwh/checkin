/*
19 8 * * * ck_juejin.js
*/
const utils = require('./utils');
const fetch = require('node-fetch');
const Env = utils.Env;
const $ = new Env('掘金');
const getData = utils.getData;
const notify = $.isNode() ? require('./sendNotify') : '';
const AsVow = getData().JUEJIN;
var desp = '';
var info = '';


const headers = {
  'content-type': 'application/json; charset=utf-8',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
  'referer': 'https://juejin.cn/'
};
const random = (max, min = 0) => Math.floor(Math.random() * (max - min + 1) + min);

juejin();

async function juejin() {
  if (AsVow) {
    for (i in AsVow) {
      cookie = AsVow[i].cookie;
      if (cookie) {
        info += `\n=== 正对在 第${i+1}个 账号签到===\n`;
        await get_point().then (function(data){yesterday_score = data});
        info += `昨日矿石数：${yesterday_score.data}\n`;
        await sign_in_status().then (function(data){res = data});
        if (res.err_no == 0) {
            if (res.data) {
                info += `今日已签到过啦！\n`;
            }else {
                 await sign_in();
            }
        }else {
            info += `签到失败！\n`;
        }
        await draw_status().then (function(data){res = data});
        if (res.err_no == 0) {
            if (res.data.free_count === 0) {
                info += `今日免费抽奖次数已用完！\n`;
            }else {
                 await draw();
            }
        }else {
            info += `查询免费抽奖接口异常！\n`;
        }
        await get_point().then (function(data){today_score = data});
        info += `当前矿石数：${today_score.data}\n`;
        await dip_lucky_users().then (function(data){list = data});
        index = random(list.data.lotteries.length - 1);
        await dip_lucky(list,index);
        desp += info;
        info = '';
      }
    }
    info += desp;
    console.log(info);
    notify.sendNotify('掘金', info);
  } else {
    info = '签到失败：请先获取Cookie⚠️';
    console.log(info);
    notify.sendNotify('掘金', info);
  }
}

function sign_in_status() {
    url = 'https://api.juejin.cn/growth_api/v1/get_today_status';
    headers['Cookie'] = cookie;
    return new Promise(resolve => {
      fetch(url, {
        method: 'GET',
        headers: headers,
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        resolve(body);
      }).catch(function(e) {
          const error = '获取签到状态出现错误，请检查⚠️\n';
          console.log(error + '\n' + e);
      })
    });
}

function sign_in() {
    url = 'https://api.juejin.cn/growth_api/v1/check_in';
    headers['Cookie'] = cookie;
    return new Promise(resolve => {
      fetch(url, {
        method: 'POST',
        headers: headers,
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        if (body.err_no !== 0) {
            info += `签到异常！\n`;
        } else {
            info += "签到成功！\n";
        }
        console.log(body);
      }).catch(function(e) {
          const error = '签到出现错误，请检查⚠️\n';
          console.log(error + '\n' + e);
      }).finally(() => {
          resolve()
      })
    });
}

function draw_status() {
    url = 'https://api.juejin.cn/growth_api/v1/lottery_config/get';
    headers['Cookie'] = cookie;
    return new Promise(resolve => {
      fetch(url, {
        method: 'GET',
        headers: headers,
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        resolve(body);
      }).catch(function(e) {
          const error = '获取抽奖状态出现错误，请检查⚠️\n';
          console.log(error + '\n' + e);
      })
    });
}

function draw() {
    url = 'https://api.juejin.cn/growth_api/v1/lottery/draw';
    headers['Cookie'] = cookie;
    return new Promise(resolve => {
      fetch(url, {
        method: 'POST',
        headers: headers,
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        if (body.err_no !== 0) {
            info += `免费抽奖异常，接口调用异常！\n`;
        } else {
            info += `获得奖励：${body.data.lottery_name}\n`;
        }
        console.log(body);
      }).catch(function(e) {
          const error = '抽奖出现错误，请检查⚠️\n';
          console.log(error + '\n' + e);
      }).finally(() => {
          resolve()
      })
    });
}

function dip_lucky_users() {
    url = 'https://api.juejin.cn/growth_api/v1/lottery_history/global_big';
    headers['Cookie'] = cookie;
    return new Promise(resolve => {
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ page_no: 1, page_size: 5 })
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        resolve(body);
      }).catch(function(e) {
          const error = '沾喜气获取用户列表出现错误，请检查⚠️\n';
          console.log(error + '\n' + e);
      })
    });
}

function dip_lucky(m,t) {
    url = 'https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky';
    headers['Cookie'] = cookie;
    return new Promise(resolve => {
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ lottery_history_id: m.data.lotteries[t].history_id })
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        if (body.err_no !== 0) {
            info += `可能是由于cookie导致的网络异常！\n`;
        }else { 
            if (body.data.has_dip && body.data.dip_action === 1) {
                info += `沾喜气成功！喜气值：${body.data.total_value}\n`;
            }
        }
        console.log(body);
      }).catch(function(e) {
          const error = '沾喜气出现错误，请检查⚠️\n';
          console.log(error + '\n' + e);
      }).finally(() => {
          resolve()
      })
    });
}

function get_point() {
    url = 'https://api.juejin.cn/growth_api/v1/get_cur_point';
    headers['Cookie'] = cookie;
    return new Promise(resolve => {
      fetch(url, {
        method: 'GET',
        headers: headers,
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        resolve(body);
      }).catch(function(e) {
          const error = '获取分数出现错误，请检查⚠️\n';
          console.log(error + '\n' + e);
      })
    });
}

module.exports = juejin;
