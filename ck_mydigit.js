   
/*
41 7 * * * ck_mydigit.js
*/
const axios = require("axios");
const utils = require('./utils');
const Env = utils.Env;
const getData = utils.getData;
const $ = new Env('数码之家');
const notify = $.isNode() ? require('./notify') : '';
const cookie = getData().MYDIGIT;

var formhash = null
var message = ""

const rules = {
    name: "【数码之家】：",
    url: "https://www.mydigit.cn/plugin.php?id=k_misign:sign&mobile=2", //用于获取formhash的链接
    cookie: cookie,
    formhash: 'formhash=(.+?)"', //formhash正则
    verify: "您需要先登录才能继续本操作", //验证cookie状态
    op: [{
        name: "签到",
        method: "get", //签到请求方式 get/post
        url: "https://www.mydigit.cn/plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=@formhash"
    }]
};

function mydigit(rules) {
    return new Promise(async (resolve) => {
        try {
            const header = {
                headers: {
                    cookie: rules.cookie,
                    referer: rules.url,
                    User-Agent: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
                }
            };
            message = rules.op.length > 1 ? "\n" : ""
            res = await axios.get(rules.url, header);         
            console.log(res) 
            if (!res.data.match(rules.verify)) {
                ckstatus = 1  
            if (rules.formhash) formhash = res.data.match(rules.formhash)             
                formhash = formhash ? formhash[1] : ""
                ///console.log(formhash)
                for (i = 0; i < rules.op.length; i++) {
                    console.log("去" + rules.op[i].name)
                    header.headers["User-Agent"] = (rules.op[i].ua == "pc" )? "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Safari/537.36" : "Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36"
                    let signurl = rules.op[i].url.replace(/@formhash/, formhash);
                    delete(header.responseType)
                    if (rules.op[i].charset) {
                        header.responseType = "arraybuffer"
                    }
                    if (rules.op[i].method == "post") {
                        data = rules.op[i].data
                        res2 = await axios.post(signurl, data.replace(/@formhash/, formhash), header);                   
                    } else {
                        res2 = await axios.get(signurl, header);
                    }
                    if (rules.op[i].charset) {
                        res2data = require("iconv-lite").decode(res2.data, rules.op[i].charset);
                    } else {
                        res2data = res2.data
                    }
                    res2data = "" + res2data
                    if (res2data.match(/id=\"messagetext\".*?<p>(.+?)<\/p>/s)) { //dz论坛大多都是
                        msg = res2data.match(/id=\"messagetext\".*?<p>(.+?)</s)[1];
                    } else if ((!(rules.url.match(/togamemod|sayhuahuo|99fuman/) ))&&res2data.match(/<root><!\[CDATA\[/)) {
                        msg = res2data.match(/<!\[CDATA\[(.+?)>/)[1].replace(/]/g, "").replace(/<script.+/, "")
                    } else if (rules.op[i].reg2 && res2data.match(rules.op[i].reg2)) {
                        msg = "今天已经" + rules.op[i].name + "过啦";
                    } else if (rules.op[i].reg3 && res2data.match(rules.op[i].reg3)) {
                        msg = res2data.match(rules.op[i].info)[0];
                    } else {
                        msg = rules.op[i].name + "失败!原因未知";
                        console.log(res2data);
                    }               
                    message += "    " + (rules.op.length > 1 ? (rules.op[i].name + "：") : "") + msg + "\n"
                    console.log(msg)
                }
            } else {
                ckstatus = 0
                message = "  cookie失效";
            }
            
        } catch (err) {
            console.log(err);
            message = "接口请求失败"
        }
        resolve(message);
    });
}

module.exports = mydigit;
