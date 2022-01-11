# -*- coding: utf8 -*-
"""
cron: 17 7 * * *
new Env('科技玩家');
"""
import requests
import os
import time

from notify_mtr import send
from utils import get_data

info= ""

class KJWJ:
    def login(usr, pwd):
        session = requests.Session()
        login_url = 'https://www.kejiwanjia.com/wp-json/jwt-auth/v1/token'
        headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
        data = {
            'nickname': '',
            'username': usr,
            'password': pwd,
            'code': '',
            'img_code': '',
            'invitation_code': '',
            'token': '',
            'smsToken': '',
            'luoToken': '',
            'confirmPassword': '',
            'loginType': ''
        }
        respon = session.post(login_url, headers=headers, data=data)
        if respon.status_code == 200:
            status = respon.json()
            info += f"账号：{status.get('name')}登陆成功\n"
            info += f"ID：{status.get('id')}\n"
            info += f"金币：{status.get('credit')}\n"
            info += f"等级：{status.get('lv').get('lv').get('name')}\n"
            token = status.get('token')
            check_url = 'https://www.kejiwanjia.com/wp-json/b2/v1/userMission'
            check_head = {
                'authorization': f'Bearer {token}',
                'origin': 'https://www.kejiwanjia.com',
                'referer': 'https://www.kejiwanjia.com/task',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
    
            }
            respons = session.post(check_url, headers=check_head)
            if respons.status_code == 200:
                desp = respons.json()
                if type(desp) == str:
                    info += f"已经签到：{info}金币\n\n"
                else:
                    info += f"签到成功：{info.get('credit')}金币\n\n"
        else:
            info += f"账号登陆失败: 账号或密码错误\n\n"
        return info
    
    def main(self):
        i = 0
        msg = ""
        msg += "检测到 " + str(len(self.check_items)) + " 个科技玩家帐户，开始签到："
        for check_item in self.check_items:
            username = check_item.get("username")
            password = check_item.get("password")
            try:
                msg += self.login(username, password)
            except Exception as e:
                msg += "程序执行异常：" + str(e)
        return msg

if __name__ == "__main__":
    data = get_data()
    _check_items = data.get("KJWJ", [])
    res = KJWJ(check_items=_check_items).main()
    send("科技玩家", res)
