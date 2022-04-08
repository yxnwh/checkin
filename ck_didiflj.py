# -*- coding: utf-8 -*-
# @url: https://raw.githubusercontent.com/yxnwh/kevinxf/main/xF_DiDi_FLJ_Sign.py
# @author: zyf1118
"""
cron: 22 10,15 * * *
new Env('滴滴福利金签到');
"""
import requests
import json, sys, os, re
import time, datetime,random

from notify_mtr import send
from utils import get_data

requests.packages.urllib3.disable_warnings ()

wsgsig=['dd03-vx9tq2onDp0IZqcYVoABxTjsa%2BXNwlstUQ6fOSmVa%2BX%2BZhfRmNkDw6zkAz0%2BZA8rsJ2%2BzMKjCoJLpecxVoEAOMK%2FBzf2SAJmXo6ax6Nre%2BnNYVNkX72aP6KjAJE',
        'dd03-67TGcdCHNXqCW0FVDMhX%2B%2F%2B650AFtbkyCIqj4r3350AEWfAm9TIW%2B9cKMnqEWXIwEPUQLAXc%2BWT0%2FiFqd1%2Fn%2Be36LslfUXIyD61n%2BAgNL096XnZxBMZUNl%2BN%2BXO',
        'dd03-rxqml47pGugrvrGTzy%2FbOp8ud3nWyknnyQTDxoGxd3nXv%2FDzSNEfP8%2BSFQgXvBJlYJP3Q%2BvlFR3UTdGPxKw9RJGuE3%2BtZa8rPod9xp3uF3KrvEbhPolCP3KkEQ9',
        'dd03-%2FbmamzeJR3QXGQJTThyOOv18ZuJqDzvOpFvUyJM1ZuJrGv%2BqxrbhQvEIOJQrGJGQPVzxPRAHQ3WnfpjwpEQmzRLaPJyXE%2BcyYhyiy763PujiGJiPSrWnRN28xJQV',
        'dd03-UfTkqudHf%2B4nfF8UZV2awyM6Epv%2Fc9oqvBqBO%2BL3Epvhfd3OPVIdwyFKe84hfVcsxrU1zoBJg%2BKXGAWkvAwBxo2KBQgPfebhZqxdwRMHB%2BcjfF%2BtuFhMxReNd3Ct',
        'dd03-CugL8XzfY9YxloS582DSCDiDQ%2F1u%2Fv656T3ZgbXEQ%2F1vlzPd%2BIjSDtoevAYvlNq74M7qAjmev9YTVReH6ScSftv0o%2Fqul7%2F6JP4RCcm9uqLZkvw48SGzfjzAZ9YY',
        'dd03-aScF%2FD3Xy4FqxzWqMzcXogciSvVXYQRtNv7%2FYmClSvVWxo8R58nVS0KUxKFWx8frH43PpggVz3HVRJ3x2z8wYgNlxR6yPzfqM%2BNhZg7%2FzKHjx3Nr2z7kTXDVwKE',
        'dd03-CugL8XzfY9YxloS582DSCDiDQ%2F1u%2Fv656T3ZgbXEQ%2F1vlzPd%2BIjSDtoevAYvlNq74M7qAjmev9YTVReH6ScSftv0o%2Fqul7%2F6JP4RCcm9uqLZkvw48SGzfjzAZ9YY',
        'dd03-NEvAAAqxzcF7%2B%2B%2Fqb0pV6dhOTjV2J3xtacmlHlYpTjV1%2B7IRDn8q5EhywDF1%2BpArgjiS8drvwbH42uLxbbRXIkhWyD5M4z1rb0ok6hZWwjl4MpFhcnXVIalvPDH',
        'dd03-DUXVE0SysCEZ%2BS1O7nX62jMR%2FsUyJZPj5jQ9LikS%2FsUz%2Bx6vNgDF1DxxrbEz%2BLdh3coI4cPvqjIw221TJXgA1tVvlnaPM2APJXba1tURrbhPMLBt7ntC1DhYks9',
        'dd03-wDXIwYa7Z54GDovErARRsS5KRwvBGvJAtdQwkMILRwvADzyHh%2FDPqwA6uL4ADNnCVkoVtSd5vMfDe4v7sevTrwh%2Bu5baf4zBrAXPqLEEYICcD7j3kqcRsSA4YL1',
        'dd03-y3uI01tMPCX7nJYRt2No3SQ1vs02i8IprMnw%2BTv8vs01n4xXjP7P45iNQbX1nQkTXTjV1LW%2BRcQ4rzYhq5iP42QgRgRBt8xzsZmQ%2BSj3O0R8t3PzsSs%2F4SWLyCq',
        'dd03-%2Fep12zdOxaJXJ8w9TGpxE42xphQq%2BJMdpCsTaJLuphQrJNZ5xWKYFvFRyBJrJz%2FfPsWkGRapzA0s5QwJTjQSFKAzRhci73VGSjvvFK9zzkgl7%2BYgoDuPaoLzRaL',
        'dd03-z6%2BZsOikr8p3Z5vssNK6z5jrjz%2B6wIJZqJCLQ6QWjz%2B5ZMyhioR2yStns%2Bp5ZwnvWQGexwnmtNs8pPvXsv87yZnnm3n6T2oPtNbMzwtlnJj6vwGPsRbKzwgonJk',
        'dd03-0%2F1PtGPrF8UO5avU3tAazsYkgzEp2EJz1Xe5RjhjgzEo5AynJDwIzCYsG%2BUo5hnx70aFwbSt0NPTJUvr3fHNzgSsb3wpHdop4tF6ybYqcJYp7hGp3GF4ybLvcJw',
        'dd03-rDByxRBD9w%2BsAUn7w966q%2BEfC5pVFhGFydLKl72aC5pUAliMS%2FV7rp9AcS%2BUAEv0YkHbszEBbTCXfan4wVa2ruEA0ZgVdrsex95Jqz9CGPcVCEJewl5LqzU2GPd',
        'dd03-gUaMGbSXHChPMWOhInVo1fTi3saoHj2QHj5YNXkl3sapMnTs3glT3fxUKbhpMGUONc1r2GPqJcwS4cOkKbHv1fMV8sVQLW9Q8nBlNWIUKiYwLWSoIsEz%2BfOhJXq',
        'dd03-ZB27DIBhLttb1gkuUiIX8TLU7DDe6CFyWfdRKw2t7DDd1Ghmkixy8M9i%2Bjtd1nYwqm9i56EmNiogNskqUgESKTBU%2BfiC1glSUnHO8xBr3DbG2ihpUgIW76Um3jq',
        'dd03-20QwPlA2%2FILbbHoaEks8lhBLsPSeg68eG9XIrA1KsPSdb2R6dkN5lha3j2LdbOsgA%2Ft9mrF7i1BgExoK9dzMldHNWIIA9TWN9ao2qkICWL9ebHs%2B0d71khHIiL5',
        'dd03-35eouVsWdxONxlnc0%2BaNWavjG6HIYqGHFK14i9ukG6HHxUiAgphNWrjVgTOHxevJDR5CVhXrfSVKRAnf0QMHUURrg1x6OF%2BcE3H4iaujgYkaOFpcbQA8WrnqgHY',
        'dd03-qRg6qKKGw8DUhpRWx14yy%2BGcozttku3szw3OOycdoztshyoQT1jxw%2B3Fz%2BDsh%2BXqZ57hz8NBzoNrX3RwPYNpxuNERz8tUztXwOsOxQbCzuf%2FV3nWx1sSy%2BJGx%2BE',
        'dd03-zzyKkOo5PQ82t3sQsSuQOLnIvJz7W%2BchqOjyw6mNvJz8tKXZiL3ROSz8Qu88tuojWHnXRwR5QRb5lpspswWSQSJNQJc4tzultPnYx5R3QzKGrzzrswzuw2v8zQd',
        'dd03-XGGZ8J%2FbhAtQdOYFue33BNV0tqDTaxI7YaKLgzOAtqDSdZxfQls2DNrai9tSdHk5yh%2BeA7ldiaopC6YAue4JB7SA%2FAtkf1rLulKLfyqCWVnldOTKul4KgvYC%2F9S',
        'dd03-DOgz5gRWq%2FAYTS%2F26v82Acsji9qzOZBC5z3Jdsjki9qyTxlJN4j8AcuVtqAyTLwA387cDDoXsrMxv2%2F5KKfKAfX%2Fs9HyTIYG8NK0BtnjrV5uZ5LDJvfKAWWUrq5',
        'dd03-kQNDYoKdpT7kl4cdP27UVJJBxMyj%2FNsaRxDm%2F4cGxMyilJf2Z2QtUQ3gSx7ilv8cT60pXuNdSwchtoc%2BPINqUJcETYN%2Fr7DdOSbqU3JgTO%2BqrRJEQP%2B%2FV%2BbfSTd',
        'dd03-RnANOxOD1Z3H9sJdnUHQlIrfJ2u%2Ben09kqMvqH%2FaJ2uN9jj1WEUokZZA4P3N9CubiAIsnPrD4OgMGgmNmd5plZPCN2NIF0zGlUBwqLxCNPNHaitCnE6xlZqa2ZA'
        ]

class DIDIflj:
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
            r = re.compile (r'root_xpsid=(.*?)&channel_id')
            xpsid = r.findall (res)
            xpsid = xpsid[0]
            return xpsid
        except Exception as e:
            print (e)
            return json.loads(e)

    #查看福利金
    @staticmethod
    def get_fulijin(token,wsgsig):
        try:
            wsgsig1 = wsgsig[random.randint (0, 25)]
            nowtime = int (round (time.time () * 1000))
            info_url = f'https://rewards.xiaojukeji.com/loyalty_credit/bonus/getWelfareUsage4Wallet?wsgsig={wsgsig1}&token={token}&city_id=21'
            info_headers = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://page.udache.com/",
                "origin": "https://page.udache.com",
                "content-type": "application/json",
                "host": "rewards.xiaojukeji.com",
            }
            response = requests.get (url=info_url, headers=info_headers, verify=False)
            result = response.json()
            print(result)
            balance = result['data']['balance']
            res = f"现总共有{balance}福利金"
            return res
        except Exception as e:
            print(e)
            return json.loads(e)
    
    #执行积分签到
    @staticmethod
    def do_sign(token,xpsid):
        try:
            do_sign_url = f'https://ut.xiaojukeji.com/ut/welfare/api/action/dailySign'
            data = '{'+ r'"xbiz":"","prod_key":"welfare-center","xpsid":"' + f"{xpsid}" + r'","dchn":"62wjxq8","xoid":"aA/iet7vTTmdKCRAgoHwyg","uid":"281474990465673","xenv":"passenger","xspm_from":"","xpsid_root":"' + f"{xpsid}" + r',","xpsid_from":"","xpsid_share":"","token":"' + f"{token}" + r'","lat":"23.016329481336804","lng":"113.81252766927084","platform":"na",'+ r'"env":"{\"cityId\":\"158\",\"token\":\"' + f'{token}' + r'\",\"longitude\":\"113.81252766927084\",\"latitude\":\"23.016329481336804\",\"appid\":\"30004\",\"fromChannel\":\"1\",\"deviceId\":\"99d8f16bacaef4eef6c151bcdfa095f0\",\"ddfp\":\"99d8f16bacaef4eef6c151bcdfa095f0\",\"appVersion\":\"6.2.4\",\"userAgent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0\"}"}'
            # print(data)
            do_sign_heards = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://page.udache.com/",
                "origin": "https://page.udache.com",
                "content-type": "application/x-www-form-urlencoded",
                "host":"ut.xiaojukeji.com",
            }
            response = requests.post(url=do_sign_url,data=data,headers=do_sign_heards,verify=False)
            do_sign_ = response.json()
            print(do_sign_)
            code = do_sign_['errno']   #本次签到获得的积分
            if code == 40009:
                res = f"今日福利金已签到，无需重复签到"
            elif code == 0:
                #prize_status = do_sign_['data']['prize_status']   #5天签到周期内签到第几天
                subsidy_amount = do_sign_['data']['subsidy_state']['subsidy_amount']
                res = f"今日签到成功，获得福利金{subsidy_amount}"
            return res
        except Exception as e:
            print(e)
            return json.loads(e)
    
    #报名瓜分
    @staticmethod
    def guafen(token,xpsid,activity_id_tomorrow,task_id_tomorrow,count):
        try:
            url = f'https://ut.xiaojukeji.com/ut/welfare/api/action/joinDivide'
            data = r'{"xbiz":"","prod_key":"welfare-center","xpsid":"' + f"{xpsid}" + r'","dchn":"DpQ3dga","xoid":"9c52fa1a-ec11-46f9-9682-5d90694dd281","uid":"281474990465673","xenv":"passenger","xspm_from":"","xpsid_root":"' + f"{xpsid}" + r'","xpsid_from":"","xpsid_share":"","token":"' + f'{token}'+ '"'+ r',"lat":"23.016388346354166","lng":"113.81221218532986","platform":"na","env":"{\"cityId\":\"21\",\"token\":\"' + f'{token}' + r'\",\"longitude\":\"113.81221218532986\",\"latitude\":\"23.016388346354166\",\"appid\":\"30004\",\"fromChannel\":\"1\",\"deviceId\":\"99d8f16bacaef4eef6c151bcdfa095f0\",\"ddfp\":\"99d8f16bacaef4eef6c151bcdfa095f0\",\"appVersion\":\"6.2.4\",\"userAgent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 BottomBar/on OffMode/0\"}","activity_id":' + f"{activity_id_tomorrow}" + r',"count":' + f"{count}" + r',"type":"ut_bonus"}'
            headers = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://page.udache.com/",
                "origin": "https://page.udache.com",
                "host":"ut.xiaojukeji.com",
            }
            response = requests.post(url=url,data=data,headers=headers,verify=False)
            result = response.json()
            print(result)
            errmsg = result['errmsg']
            if errmsg == 'success':
                res = f"打卡瓜分活动报名成功"
            elif "活动已经被领取" in errmsg:
                res = f"已参加打卡瓜分活动，请明天记得签到瓜分"
            else:
                res = f"打卡瓜分福利金活动未开启"
            return res
        except Exception as e:
            print(e)
            return json.loads(e)
    
    #签到瓜分
    @staticmethod
    def guafen_Sign(token,xpsid,activity_id_today,task_id_today):
        try:
            url = f'https://ut.xiaojukeji.com/ut/welfare/api/action/divideReward'
            data = r'{"xbiz":"","prod_key":"welfare-center","xpsid":"' + f"{xpsid}" + r'","dchn":"DpQ3dga","xoid":"3b5d5c47-2c82-4914-b633-227dfc0c687a","uid":"281474990465673","xenv":"passenger","xspm_from":"","xpsid_root":"' + f"{xpsid}" + r'","xpsid_from":"","xpsid_share":"","token":"' + f'{token}' + r'","lat":"23.016388346354166","lng":"113.81221218532986","platform":"na","env":"{\"cityId\":\"21\",\"token\":\"' + f'{token}' + r'\",\"longitude\":\"113.81221218532986\",\"latitude\":\"23.016388346354166\",\"appid\":\"30004\",\"fromChannel\":\"1\",\"deviceId\":\"99d8f16bacaef4eef6c151bcdfa095f0\",\"ddfp\":\"99d8f16bacaef4eef6c151bcdfa095f0\",\"appVersion\":\"6.2.4\",\"userAgent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 BottomBar/on OffMode/0\"}","activity_id":' + f"{activity_id_today}" + r',"task_id":' + f"{task_id_today}" + r'}'
            headers = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://page.udache.com/",
                "origin": "https://page.udache.com",
                "host":"ut.xiaojukeji.com",
            }
            response = requests.post(url=url,data=data,headers=headers,verify=False)
            result = response.json()
            print(result)
            errmsg = result['errmsg']
            if errmsg == 'success':
                res = f"今日参加打卡瓜分活动成功"
            elif "活动已经被领取" in errmsg:
                res = f"已参加打卡瓜分活动，请明天记得签到瓜分"
            else:
                res = f"打卡瓜分福利金活动未开启"
            return res
        except Exception as e:
            print(e)
            return json.loads(e)
    
    #获取瓜分活动ID
    def guafen_id(token,xpsid):
        try:
            url = f'https://ut.xiaojukeji.com/ut/welfare/api/home/init/v2'
            data = r'{"xbiz":"","prod_key":"welfare-center","xpsid":"' + f"{xpsid}" + r'","dchn":"DpQ3dga","xoid":"3b5d5c47-2c82-4914-b633-227dfc0c687a","uid":"281474990465673","xenv":"passenger","xspm_from":"","xpsid_root":"' + f"{xpsid}" + r'","xpsid_from":"","xpsid_share":"","token":"' + f'{token}' + r'","lat":"23.016388346354166","lng":"113.81221218532986","platform":"na","env":"{\"cityId\":\"21\",\"token\":\"' + f'{token}' + r'\",\"longitude\":\"113.81221218532986\",\"latitude\":\"23.016388346354166\",\"appid\":\"30004\",\"fromChannel\":\"1\",\"deviceId\":\"99d8f16bacaef4eef6c151bcdfa095f0\",\"ddfp\":\"99d8f16bacaef4eef6c151bcdfa095f0\",\"appVersion\":\"6.2.4\",\"userAgent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 BottomBar/on OffMode/0\"}","resparams":"{\"resource_name\":\"ut_welfare_center_play_background,pas_ut_welfare_center_normal,pas_ut_welfare_center_abnormal,pas_ut_welfare_center_more\",\"height\":712,\"width\":534,\"city_id\":0,\"lat\":0,\"lng\":0,\"app_key\":\"server\",\"lang\":\"zh-CN\",\"token\":\"' + f'{token}' + r'\"}","assist_check":true,"os":"ios"}'
            headers = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://page.udache.com/",
                "origin": "https://page.udache.com",
                "host":"ut.xiaojukeji.com",
            }
            response = requests.post(url=url,data=data,headers=headers,verify=False)
            result = response.json()
            divide_data = result['data']['divide_data']['divide']
            activity_id_today = divide_data[today]['activity_id']
            task_id_today = divide_data[today]['task_id']
            count_today = divide_data[today]['button']['count']
            activity_id_tomorrow = divide_data[tomorrow]['activity_id']
            task_id_tomorrow = divide_data[tomorrow]['task_id']
            count = divide_data[tomorrow]['button']['count']
            return activity_id_today,task_id_today,activity_id_tomorrow,task_id_tomorrow,count
        except Exception as e:
            print(e)
            return json.loads(e)
    
    def main(self):
        msg_all = ""
        i = 1
        for check_item in self.check_items:
            token = check_item.get("token")
            xpsid = self.get_xpsid()
            activity_id_today,task_id_today,activity_id_tomorrow,task_id_tomorrow,count = self.guafen_id (token=token, xpsid=xpsid)
            msg = (
                f"账号 {i}\n------ 滴滴福利金开始------\n"
                + self.do_sign(token=token,xpsid=xpsid)
                + "\n"
                + self.guafen_Sign (token=token,xpsid=xpsid, activity_id_today=activity_id_today, task_id_today=task_id_today)
                + "\n"
                + self.guafen (token=token,xpsid=xpsid, activity_id_tomorrow=activity_id_tomorrow,task_id_tomorrow,count=task_id_tomorrow,count)
                + "\n"
                + self.get_fulijin(token=token,wsgsig=wsgsig)
                + "\n------ 滴滴福利金结束------"
            )
            i += 1
            msg_all += msg + "\n\n"     
        return msg_all

if __name__ == "__main__":
    data = get_data()
    _check_items = data.get("DIDI", [])
    res = DIDIflj(check_items=_check_items).main()
    send("滴滴福利金", res)        
