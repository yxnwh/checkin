/*
* @url: https://raw.githubusercontent.com/BlueSkyClouds/Script/master/nodejs/iQIYI-bak.js
* @author: BlueSkyClouds
登录网页获取cookie，将cookie全部字段写入cookie
28 8 * * * ck_iqiyi.js
*/
const crypto = require('crypto-js');
const utils = require('./utils');
const Env = utils.Env;
const getData = utils.getData;
const $ = new Env('爱奇艺');
const notify = $.isNode() ? require('./notify') : '';
const AsVow = getData().IQIYI;

var cookie = '';

let P00001 = ''; //无需填写 自动取cookie内容拆分
let P00003 = ''; //无需填写 自动取cookie内容拆分
let dfp = '';    //无需填写 自动取cookie内容拆分


var LogDetails = false; // 响应日志

var $nobyda = nobyda();
var desp = '';
var info = '';

iqiyi();

async function iqiyi() {
  if (AsVow) {
    for (i in AsVow) {
        cookie = AsVow[i].cookie;
        if(cookie.includes("__dfp") && cookie.includes("P00001") && cookie.includes("P00003")){
           dfp = cookie.match(/__dfp=(.*?)@/)[1];
           P00001 = cookie.match(/P00001=(.*?);/)[1];
           P00003 = cookie.match(/P00003=(.*?);/)[1];
        }
        if (P00001 !== "" && P00003 !== "" && dfp !== "") {
          await Checkin();
          await WebCheckin();
          for (let i = 0; i < 3; i++){
              const run = await Lottery(i);
              if (run) {
                  await new Promise(r => setTimeout(r, 1000));
              } else {
                  break
              }
          }
          const tasks = await getTaskList();
          for (let i = 0; i < tasks.length; i++){
              if (![1, 4].includes(tasks[i].status)) { //0：待领取 1：已完成 2：未开始 4：进行中
                  await joinTask(tasks[i]);
                  await notifyTask(tasks[i]);
                  await new Promise(r => setTimeout(r, 1000));
                  await getTaskRewards(tasks[i]);
              }
          }
          await login();
          await $nobyda.time();
          desp += info;
          info = '';
        } else {
          info += 'Cookie缺少关键值，需重新获取';
          console.log("爱奇艺", "", info);
        }
        info += desp;
        notify.sendNotify('爱奇艺', info);
    }
  }else {
    info += '签到失败：请先获取Cookie⚠️';
    console.log("爱奇艺会员", "", info);
    notify.sendNotify('爱奇艺', info);
  }
}

function login() {
  return new Promise(resolve => {
    var URL = {
      url: 'https://serv.vip.iqiyi.com/vipgrowth/query.action?P00001=' + P00001,
    }
    $nobyda.get(URL, function(error, response, data) {
      const obj = JSON.parse(data)
      const Details = LogDetails ? data ? `response:\n${data}` : '' : ''
      if (!error && obj.code === "A00000" ) {
        const level = obj.data.level  // VIP等级
        const growthvalue = obj.data.growthvalue  // 当前 VIP 成长值
        const distance = obj.data.distance  // 升级需要成长值
        let deadline = obj.data.deadline  // VIP 到期时间
        const today_growth_value = obj.data.todayGrowthValue
        if(deadline === undefined){deadline = "非 VIP 用户"}
        $nobyda.expire = ("\nVIP 等级: " + level + "\n当前成长值: " + growthvalue + "\n升级需成长值: " + distance + "\n今日成长值: " + today_growth_value + "\nVIP 到期时间: " + deadline)
        LoginMsg = `爱奇艺-查询成功: ${$nobyda.expire} ${Details}\n`;
        info += LoginMsg
        console.log(LoginMsg);
      } else {
        LoginMsg = `爱奇艺-查询失败${error || ': 无到期数据 ⚠️'} ${Details}\n`;
        info += LoginMsg
        console.log(LoginMsg);
      }
      resolve()
    })
  })
}

function Checkin() {
    const timestamp = new Date().getTime();
    const stringRandom = (length) => {
        var rdm62, ret = '';
        while (length--) {
            rdm62 = 0 | Math.random() * 62;
            ret += String.fromCharCode(rdm62 + (rdm62 < 10 ? 48 : rdm62 < 36 ? 55 : 61))
        }
        return ret;
    };
    return new Promise(resolve => {
        const sign_date = {
            agentType: "1",
            agentversion: "1.0",
            appKey: "basic_pcw",
            authCookie: P00001,
            qyid: md5(stringRandom(16).toString()),
            task_code: "natural_month_sign",
            timestamp: timestamp,
            typeCode: "point",
            userId: P00003,
        };
        const post_date = {
            "natural_month_sign": {
                "agentType": "1",
                "agentversion": "1",
                "authCookie": P00001,
                "qyid": md5(stringRandom(16).toString()),
                "taskCode": "iQIYI_mofhr",
                "verticalCode": "iQIYI"
            }
        };
        const sign = k("UKobMjDMsDoScuWOfp6F", sign_date, {
            split: "|",
            sort: !0,
            splitSecretKey: !0
        });
        var URL = {
            url: 'https://community.iqiyi.com/openApi/task/execute?' + w(sign_date) + "&sign=" + sign,
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(post_date)
        }
        $nobyda.post(URL, function(error, response, data) {
            let CheckinMsg, rewards = [];
            const Details = LogDetails ? `msg:\n${data||error}` : '';
            try {
                if (error) throw new Error(`接口请求出错 ‼️`);
                const obj = JSON.parse(data)
                if (obj.code === "A00000") {
                    if (obj.data.code === "A0000") {
                        for(let i = 0; i < obj.data.data.rewards.length; i++) {
                            if (obj.data.data.rewards[i].rewardType === 1) {
                                rewards.push(`成长值+${obj.data.data.rewards[i].rewardCount}`)
                            } else if (obj.data.data.rewards[i].rewardType === 2) {
                                rewards.push(`VIP天+${obj.data.data.rewards[i].rewardCount}`)
                            } else if (obj.data.data.rewards[i].rewardType === 3) {
                                rewards.push(`积分+${obj.data.data.rewards[i].rewardCount}`)
                            }
                          }
                        var continued = obj.data.data.signDays;
                        CheckinMsg = `爱奇艺app签到: ${rewards.join(", ")}${rewards.length<3?`, 累计签到${continued}天`:``} 🎉\n`;
                    } else {
                        CheckinMsg = `爱奇艺app签到: ${obj.data.msg} ⚠️\n`;
                    }
                } else {
                    CheckinMsg = `爱奇艺app签到: Cookie无效 ⚠️\n`;
                }
            } catch (e) {
                CheckinMsg = `爱奇艺app签到: ${e.message||e}\n`;
            }
            info += CheckinMsg
            console.log(`爱奇艺-${CheckinMsg} ${Details}\n`);
            resolve()
        })
    })
}
     
function WebCheckin() {
    return new Promise(resolve => {
        const web_sign_date = {
            agenttype: "1",
            agentversion: "0",
            appKey: "basic_pca",
            appver: "0",
            authCookie: P00001,
            channelCode: "sign_pcw",
            dfp: dfp,
            scoreType: "1",
            srcplatform: "1",
            typeCode: "point",
            userId: P00003,
            // user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
            verticalCode: "iQIYI"
        };

        const sign = k("DO58SzN6ip9nbJ4QkM8H", web_sign_date, {
            split: "|",
            sort: !0,
            splitSecretKey: !0
        });
        var URL = {
            url: 'https://community.iqiyi.com/openApi/score/add?' + w(web_sign_date) + "&sign=" + sign
        }
        $nobyda.get(URL, function(error, response, data) {
            let WebCheckinMsg = '';
            const Details = LogDetails ? `msg:\n${data||error}` : ''
            try {
                if (error) throw new Error(`接口请求出错 ‼️\n`);
                const obj = JSON.parse(data)
                if (obj.code === "A00000") {
                    if (obj.data[0].code === "A0000") {
                        var quantity = obj.data[0].score;
                        var continued = obj.data[0].continuousValue;
                        WebCheckinMsg = `爱奇艺网页签到: 积分+${quantity}, 累计签到${continued}天 🎉\n`
                    } else {
                        WebCheckinMsg = `爱奇艺网页签到: ${obj.data[0].message} ⚠️\n`
                    }
                } else {
                    WebCheckinMsg = `爱奇艺网页签到: ${obj.message||'未知错误'} ⚠️\n`
                }
            } catch (e) {
                WebCheckinMsg = `爱奇艺网页签到: ${e.message || e}\n`;
            }
            info += WebCheckinMsg
            console.log(`爱奇艺-${WebCheckinMsg} ${Details}\n`);
            resolve()
        })
    })
}

function Lottery(s) {
    return new Promise(resolve => {
        const URL = {
            url: 'https://iface2.iqiyi.com/aggregate/3.0/lottery_activity?app_k=0&app_v=0&platform_id=0&dev_os=0&dev_ua=0&net_sts=0&qyid=0&psp_uid=0&psp_cki=' + P00001 + '&psp_status=0&secure_p=0&secure_v=0&req_sn=0'
        }
        $nobyda.get(URL, async function(error, response, data) {
            const Details = LogDetails ? `msg:\n${data||error}` : ''
            let LotteryMsg;
            try {
                if (error) throw new Error("接口请求出错 ‼️");
                const obj = JSON.parse(data);
                $nobyda.last = !!data.match(/(机会|已经)用完/)
                if (obj.awardName && obj.code === 0) {
                    LotteryMsg = `爱奇艺app抽奖: ${!$nobyda.last ? `${obj.awardName.replace(/《.+》/, "未中奖")} 🎉` : `您的抽奖次数已经用完 ⚠️`}\n`
                } else if (data.match(/\"errorReason\"/)) {
                    const msg = data.match(/msg=.+?\)/) ? data.match(/msg=(.+?)\)/)[1].replace(/用户(未登录|不存在)/, "Cookie无效") : ""
                    LotteryMsg = `爱奇艺app抽奖: ${msg || `未知错误`} ⚠️\n`
                } else {
                    LotteryMsg = `爱奇艺app抽奖: ${data}\n`
                }
            } catch (e) {
                LotteryMsg = `爱奇艺app抽奖: ${e.message || e}\n`;
            }
            console.log(`爱奇艺-${LotteryMsg} (${s+1}) ${Details}\n`)
            info += LotteryMsg;
            if (!$nobyda.last) {
                resolve(1)
            } else {
                resolve()
            }
        })
    })
}

function getTaskList() {
    return new Promise(resolve => {
        $nobyda.get(`https://tc.vip.iqiyi.com/taskCenter/task/queryUserTask?P00001=${P00001}`, function(error, response, data) {
            let taskListMsg, taskList = [];
            const Details = LogDetails ? `msg:\n${data||error}` : '';
            try {
                if (error) throw new Error(`请求失败`);
                const obj = JSON.parse(data);
                if (obj.code === 'A00000' && obj.data && obj.data.tasks) {
                    Object.keys(obj.data.tasks).map((group) => {
                        (obj.data.tasks[group] || []).map((item) => {
                            taskList.push({
                                name: item.taskTitle,
                                taskCode: item.taskCode,
                                status: item.status
                            })
                        })
                    })
                    taskListMsg = `获取成功!`;
                } else {
                    taskListMsg = `获取失败!`;
                }
            } catch (e) {
                taskListMsg = `${e.message||e} ‼️`;
            }
            console.log(`爱奇艺-任务列表: ${taskListMsg} ${Details}\n`)
            resolve(taskList)
        })
    })
}

function joinTask(task) {
    return new Promise(resolve => {
        $nobyda.get('https://tc.vip.iqiyi.com/taskCenter/task/joinTask?taskCode=' + task.taskCode + '&lang=zh_CN&platform=0000000000000000&P00001=' + P00001, function (error, response, data) {
            let joinTaskMsg, Details = LogDetails ? `msg:\n${data||error}` : '';
            try {
                if (error) throw new Error(`请求失败`);
                const obj = JSON.parse(data);
                joinTaskMsg = obj.code || '领取失败';
            } catch (e) {
                joinTaskMsg = `错误 ${e.message||e}\n`;
            }
            console.log(`爱奇艺-领取任务: ${task.name} => ${joinTaskMsg} ${Details}\n`)
            resolve()
        })
    })
}

function notifyTask(task) {
    return new Promise(resolve => {
        $nobyda.get('https://tc.vip.iqiyi.com/taskCenter/task/notify?taskCode=' + task.taskCode + '&lang=zh_CN&platform=0000000000000000&P00001=' + P00001, function (error, response, data) {
            let notifyTaskMsg, Details = LogDetails ? `msg:\n${data||error}` : '';
            try {
                if (error) throw new Error(`请求失败`);
                const obj = JSON.parse(data);
                notifyTaskMsg = obj.code || '失败';
            } catch (e) {
                notifyTaskMsg = e.message || e;
            }
            console.log(`爱奇艺-开始任务: ${task.name} => ${notifyTaskMsg} ${Details}\n`)
            resolve()
        })
    })
}

function getTaskRewards(task) {
    return new Promise(resolve => {
        $nobyda.get('https://tc.vip.iqiyi.com/taskCenter/task/getTaskRewards?taskCode=' + task.taskCode + '&lang=zh_CN&platform=0000000000000000&P00001=' + P00001, function (error, response, data) {
            let RewardsMsg;
            const Details = LogDetails ? `msg:\n${data||error}` : ''
            try {
                if (error) throw new Error(`接口请求出错 ‼️`);
                const obj = JSON.parse(data)
                if (obj.msg === "成功" && obj.code === "A00000" && obj.dataNew[0] !== undefined) {
                    RewardsMsg = `奖励: ${task.name}=>${obj.dataNew[0].name + obj.dataNew[0].value} 🎉\n`
                } else {
                    RewardsMsg = `奖励: ${task.name}=>${obj.msg!==`成功`&&obj.msg||`未完成`} ⚠️\n`
                }
            } catch (e) {
                RewardsMsg = `奖励: ${e.message||e}\n`;
            }
            info += RewardsMsg
            console.log(`爱奇艺-${RewardsMsg} ${Details}\n`)
            resolve()
        })
    })
}

function nobyda() {
  const times = 0
  const start = Date.now()
  const node = (() => {
    const request = require('request');
    return ({
      request
    })
  })()
  const adapterStatus = (response) => {
    if (response) {
      if (response.status) {
        response["statusCode"] = response.status
      } else if (response.statusCode) {
        response["status"] = response.statusCode
      }
    }
    return response
  }
  const get = (options, callback) => {
      node.request(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
  }
  const post = (options, callback) => {
      node.request.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
  }

  const log = (message) => console.log(message)
  const time = () => {
    const end = ((Date.now() - start) / 1000).toFixed(2)
    return console.log('\n签到用时: ' + end + ' 秒')
  }

  return {
    get,
    post,
    log,
    time,
    times,
  }
};

function isJSON_test(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            //console.log('转换成功：'+obj);
            return true;
        } catch(e) {
            console.log('no json');
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    //console.log('It is not a string!')
}

function md5(t) {
    return crypto.MD5(t).toString();
}

function k(e, t) {
  var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
    , n = a.split
    , c = void 0 === n ? "|" : n
    , r = a.sort
    , s = void 0 === r || r
    , o = a.splitSecretKey
    , i = void 0 !== o && o
    , l = s ? Object.keys(t).sort() : Object.keys(t)
    , u = l.map((function (e) {
      return "".concat(e, "=").concat(t[e])
    }
    )).join(c) + (i ? c : "") + e;
  return md5(u)
}
function w(){
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
    , t = [];
  return Object.keys(e).forEach((function (a) {
    t.push("".concat(a, "=").concat(e[a]))
  }
  )),
    t.join("&")
}

module.exports = iqiyi;
