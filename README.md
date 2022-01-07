# 简介

> 一个主要运行在 [𝐞𝐥𝐞𝐜𝐕𝟐𝐏](https://github.com/elecV2/elecV2P.git) 或 [𝐪𝐢𝐧𝐠𝐥𝐨𝐧𝐠](https://github.com/whyour/qinglong.git) 等定时面板，同时支持系统运行环境的签到项目
>
> 环境：𝑷𝒚𝒕𝒉𝒐𝒏 3.8+ / 𝑵𝒐𝒅𝒆.𝒋𝒔 10+ / 𝑩𝒂𝒔𝒉 4+ / 𝑶𝒑𝒆𝒏𝑱𝑫𝑲8 / 𝑷𝒆𝒓𝒍5



### 4. 配置通知

#### 4.1 JSMANAGE -> store/cookie 常量储存管理填写通知环境变量

| 变量 / key      | 描述                        | 支持语言 | 参考 / value                                                                                                                                                                                                                                     |
| --------------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| HITOKOTO        | 一言                        | PY       | true 为开启，false 为关闭，默认关闭                                                                                                                                                                                                              |
| BARK_PUSH       | bark 设备码                 | JS PY    | BARK 推送使用，填写 URL 即可，例如： `https://api.day.app/DxHcxxxxxRxxxxxxcm`                                                                                                                                                                    |
| BARK_ARCHIVE    | * bark 存档                 | PY       | 是否存档                                                                                                                                                                                                                                         |
| BARK_GROUP      | * bark 消息分组             | JS PY    | 消息分组                                                                                                                                                                                                                                         |
| BARK_SOUND      | * bark 声音                 | JS PY    | 例如： `choo` ，具体值 bark-推送铃声-查看所有铃声                                                                                                                                                                                                |
| CONSOLE         | 控制台输出                  | PY       | true 为开启，false 为关闭，默认关闭                                                                                                                                                                                                              |
| DD_BOT_SECRET   | 钉钉机器人                  | JS PY SH | 钉钉推送[官方文档](https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq)密钥，机器人安全设置页面，加签一栏下面显示的 `SEC` 开头的字符串，注：填写了 `DD_BOT_TOKEN` 和 `DD_BOT_SECRET` ，钉钉机器人安全设置只需勾选 `加签` 即可，其他选项不要勾选 |
| DD_BOT_TOKEN    | 钉钉机器人                  | JS PY SH | 钉钉推送[官方文档](https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq)，只需 `https://oapi.dingtalk.com/robot/send?access_token=XXX` 等于符号后面的 `XXX`                                                                                      |
| FSKEY           | 飞书                        | PY       | 飞书[官方文档](https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN)，只需 `https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxx` 的 `xxxxxx` 部分                                                                                   |
| GOBOT_URL       | go-cqhttp                   | JS PY    | 例如：推送到个人QQ： `http://127.0.0.1/send_private_msg` 群： `http://127.0.0.1/send_group_msg`                                                                                                                                                  |
| GOBOT_QQ        | go-cqhttp 的推送群或者用户  | JS PY    | `GOBOT_URL` 设置 `/send_private_msg` 时填入 `user_id=个人QQ` ； `/send_group_msg` 时填入 `group_id=QQ群`                                                                                                                                         |
| GOBOT_TOKEN     | * go-cqhttp 的 access_token | JS PY    | go-cqhttp 文件设置的访问密钥                                                                                                                                                                                                                     |
| IGOT_PUSH_TOKEN | iGot 聚合推送               | JS PY    | [参考文档](https://wahao.github.io/Bark-MP-helper)，支持多方式推送                                                                                                                                                                               |
| PUSH_KEY        | server 酱                   | JS PY SH | server 酱推送[官方文档](https://sc.ftqq.com/3.version)，JS 和 PY 推送兼容新旧版本                                                                                                                                                                |
| PUSH_TURBO_KEY  | server 酱 Turbo 版          | SH       | server 酱 TURBO 推送[官方文档](https://sct.ftqq.com/sendkey)，仅支持 SH                                                                                                                                                                          |
| PUSH_PLUS_TOKEN | pushplus 用户令牌           | JS PY SH | 可直接加到请求地址后，如： `http://www.pushplus.plus/send/{token}` [官方文档](https://www.pushplus.plus/doc/)                                                                                                                                    |
| PUSH_PLUS_USER  | * pushplus 群组编码         | JS PY    | 一对多推送下面 -> 您的群组（如无则新建） -> 群组编码 1. 需订阅者扫描二维码 2. 如果您是创建群组所属人，也需点击“查看二维码”扫描绑定，否则不能接受群组消息推送                                                                                     |
| QMSG_KEY        | qmsg 酱                     | JS PY SH | qmsg 酱推送[官方文档](https://qmsg.zendee.cn/index.html)，填写 `KEY` 代码即可                                                                                                                                                                    |
| QMSG_TYPE       | * qmsg 酱推送类型           | JS PY    | qmsg 酱推送[官方文档](https://qmsg.zendee.cn/index.html)，如果需要推送到群填写 `group` ，其他的都推送到 QQ                                                                                                                                       |
| QYWX_AM         | 企业微信应用                | JS PY    | [参考文档](http://note.youdao.com/s/HMiudGkb)，依次填入 corpid, corpsecret, touser(注：多个成员ID使用 \| 隔开), agentid, media_id(选填，不填默认文本消息类型)                                                                                    |
| QYWX_KEY        | 企业微信机器人              | JS PY    | [官方文档](https://work.weixin.qq.com/api/doc/90000/90136/91770)，只需 `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=693a91f6-7xxx-4bc4-97a0-0ec2sifa5aaa` key= 后面部分                                                                 |
| SRE_TOKEN       | SRE24.com                   | SH       | [官网](https://push.jwks123.cn)关注公众号后再次点击获取令牌                                                                                                                                                                                      |
| TG_BOT_TOKEN    | tg 机器人                   | JS PY SH | 申请 [@BotFather](https://t.me/BotFather) 的 Token，如 `10xxx4:AAFcqxxxxgER5uw`                                                                                                                                                                  |
| TG_USER_ID      | tg 机器人                   | JS PY SH | 给 [@getidsbot](https://t.me/getidsbot) 发送 /start 获取到的纯数字 ID，如 `1434078534`                                                                                                                                                           |
| TG_API_HOST     | * tg 代理 api               | JS PY    | Telegram api 自建的反向代理地址 例子：反向代理地址 `http://aaa.bbb.ccc` 则填写 aaa.bbb.ccc [简略搭建教程](https://shimo.im/docs/JD38CJDQtYy3yTd8/read)                                                                                           |
| TG_PROXY_AUTH   | * tg 代理认证参数           | JS       | username:password，如 `Oreo:123456` ，`TG_PROXY_HOST` 中填了可不填                                                                                                                                                                               |
| TG_PROXY_HOST   | * tg 机器人代理 IP 地址     | JS PY    | 代理类型为 http，比如您代理是 `http://127.0.0.1:1080` ，则填写 `127.0.0.1` ，有密码例子: `username:password@127.0.0.1`                                                                                                                           |
| TG_PROXY_PORT   | * tg 机器人代理端口         | JS PY    | 代理端口号，代理类型为 http，比如您代理是 `http://127.0.0.1:1080` ，则填写 `1080`                                                                                                                                                                |

*\* 表示选填*

#### 4.2 另一种通知配置方式（当和 4.1 中值重复时，以 4.1 值为准）

下载项目中的[推送配置文件](https://github.com/Oreomeow/checkinpanel/blob/master/notify.sample.toml)到**配置文件夹**，按照上述说明修改配置文件中的值并改名为 `notify.toml` ，你可以**自由地删除**该文件中某些不需要的值（注意语法）。

使用了配置文件后，你可以将配置文件放在持久化位置，不受脚本更新、重置容器的影响。

如果想自定义配置文件的位置和文件名，请设置通知环境变量 `NOTIFY_CONFIG_PATH` ， 例如 `/usr/local/app/script/notify.toml` 。建议保持 `toml` 的后缀，防止编辑器的误解。

关于 toml 的语法参考：

* [toml-lang/toml](https://github.com/toml-lang/toml)
* [中文知乎介绍](https://zhuanlan.zhihu.com/p/50412485)

## 𝐪𝐢𝐧𝐠𝐥𝐨𝐧𝐠 使用方法

### 1. ssh 进入容器

```sh
docker exec -it qinglong bash
```

修改 `qinglong` 为你的青龙容器名称

### 2. 拉取仓库

**解决 Shell 脚本无法拉取问题**：将以下代码在 `config.sh` 相应位置替换

```sh
## ql repo命令拉取脚本时需要拉取的文件后缀，直接写文件后缀名即可
RepoFileExtensions="js pl py sh ts"
```

可添加定时任务，名称、时间自定

```sh
ql repo https://github.com/Oreomeow/checkinpanel.git "api_|ck_|ins_" "^checkin" "^notify|^utils|cpm" "master"
```

### 3. 安装依赖

* **运行 `签到依赖` 任务**

  * [截图](https://github.com/Oreomeow/checkinpanel/issues/43)

* 依赖持久化配置

  * `签到依赖` 任务保持定时运行即可

### 4. 拷贝文件

```sh
cp /ql/repo/Oreomeow_checkinpanel_master/check.sample.toml /ql/config/check.toml
```

*通知配置文件（可选）*

```sh
cp /ql/repo/Oreomeow_checkinpanel_master/notify.sample.toml /ql/config/notify.toml
```

### 5. 配置通知

参见上文中的[配置通知](#https://github.com/Oreomeow/checkinpanel/blob/master/README.md#4配置通知)

特别的：

* **如果你已经配置了 `config.sh`， 那么你可以不需要做任何改变。**
* 如果使用环境变量，请在 qinglong 面板中配置。
* 如果使用配置文件，请修改 `/ql/config/notify.toml` 文件。
* 当然你也可以在 qinglong 面板中配置 `NOTIFY_CONFIG_PATH` 环境变量为配置文件指定其他位置。

### 6. 抓包配置

不出意外的话可以在青龙面板的配置文件下找到 `check.toml` 文件

根据[注释说明](https://github.com/Oreomeow/checkinpanel/blob/master/check.sample.toml)进行抓包并配置

## 补充说明

### 1. **添加了葫芦侠的签到配置**

参数说明： `HLX.username` ：用户名 `HLX.password` ：密码的 MD5 32 位小写加密[生成](https://md5jiami.bmcx.com/)

### 2. **添加了网易云游戏的签到配置**

[官网](https://cg.163.com/#/mobile)

参数说明： `GAME163.authorization`

登录后抓取签到请求（一般请求的请求头也有这个字段）

[![4tfx5F.png](https://z3.ax1x.com/2021/09/22/4tfx5F.png)](https://imgtu.com/i/4tfx5F)

### 3. **Shell 脚本配置**

* 目前 Shell 脚本只有一个 SSPanel 签到，如需使用请参考 `env.sample` 配置 `.env` 后放入 `script/Lists` 或 `/ql/config` 文件夹
* 支持自定义配置文件路径
  * 环境变量 / store KEY 名称：`ENV_PATH`
  * 参考值 / VALUE：`/usr/local/app/script/.env`

### 4. **添加了欢太商城的签到配置**

* [欢太商城 HttpCanary 抓包教程](https://github.com/hwkxk/HeytapTask/wiki/%E6%AC%A2%E5%A4%AA%E5%95%86%E5%9F%8EHttpCanary%E6%8A%93%E5%8C%85%E6%95%99%E7%A8%8B)
* 部分域名屏蔽境外 IP 访问，所以本项目不适于在 非中国 IP 代理网络下 / Github Actions / 境外 VPS 上运行！
* 从未在欢太商城做过任务，请先手动进入任务中心完成一下任务再使用，否则可能无法获取到任务列表数据导致出错！@YYplus

### 5. **添加了时光相册的签到配置**

[![4tWaFg.png](https://z3.ax1x.com/2021/09/22/4tWaFg.png)](https://imgtu.com/i/4tWaFg)

### 6. **EUserv 在未开启登录验证时有效**

* [True Captcha](https://apitruecaptcha.org/api)

* 如图注册账号后获取 `userid` 和 `apikey`

  [![5e9nF1.png](https://z3.ax1x.com/2021/10/11/5e9nF1.png)](https://imgtu.com/i/5e9nF1)

## 其他说明

1. 请自行修改执行时间。

2. elecV2P 运行 `手动更新` 任务可强制同步本仓库。

3. 大部分脚本移植于 [Sitoi](https://github.com/Sitoi/dailycheckin)，Sitoi 于 2021 年 9 月 3 日 [dailycheckin-0.1.7](https://files.pythonhosted.org/packages/ee/8d/b49624a4d11c51f4e3dfb98f622d0c1ffe5d6315ad39452859ea8703206f/dailycheckin-0.1.7.tar.gz)  版本适配了青龙，[使用教程](https://sitoi.gitee.io/dailycheckin/qinglong/)与本仓库教程不相同，切勿使用本仓库 [checkinpanel](https://github.com/Oreomeow/checkinpanel) 的同时去问大佬。

4. 2021 年 9 月 13 日起不再更新 `.json` 后缀的配置文件。

5. 2021 年 9 月 23 日起重新初始化项目，原本文件移到[这里](https://github.com/Oreomeow/ck_bak)，上述仓库不再进行更新，期望稳定的用户可以切换到上述仓库。

6. 2021 年 11 月 17 日起由 `JSON5` 配置转为更为友好的 `TOML` 配置。

## 计划说明

* [x] 𝑷𝒚𝒕𝒉𝒐𝒏 \| **api** \| LeetCode 每日一题 \| 每日一句 \| 天气预报 \| 每日新闻 \| 爱企查e卡监控 \| Hax 监控
* [x] 𝑷𝒚𝒕𝒉𝒐𝒏 \| **多账号** \| AcFun \| 百度搜索资源平台 \| Bilibili \| 天翼云盘 \| CSDN \| 多看阅读 \| 恩山论坛 \| Fa米家 \| 网易云游戏 \| 葫芦侠 \| 爱奇艺 \| 全民K歌 \| MEIZU 社区 \| 芒果 TV \| 小米运动 \| 网易云音乐 \| 一加手机社区官方论坛 \| 哔咔漫画 \| 吾爱破解 \| 什么值得买 \| 百度贴吧 \| V2EX \| 腾讯视频 \| 微博 \| 联通沃邮箱 \| 哔咔网单 \| 王者营地 \| 有道云笔记 \| 智友邦 \| 机场签到 \| 欢太商城 \| NGA \| 掘金 \| GLaDOS \| HiFiNi \| 时光相册 \| 联通营业厅 \| 无忧行 \| FreeNom \| EUserv \| Site \| SF 轻小说 \| 在线工具 \| CCAVA \| 企鹅电竞 \| 联想乐云 \| WPS \| HOSTLOC \| Epic \| ~~Hax 续期提醒~~
* [x] 𝑺𝒉𝒆𝒍𝒍 \| **多账号** \| SSPanel 签到
