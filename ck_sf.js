/*
1 8 * * * ck_sfexpress.js
变量cookie只需要sessionId=xxxxxx即可
变量do_Treasure设置为false，即不参与夺宝活动，默认false。
变量white_list = '18元顺丰优惠券&13元顺丰优惠券&顺丰定制飞机模型&顺丰定制电动车模型'，仅参与white_list中的夺宝活动。
夺宝活动全部名称：18元顺丰优惠券,13元顺丰优惠券,8折同城券,顺丰定制三轮车车模,顺丰定制电动车模型,顺丰定制杜邦纸袋,顺丰定制飞机模型,顺丰升级版杜邦袋,顺丰定制营业厅积木,纪梵希口红套装,iPhone13,KT45周年盲盒,Kakao系列盲盒,顺丰定制车模,九号平衡车
*/
const utils = require('./utils');
const fetch = require('node-fetch');
const Env = utils.Env;
const $ = new Env('顺丰速运');
const getData = utils.getData;
const sleep = utils.sleep;
const notify = $.isNode() ? require('./sendNotify') : '';
const AsVow = getData().SFEXPRESS;
var desp = '';
var info = '';

const headers = {
    'Host': 'mcs-mimp-web.sf-express.com',
    'Content-Type': 'application/json;charset=utf-8',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 mediaCode=SFEXPRESSAPP-iOS-ML'
};

sfexpress();

async function sfexpress() {
    if (AsVow) {
        for (i in AsVow) {
            do_Treasure = AsVow[i].dotreasure;
            white_list = AsVow[i].whitelist.split("&");
            headers['Cookie'] = AsVow[i].cookie;
            info +=`=== 正对在第 ${i+1} 个账号签到===\n`;
            /*await normsign();
            await sleep(Math.floor((Math.random() * 5000) + 5000));
            await surpsign();
            await sleep(Math.floor((Math.random() * 5000) + 5000));
            await do_lottery();
            await sleep(Math.floor((Math.random() * 5000) + 5000));*/
            await task_list().then (function(data){list1 = data});
            for (i in list1) {
               taskId = list1[i].taskId;
               strategyId = list1[i].strategyId;
               taskCode = list1[i].taskCode;
               title = list1[i].description;
               taskPeriod = list1[i].taskPeriod;
               if (title.includes('邀请')) {
                   continue;
               } else if (taskPeriod.includes('D')){
                   //await do_mission(title, taskCode);
                   //console.log(i);
                   await reward_mission(title, strategyId, taskId, taskCode);
                   console.log(i+00);
                   await sleep(Math.floor((Math.random() * 5000) + 5000));
               }
               desp += info;
               info = '';
            }
            /*await sleep(Math.floor((Math.random() * 5000) + 5000));
            if (do_Treasure == "true") {
                await treasure_list().then (function(data){list2 = data});
                if (list2 != ""){
                   for (i in list2) {
                      pkgName = list2[i].pkgName;
                      flowId = list2[i].flowId;
                      if (pkgName in white_list) {
                          await treasure(flowId, pkgName);
                      } else {
                          continue;
                      }
                      desp += info;
                      info = '';
                   }
                }
            }*/
            desp += info;
            info = '';
        }
        info = desp;
        console.log(info);
        notify.sendNotify('顺丰速运', info);
    } else {
        info = '签到失败：请先获取Cookie⚠️';
        notify.sendNotify('顺丰速运', info);
    }
}

//普通签到
function normsign() {
    url = 'https://mcs-mimp-web.sf-express.com/mcs-mimp/integralTaskSignService/automaticSignFetchPackage';
    body = {"comeFrom":"vioin","channelFrom":"SFAPP"};
    return new Promise(resolve => {
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        if (body.success) {
            if (body.obj.hasFinishSign == 0) {
              info += `首次签到成功\n今日获得 ${body.obj.integralTaskSignPackageVOList[0].detailValue} 分\n连续签到 ${body.obj.countDay} 天\n`;
            } else {
              info += `今日已签到过啦~\n`;
            }
        } else {
             info += "普通签到返回错误，请重新调试\n";
             console.log(info);
        }
      }).catch(function(e) {
          const error = '普通签到出现错误，请检查⚠️\n';
          console.log(error + '\n' + e);
      }).finally(() => {
          resolve()
      })
    });
}

//超值福利签到
function surpsign() {
    url = 'https://mcs-mimp-web.sf-express.com/mcs-mimp/commonPost/~memberActLengthy~redPacketActivityService~superWelfare~receiveRedPacket';
    //headers['Cookie'] = cookie;
    body = {"channel":"SignIn"};
    return new Promise(resolve => {
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        if (body.success) {
            list = body.obj.giftList;
            for (i in list) {
                prize = list[i].giftName;
                info += `超值福利签到成功\n获得 ${prize} 奖励\n`;
            }
        } else {
            info += "超值签到返回错误，请重新调试\n";
            console.log(info);
        }
      }).catch(function(e) {
          const error = '超值签到返回错误，请检查⚠️\n';
          console.log(error + '\n' + e);
      }).finally(() => {
          resolve()
      })
    });
}

//获取任务列表
function task_list() {
    url = 'https://mcs-mimp-web.sf-express.com/mcs-mimp/commonPost/~memberNonactivity~integralTaskStrategyService~queryPointTaskAndSignFromES';
    //headers['Cookie'] = cookie;
    body = {"channelType":"1"};
    return new Promise(resolve => {
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        list = body.obj.taskTitleLevels;
        resolve(list);
      }).catch(function(e) {
          const error = '超值签到返回错误，请检查⚠️';
          console.log(error + '\n' + e);
      })
    });
}

//做任务
function do_mission(title, taskCode) {
    url = `https://mcs-mimp-web.sf-express.com/mcs-mimp/task/finishTask?id=${taskCode}`;
    //headers['Cookie'] = cookie;
    delete headers['Content-Type'];
    return new Promise(resolve => {
      fetch(url, {
        method: 'GET',
        headers: headers
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        if (body.success) {
             info += `执行 ${title} 任务，等待20秒\n`;
             sleep(Math.floor((Math.random() * 20000) + 5000));
        } else {
             info += `执行 ${title} 任务出现错误，请重新调试\n`;
             console.log(info);
        }
      }).catch(function(e) {
          const error = `执行 ${title} 任务返回错误，请检查⚠️\n`;
          console.log(error + '\n' + e);
      }).finally(() => {
          resolve()
      })
    });
}

//抽奖任务
function do_lottery() {
    url = 'https://mcs-mimp-web.sf-express.com/mcs-mimp/lottery/receiveCoupon';
    //headers['Cookie'] = cookie;
    body = {"channel":"SFAPP"};
    return new Promise(resolve => {
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        if (body.success) {
             info += `执行抽奖任务，获得 ${body.obj.giftName} 奖励\n`;
        }
      }).catch(function(e) {
          const error = `执行抽奖任务返回错误，请检查⚠️\n`;
          console.log(error + '\n' + e);
      }).finally(() => {
          resolve()
      })
    });
}

//领取奖励
function reward_mission (title, strategyId, taskId, taskCode) {
    url = 'https://mcs-mimp-web.sf-express.com/mcs-mimp/commonPost/~memberNonactivity~integralTaskStrategyService~fetchIntegral';
    //headers['Cookie'] = cookie;
    body = `{"strategyId":${strategyId}, "taskId":${taskId}, "taskCode":${taskCode}}`;
    return new Promise(resolve => {
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        if (body.success) {
            info += `执行 ${title} 任务成功，领取 ${body.obj.point} 积分\n`;
        } else if (body.errorMessage.includes('已领取')){
            info += `${title} 任务已完成\n`;
        } else {
            info += `任务异常，显示${body.errorMessage}\n`;
        }
      }).catch(function(e) {
          const error = `领取 ${title} 任务积分返回错误，请检查⚠️\n`;
          console.log(error + '\n' + e);
      }).finally(() => {
          resolve()
      })
    });
}

//夺宝活动列表
function treasure_list() {
    url = 'https://mcs-mimp-web.sf-express.com/mcs-mimp/commonPost/~memberNonactivity~integralTreasureService~queryHomePageInfo';
    //headers['Cookie'] = cookie;
    body = {};
    return new Promise(resolve => {
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        if (body.success) {
            list = body.obj.activityInfoList;
        } else {
            list = '';
        }
        resolve(list);
        /*for (i in list) {
            pkgName = list[i].pkgName;
            flowId = list[i].flowId;
            if (pkgName in white_list) {
                await treasure(flowId, pkgName);
            } else {
                continue;
            }
        }*/       
      }).catch(function(e) {
          const error = `执行抽奖任务返回错误，请检查⚠️\n`;
          console.log(error + '\n' + e);
      })
    });
}

//参与夺宝活动
function treasure(flowId, pkgName) {
    url = 'https://mcs-mimp-web.sf-express.com/mcs-mimp/commonPost/~memberNonactivity~integralTreasureService~partakeTreasure';
    //headers['Cookie'] = cookie;
    body = `{"flowId":${flowId}, "partakeNums":1, "points":9}`;
    return new Promise(resolve => {
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      }).then(function(response) {
        return response.json()
      }).then(function(body) {
        if (body.success) {
            info += `参与 ${pkgName} 夺宝成功，消耗9积分\n`;
            sleep(3000);
        }
      }).catch(function(e) {
          const error = `执行夺宝任务返回错误，请检查⚠️\n`;
          console.log(error + '\n' + e);
      }).finally(() => {
          resolve()
      })
    });
}

module.exports = sfexpress;
