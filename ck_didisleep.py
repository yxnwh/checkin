# -*- coding: utf-8 -*-
# @url: https://raw.githubusercontent.com/yxnwh/kevinxf/main/xF_DiDi_DZDZ_Sleep.py
# @author: zyf1118
"""
cron: 1 6,22 * * *
new Env('滴滴多走多赚-起床睡觉');
"""
import requests
import json, sys, os, re
import time, datetime,random

from notify_mtr import send
from utils import get_data

requests.packages.urllib3.disable_warnings()

today = datetime.datetime.now().strftime('%Y-%m-%d')
mor_time = '07:00:00.00000000'
after_time = '23:00:00.00000000'
moringtime = '{} {}'.format (today, mor_time)
sleeptime = '{} {}'.format (today, after_time)

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

class DIDIsleep:
    def __init__(self, check_items):
        self.check_items = check_items
        
    #获取xpsid
    def get_xpsid(self):
        try:
            url = f'https://v.didi.cn/p/DpzAd35'
            heards = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
            }
            response = requests.head (url=url, headers=heards, verify=False)  # 获取响应请求头
            res = response.headers['Location']  # 获取响应请求头
            # print(res)
            r = re.compile (r'root_xpsid=(.*?)&channel_id')
            xpsid = r.findall (res)[0].split("&")[0]
            return xpsid
        except Exception as e:
            print (e)
    
    #睡觉
    @staticmethod
    def sleep(token,xpsid,wsgsig):
        try:
            wsgsig = wsgsig[random.randint (0, 25)]
            url = f'https://res.xiaojukeji.com/sigma/api/sleep/sleep/v2?wsgsig={wsgsig1}'
            heards = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://page.udache.com/",
                "Host": "res.xiaojukeji.com",
                "Origin": "https://page.udache.com",
                "ticket":f"{token}",
                "Content-Type":"application/json",
            }
            data = r'{"xbiz":"240300","prod_key":"ut-walk-bonus","xpsid":"1265f6d94e3e48f686f1be0245c27fd2","dchn":"aXxR1oB","xoid":"aA/iet7vTTmdKCRAgoHwyg","uid":"281474990465673","xenv":"passenger","xspm_from":"","xpsid_root":"1265f6d94e3e48f686f1be0245c27fd2","xpsid_from":"","xpsid_share":"","version":1,"source_from":"app","ticket":"Ag8aVeRbZ1yee4AsBI69GkodAzZQRoQqykuols0cKZEkzDluAzEMQNG7_JoYkKJESWzT5w5ZJkujADFcDXx3Y-z-4R0sJfFNN0VYRpqwCmmqqsJy0nqbJbxajDJdWJW0qK16jNaF1UheXhHeSBDeyTKs9jqn1mjRXfgkp7CTB5e_6__HTupN-Dor7xH6qL5JzNvQMaJrIPw8y9-T3wMAAP__","env":{"ticket":"Ag8aVeRbZ1yee4AsBI69GkodAzZQRoQqykuols0cKZEkzDluAzEMQNG7_JoYkKJESWzT5w5ZJkujADFcDXx3Y-z-4R0sJfFNN0VYRpqwCmmqqsJy0nqbJbxajDJdWJW0qK16jNaF1UheXhHeSBDeyTKs9jqn1mjRXfgkp7CTB5e_6__HTupN-Dor7xH6qL5JzNvQMaJrIPw8y9-T3wMAAP__","cityId":"21","longitude":113.81250027126737,"latitude":23.016204427083334,"newAppid":10000,"isHitButton":true,"ddfp":"99d8f16bacaef4eef6c151bcdfa095f0","deviceId":"99d8f16bacaef4eef6c151bcdfa095f0","appVersion":"6.2.4","userAgent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0","fromChannel":"1"},"city_id":"21"}'
            response = requests.post (url=url, headers=heards,verify=False,data=data)
            result = response.json()
            print("sleep#睡觉")
            print (result)
            errmsg = result['errmsg']
            if "睡觉状态错误" in errmsg:
                res = "睡觉状态错误"
            elif errmsg == 'success':
               res = "已执行睡觉命令"
            else:
               res = errmsg
            return res
        except Exception as e:
            print (e)
    
    #睡醒
    @staticmethod
    def wakeup(token,xpsid,wsgsig):
        try:
            wsgsig = wsgsig[random.randint (0, 25)]
            url = f'https://res.xiaojukeji.com/sigma/api/sleep/wake/v2?wsgsig={wsgsig1}'
            heards = {
                "user-agent": f"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0",
                "Referer": "https://page.udache.com/",
                "Host": "res.xiaojukeji.com",
                "Origin": "https://page.udache.com",
                "ticket":f"{token}",
                "Content-Type":"application/json",
            }
            data = r'{"xbiz":"240300","prod_key":"ut-walk-bonus","xpsid":"46c633fd0c98480e858b4a0a414ef717","dchn":"aXxR1oB","xoid":"aA/iet7vTTmdKCRAgoHwyg","uid":"281474990465673","xenv":"passenger","xspm_from":"","xpsid_root":"46c633fd0c98480e858b4a0a414ef717","xpsid_from":"","xpsid_share":"","version":1,"source_from":"app","ticket":"Ag8aVeRbZ1yee4AsBI69GkodAzZQRoQqykuols0cKZEkzDluAzEMQNG7_JoYkKJESWzT5w5ZJkujADFcDXx3Y-z-4R0sJfFNN0VYRpqwCmmqqsJy0nqbJbxajDJdWJW0qK16jNaF1UheXhHeSBDeyTKs9jqn1mjRXfgkp7CTB5e_6__HTupN-Dor7xH6qL5JzNvQMaJrIPw8y9-T3wMAAP__","env":{"ticket":"Ag8aVeRbZ1yee4AsBI69GkodAzZQRoQqykuols0cKZEkzDluAzEMQNG7_JoYkKJESWzT5w5ZJkujADFcDXx3Y-z-4R0sJfFNN0VYRpqwCmmqqsJy0nqbJbxajDJdWJW0qK16jNaF1UheXhHeSBDeyTKs9jqn1mjRXfgkp7CTB5e_6__HTupN-Dor7xH6qL5JzNvQMaJrIPw8y9-T3wMAAP__","cityId":"21","longitude":113.81259847005208,"latitude":23.01628173828125,"newAppid":10000,"isHitButton":true,"ddfp":"99d8f16bacaef4eef6c151bcdfa095f0","deviceId":"99d8f16bacaef4eef6c151bcdfa095f0","appVersion":"6.2.4","userAgent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 didi.passenger/6.2.4 FusionKit/1.2.20 OffMode/0","fromChannel":"1"},"city_id":"21"}'
            response = requests.post (url=url, headers=heards,verify=False,data=data)
            result = response.json()
            print("wakeup#睡醒")
            print (result)
            errmsg = result['errmsg']
            if "起床状态错误" in errmsg:
                res = "当前在睡醒状态,无法领取健康豆"
            elif errmsg == 'success':
                message_text = result['data']['message_text']
                if "只有多多休息" in message_text:
                    res = "当前在睡醒状态,无法领取健康豆"
                else:
                    bonus_amount = result['data']['bonus_amount']
                    res = "已执行睡醒命令,获取{bonus_amount}健康豆"
            else:
                res = errmsg
            return res
        except Exception as e:
            print (e)

    def main(self):
        msg_all = ""
        i = 1
        for check_item in self.check_items:
            token = check_item.get("token")
            xpsid = self.get_xpsid()
            nowtime = datetime.datetime.now ().strftime ('%Y-%m-%d %H:%M:%S.%f8')
            if nowtime > moringtime and nowtime < sleeptime:
                msg = (
                    f"账号 {i}\n------ 滴滴多走多赚-睡觉开始------\n"
                    + self.sleep (token=token,xpsid=xpsid,wsgsig=wsgsig)
                    + "\n------ 滴滴多走多赚-睡觉结束------"
                )
            else:
                msg = (
                    f"账号 {i}\n------ 滴滴多走多赚-起床开始------\n"
                    + self.wakeup (token=token,xpsid=xpsid,wsgsig=wsgsig)
                    + "\n------ 滴滴多走多赚-起床结束------"
                )
            i += 1
            msg_all += msg + "\n\n"
        return msg_all

if __name__ == "__main__":
    data = get_data()
    _check_items = data.get("DIDI", [])
    res = DIDIsleep(check_items=_check_items).main()
    send("滴滴多走多赚-起床睡觉", res)  
