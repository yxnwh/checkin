# -*- coding: utf-8 -*-
"""
cron: 43 7 * * *
new Env('数码之家');
"""

import requests
import time
import json
import re

from notify_mtr import send
from utils import get_data


class mydigit:
    def __init__(self, check_items):
        self.check_items = check_items

    @staticmethod
    def sign(cookie):
        result = ""
        headers = {
            "Cookie": cookie,
            "Host": "www.mydigit.cn",
            "Referer": "https://www.mydigit.cn/home.php",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
        }
        s = requests.session()
        resp = s.get( "https://www.mydigit.cn/k_misign-sign.html", headers=headers )
        time.sleep(2)
		print(resp.content)
#        s.headers.update({'Origin': 'https://www.kejiwanjia.com/', 'Authorization': authorization,})
#        resp = s.post( "https://www.kejiwanjia.com/wp-json/b2/v1/userMission", headers=headers )
#        ta = resp.json()
#        tb = json.loads(ta)
#        if int(ta) < 100 :
#            result += f"今天已签到\n\n获得积分：{int(ta)}"
#        else:
#            result += f"签到成功\n\n已连续签到：{tb['mission']['always']}\n获得积分：{tb['mission']['credit']}\n总积分：{tb['mission']['my_credit']}"
        return result

    def main(self):
        i = 1
        msg_all = ""
        for check_item in self.check_items:
            cookie = check_item.get("cookie")
            sign_msg = self.sign(cookie=cookie)
            msg = f"账号 {i} 签到状态: {sign_msg}"
            msg_all += msg + "\n\n"
            i += 1
        return msg_all


if __name__ == "__main__":
    data = get_data()
    _check_items = data.get("MYDIGIT", [])
    res = mydigit(check_items=_check_items).main()
    send("数码之家", res)
