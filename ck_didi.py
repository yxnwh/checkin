# -*- coding: utf-8 -*-
# @author: zyf1118
# https://gsh5act.xiaojukeji.com/dpub_data_api/activities/9612/signin?signin_user_token=xxxx中的signin_user_token
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
from hashids import Hashids

requests.packages.urllib3.disable_warnings()

id = ''

class DIDI:
    def __init__(self, check_items):
        self.check_items = check_items

    def get_xpsid(self):
        try:
            url = f'https://v.didi.cn/p/DpzAd35'
            heards = {
                "User-Agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
            }
            response = requests.head (url=url, headers=heards, verify=False)  # 获取响应请求头
            res = response.headers['Location']  # 获取响应请求头
            r = re.compile (r'root_xpsid=(.*?)&channel_id')
            xpsid = r.findall (res)[0].split("&")[0]
            return xpsid
        except Exception as e:
            print (e)
    
    #获取s.didi.cn的url
    def get_s_url(self):
        nowtime = int (round (time.time () * 1000))
        url = f'https://v.didi.cn/K0gkogR'
        heards = {
            "User-Agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
        }
        response = requests.head (url=url, headers=heards, verify=False)            #获取响应请求头
        result = response.headers['Location']                                       #获取响应请求头
        s_url = result[18:]
        s_url = s_url[:6]
        return s_url
    
    #获取url
    @staticmethod
    def get_url(s_url):
        url = f'https://s.didi.cn/{s_url}'
        heards = {
            "User-Agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
        }
        response = requests.head (url=url, headers=heards, verify=False)    #获取响应请求头
        res = response.headers['location']                                  #获取响应请求头
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
            url = f'https://dpubstatic.udache.com/static/dpubimg/{url_id}/index.html'
            heards = {
                "User-Agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
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

    
    #执行签到
    @staticmethod
    def do_sign(token,day,numb):
        try:
            do_sign_url = f'https://gsh5act.xiaojukeji.com/dpub_data_api/activities/{numb}/signin'
            data = r'{"signin_day":' + f"{day}" + r',"signin_type":0,"signin_user_token":' + '"' + f'{token}' + r'"}'
            do_sign_heards = {
                "User-Agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://dpubstatic.udache.com/",
                "Host": "gsh5act.xiaojukeji.com",
                "Origin": "https://dpubstatic.udache.com",
                "Content-Type": "application/json",
            }
            response = requests.post (url=do_sign_url, headers=do_sign_heards, data=data, verify=False)
            result = response.json ()
            print ("do_sign#执行签到\n"+f'{result}')
            code = result['errmsg']
            if "已结束" in code:
                res = f"获取签到ID异常"
            elif "已经" in code:
                res = f"今日已签到，跳过签到环节"
            elif code == '':
                res = f"今日签到成功"
            else:
                res = code
            return res
        except Exception as e:
            print (e)

    
    #获取积分
    @staticmethod
    def reward(token,day,numb,id):
        try:
            while True:
                info_url = f'https://gsh5act.xiaojukeji.com/dpub_data_api/activities/{numb}/reward_lottery'
                info_headers = {
                    "User-Agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                    "Referer": "https://dpubstatic.udache.com",
                    "Host": "gsh5act.xiaojukeji.com",
                    "Origin": "https://dpubstatic.udache.com",
                    "Content-Type": "application/json",
                }
                data = '{'+ f'"user_token":"{token}","signin_day":{day},"lottery_id":"{id}"' +'}'
                response = requests.post(url=info_url, headers=info_headers, verify=False,data=data)
                list = response.json()
                print ("reward#获取积分\n"+f'{list}')
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
                    res = f"本次签到获取{reward},账号共有{total_reward}积分"
                return res
        except Exception as e:
            print (e)

    def main(self):
        msg_all = ""
        i = 1
        for check_item in self.check_items:
            token = check_item.get("token")
            xpsid = self.get_xpsid()
            s_url = self.get_s_url()
            url_id = self.get_url (s_url=s_url)
            numb,id,day = self.get_id(url_id=url_id)
#            sid = self.get_s(xpsid=xpsid)
#            print (f'获取到的s字段值为:{sid}')
#            hashids = Hashids(salt='o2fXhV')
#            hashid = hashids.decode(sid)[0]
#            lottery_lid = self.get_lid(hashid=hashid, sid=sid)
#            print (f'获取到的lottery_lid值为:{lottery_lid}')
            msg = (
                f"账号 {i}\n------ 滴滴签到开始------\n"
                + self.do_sign(token=token,day=day,numb=numb)
                + "\n"
                + self.reward(token=token,day=day,numb=numb,id=id)
#                + "\n"
#                + self.do_Lottery (token=token,lottery_lid=lottery_lid)
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

'''
    @staticmethod
    def get_s(xpsid):
        try:
            info_url = f'https://api.didi.cn/webx/chapter/cover/config'
            data = r'{"xbiz":"110000","prod_key":"custom","xpsid":"' + f'{xpsid}' + r'","dchn":"nR9avq9","xoid":"LH7idOwBTVCmNDQccI2elg","uid":"","xenv":"passenger","xspm_from":"ut-mall.none.c605.2","xpsid_root":"' + f'{xpsid}' + r'","xpsid_from":"","xpsid_share":"","args":{"dchn":"nR9avq9","xenv":"passenger","pass_through":"xenv=passenger"},"root_xpsid":"' + f'{xpsid}' + r'","f_xpsid":"' + f'{xpsid}' + r'"}'
            info_heards = {
                "User-Agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://page.udache.com/",
                "Host": "api.didi.cn",
                "Origin": "https://page.udache.com",
                "Content-Type": "application/json",
            }
            response = requests.post (url=info_url, headers=info_heards, data=data, verify=False)
            result = response.json ()
            print ("get_s#获取s字段\n"+f'{result}')
            code = result['errmsg']
            if "success" in code:
                s_url = result['data']['conf']['url']
                r = re.compile (r's=(.*?)&dchn')
                s = r.findall (s_url)[0]
                return s
            else:
                print (result)
        except Exception as e:
            print (e)
           
    #获取抽奖lid
    @staticmethod
    def get_lid(hashid,sid):
        try:
            info_url = f'https://dpubstatic.udache.com/static/dpubimg/dpub2_project_{hashid}/index_{sid}.json'
            info_headers = {
                "User-Agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://page.udache.com/",
                "Host": "dpubstatic.udache.com",
                "Origin": "https://page.udache.com",
            }
            response = requests.get(url=info_url, headers=info_headers, verify=False)
            result = response.json()
            print ("get_lid#获取抽奖lid\n"+f'{result}')
            activity_id = result['activity_id']
            return activity_id
        except Exception as e:
            print (e)

    
    #抽奖活动
    @staticmethod
    def do_Lottery(token,lottery_lid):
        try:
            flag = 6
            res = ""
            while True:
                do_Lottery_url = f'https://bosp-api.xiaojukeji.com/bosp-api/lottery/draw?lid={lottery_lid}&token={token}'
                do_Lottery_headers = {
                     "User-Agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                    "Referer": "https://page.udache.com/",
                    "Host": "bosp-api.xiaojukeji.com",
                    "Origin": "https://page.udache.com",
                }
                response = requests.get(url=do_Lottery_url, headers=do_Lottery_headers, verify=False)
                result = response.json()
                print ("do_Lottery#抽奖活动\n"+f'{result}')
                code = result['code']
                if code == 20003:
                    res += f"抽奖次数已达上限，跳出抽奖环节"
                    break
                elif code == 20017:
                    res += f"抽奖操作过频，稍后再试"
                    break
                elif code == 20008:
                    res += f"抽奖lid过期，请重新抓包更新"
                    break
                elif code == 20010:
                    res += f"积分不足9分，跳出抽奖环节"
                    break
                else:
                    draw_times = result['data']['userinfo']['draw_times']
                    flag = 6 - int(draw_times)
                    name = result['data']['prize']['name']
                    current_point = result['data']['userinfo']['current_point']
                    res += f"第{flag}次抽奖获得{name},现账号共有{current_point}积分\n"
                    time.sleep(5)
            return res
        except Exception as e:
            print (e)
'''
