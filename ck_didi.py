# -*- coding: utf-8 -*-
# @url: https://raw.githubusercontent.com/zyf1118/kevinxf/main/xF_didi_Sign.py
# @author: zyf1118
# https://gsh5act.xiaojukeji.com/dpub_data_api/activities/9612/signin?signin_user_token=xxxx中的signin_user_token
# https://dpubstatic.udache.com/static/dpubimg/dpub2_project_xxxxx/index_xxxxx.json?r=0.6781450893324913?ts=1637987237802&app_id=common，查看josn里面的activity_id
# 特别说明：本脚本需要从星期一签到，作为第一天签到，如果今天是星期二，你之前没签到过，那脚本是不能签到的。
"""
cron: 48 8 * * *
new Env('滴滴签到');
"""
import requests
import json,sys,os,re
import time,datetime

from notify_mtr import send
from utils import get_data

requests.packages.urllib3.disable_warnings()

id = ''

class DIDI:
    def __init__(self, check_items):
        self.check_items = check_items

    def get_xpsid(self):
        try:
            url = f'https://v.didi.cn/p/DpzAd35?appid=10000&lang=zh-CN&clientType=1&trip_cityid=21&datatype=101&imei=99d8f16bacaef4eef6c151bcdfa095f0&channel=102&appversion=6.2.4&trip_country=CN&TripCountry=CN&lng=113.812538&maptype=soso&os=iOS&utc_offset=480&access_key_id=1&deviceid=99d8f16bacaef4eef6c151bcdfa095f0&phone=UCvMSok42+5+tfafkxMn+A==&model=iPhone11&lat=23.016271&origin_id=1&client_type=1&terminal_id=1&sig=8503d986c0349e40ea10ff360f75d208c78c989a'
            heards = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
            }
            response = requests.head (url=url, headers=heards, verify=False)  # 获取响应请求头
            res = response.headers['Location']  # 获取响应请求头
            # print(res)
            r = re.compile (r'root_xpsid=(.*?)&channel_id')
            xpsid = r.findall (res)
            xpsid = xpsid[0]
            return xpsid
        except Exception as e:
            print (e)
            return json.loads(e)
    
    #获取v.didi.cn的url
    @staticmethod
    def get_v_url(token):
        nowtime = int (round (time.time () * 1000))
        url = f'https://common.diditaxi.com.cn/common/v5/usercenter/me?_t={nowtime}&access_key_id=1&appversion=6.2.4&channel=102&city_id=21&datatype=101&imei=99d8f16bacaef4eef6c151bcdfa095f0&lang=zh-CN&maptype=soso&model=iPhone&networkType=WIFI&os=15.0&sig=c783e6e425a59349309ad10a4c1843a54fc9e82c&terminal_id=1&token={token}&v6x_version=1'
        heards = {
            "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
        }
        response = requests.get (url=url, headers=heards, verify=False)    #获取响应请求头
        result = response.json()                                       #获取响应请求头
        bottom_items = result['data']['cards'][3]['bottom_items']
        for i in range(len(bottom_items)):
            title = bottom_items[i]['title']
            if "积分商城" in title:
                link = bottom_items[i]['link']
                v_url = link[18:]
        return v_url
        # print(json.dumps(result,sort_keys=True,indent=4,ensure_ascii=False))         #格式化后的json
    
    #获取s.didi.cn的url
    def get_s_url(self):
        nowtime = int (round (time.time () * 1000))
        url = f'https://v.didi.cn/K0gkogR'
        heards = {
            "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
        }
        response = requests.head (url=url, headers=heards, verify=False)            #获取响应请求头
        result = response.headers['Location']                                       #获取响应请求头
        s_url = result[18:]
        s_url = s_url[:6]
        return s_url
    
    #获取url
    @staticmethod
    def get_url(s_url):
        url = f'https://s.didi.cn/{s_url}?channel_id=72%2C278%2C80537&entrance_channel=7227880537&xsc=&dchn=K0gkogR&prod_key=custom&xbiz=&xpsid=cc2e4bc570d74253ad56b6c927473c0d&xenv=passenger&xspm_from=&xpsid_from=&xpsid_root=cc2e4bc570d74253ad56b6c927473c0d'
        heards = {
            "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
        }
        response = requests.head (url=url, headers=heards, verify=False)    #获取响应请求头
        res = response.headers['location']                                  #获取响应请求头
        # print(res)
        r = re.compile (r'dpubimg/(.*?)/index.html', re.M | re.S | re.I)
        url_id = r.findall (res)
        url_id = url_id[0]
        return url_id
    
    #获取签到ID
    @staticmethod
    def get_id(url_id):
        try:
            day = time.localtime ()
            day = time.strftime ("%w", day)  # 今天星期几，0代表星期天
            day = int (day)
            url = f'https://dpubstatic.udache.com/static/dpubimg/{url_id}/index.html?channel_id=72%2C278%2C80537&dchn=K0gkogR&entrance_channel=7227880537&prod_key=custom&xbiz=&xenv=passenger&xpsid=9ef4ad1c8e3d42fab6d9823bc4f9838b&xpsid_from=&xpsid_root=9ef4ad1c8e3d42fab6d9823bc4f9838b&xsc=&xspm_from='
            heards = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://page.udache.com/",
                "Host": "dpubstatic.udache.com",
                "Origin": "https://dpubstatic.udache.com",
            }
            response = requests.get (url=url, headers=heards,verify=False)
            result = response.content.decode('utf-8')
            r = re.compile (r',"activity_id":"(.*?)","dpubConfigId"', re.M | re.S | re.I)
            numb = r.findall (result)
            numb = numb[0]
            if int (day) == 0:
                day = int (day) + 7
            if day == 1 or day == 2:
                r = re.compile (r'{"day":1,"prize_type":2,"prize_id":"(.*?)"', re.M | re.S | re.I)
                id = r.findall (result)
                id = id[0]
            elif day == 3:
                r = re.compile (r'{"day":3,"prize_type":2,"prize_id":"(.*?)"', re.M | re.S | re.I)
                id = r.findall (result)
                id = id[0]
            elif day == 4:
                r = re.compile (r'{"day":4,"prize_type":2,"prize_id":"(.*?)"', re.M | re.S | re.I)
                id = r.findall (result)
                id = id[0]
            elif day == 5 or day == 6:
                r = re.compile (r'{"day":5,"prize_type":2,"prize_id":"(.*?)"', re.M | re.S | re.I)
                id = r.findall (result)
                id = id[0]
            else:
                r = re.compile (r'{"day":7,"prize_type":2,"prize_id":"(.*?)"', re.M | re.S | re.I)
                id = r.findall (result)
                id = id[0]
            return numb,id,day
        except Exception as e:
            print (e)
            return json.loads(e)
    
    #获取个人信息
    @staticmethod
    def get_activity_info(token,day,numb):
        try:
            do_sign_url = f'https://gsh5act.xiaojukeji.com/dpub_data_api/activities/{numb}/signin'
            data = r'{"signin_day":' + f"{day}" + r',"signin_type":0,"signin_user_token":' + '"' + f'{token}' + r'"}'
            do_sign_heards = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://dpubstatic.udache.com/",
                "Host": "gsh5act.xiaojukeji.com",
                "Origin": "https://dpubstatic.udache.com",
            }
            response = requests.post (url=do_sign_url, headers=do_sign_heards, data=data, verify=False)
            do_sign_ = response.json ()
            print (do_sign_)
            code = do_sign_['errmsg']
            if "已结束" in code:
                res = f"获取签到ID异常"
            elif "已经" in code:
                res = f"今日已签到，跳过签到环节"
            elif code == '':
                res = f"今日签到成功"
            return res
        except Exception as e:
            print (e)
            return json.loads(e)
    
    #获取积分
    @staticmethod
    def reward(token,day,numb,id):
        try:
            while True:
                nowtime = int (round (time.time () * 1000))
                info_url = f'https://gsh5act.xiaojukeji.com/dpub_data_api/activities/{numb}/reward_lottery'
                info_headers = {
                    "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                    "Referer": "https://dpubstatic.udache.com",
                    "Host": "gsh5act.xiaojukeji.com",
                    "Origin": "https://dpubstatic.udache.com",
                }
                data = '{'+ f'"user_token":"{token}","signin_day":{day},"lottery_id":"{id}"' +'}'
                response = requests.post(url=info_url, headers=info_headers, verify=False,data=data)
                list = response.json()
                print(list)
                flag = list['errmsg']
                if "签到当天奖励" in flag:
                    res = f"已经领过签到当天奖励"
                elif "未完成签到次数" in flag:
                    res = f"请从星期一开始运行此脚本，请看脚本最上面的说明"
                elif "activity is not" in flag:
                    numb += 2
                    if numb == 12000:
                        res = f"签到异常"
                else:
                    reward = list['lottery']['prize']['name']
                    total_reward = list['lottery']['userinfo']['current_point']  #总积分
                print(res)
                return res
        except Exception as e:
            print (e)
            return json.loads(e)
   
    #获取抽奖lid
    def get_lid(self):
        try:
            nowtime = int (round (time.time () * 1000))     #13位
            info_url = f'https://dpubstatic.udache.com/static/dpubimg/dpub2_project_1275480/index_VYom0.json?r=0.07526362250404772?ts={nowtime}&app_id=common'
            info_headers = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://page.udache.com/",
                "Host": "dpubstatic.udache.com",
                "Origin": "https://page.udache.com",
            }
            response = requests.get(url=info_url, headers=info_headers, verify=False)
            result = response.json()
            print(result)
            activity_id = result['activity_id']
            return activity_id
        except Exception as e:
            print (e)
            return json.loads(e)
    
    #抽奖活动
    @staticmethod
    def do_Lottery(token,lottery_lid):
        try:
            flag = 6
            while True:
                do_Lottery_url = f'https://bosp-api.xiaojukeji.com/bosp-api/lottery/draw?lid={lottery_lid}&token={token}&env=%7B%22longitude%22%3A113.81251003689236%2C%22latitude%22%3A23.016395128038194%2C%22cityId%22%3A%2221%22%2C%22deviceId%22%3A%2299d8f16bacaef4eef6c151bcdfa095f0%22%2C%22ddfp%22%3A%2299d8f16bacaef4eef6c151bcdfa095f0%22%2C%22appVersion%22%3A%226.2.4%22%2C%22wifi%22%3A1%2C%22model%22%3A%22iPhone%2011%22%2C%22timeCost%22%3A637425%2C%22userAgent%22%3A%22Mozilla%2F5.0%20(iPhone%3B%20CPU%20iPhone%20OS%2015_0%20like%20Mac%20OS%20X)%20AppleWebKit%2F605.1.15%20(KHTML%2C%20like%20Gecko)%20Mobile%2F15E148%20didi.passenger%2F6.2.4%20FusionKit%2F1.2.20%20OffMode%2F0%22%2C%22isHitButton%22%3Atrue%7D'
                do_Lottery_headers = {
                    "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                    "Referer": "https://page.udache.com/",
                    "Host": "bosp-api.xiaojukeji.com",
                    "Origin": "https://page.udache.com",
                }
                response = requests.get(url=do_Lottery_url, headers=do_Lottery_headers, verify=False)
                result = response.json()
                print(result)
                code = result['code']
                if code == 20003:
                    res = f"抽奖次数已达上限，跳出抽奖环节"
                elif code == 20017:
                    res = f"抽奖操作过频，稍后再试"
                elif code == 20008:
                    res = f"抽奖lid过期，请重新抓包更新"
                elif code == 20010:
                    res = f"积分不足9分，跳出抽奖环节"
                else:
                    draw_times = result['data']['userinfo']['draw_times']
                    flag = 6 - int(draw_times)
                    name = result['data']['prize']['name']
                    current_point = result['data']['userinfo']['current_point']
                    res = f"第{flag}次抽奖获得{name},现账号共有{current_point}积分"
                    time.sleep(5)
                return res
        except Exception as e:
            print (e)
            return json.loads(e)
    
    def main(self):
        msg_all = ""
        i = 1
        for check_item in self.check_items:
            token = check_item.get("token")
            lottery_lid = check_item.get("lottery_lid")
            s_url = self.get_s_url()
            url_id = self.get_url (s_url=s_url)
            numb,id,day = self.get_id(url_id=url_id)
            msg = (
                f"账号 {i}\n------ 滴滴签到开始------\n"
                + self.get_activity_info(token=token,day=day,numb=numb)
                + "\n"
                + self.reward(token=token,day=day,numb=numb,id=id)
                + "\n"
                + self.do_Lottery (token=token,lottery_lid=lottery_lid)
                + "\n------ 滴滴签到结束------"
            )
            i += 1
            msg_all += msg + "\n\n"     
        return msg_all            

if __name__ == "__main__":
    data = get_data()
    _check_items = data.get("DIDI", [])
    res = DIDI(check_items=_check_items).main()
    send("滴滴签到", res)
