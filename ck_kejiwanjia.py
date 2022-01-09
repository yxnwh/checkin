# -*- coding: utf-8 -*-
"""
cron: 27 7 * * *
new Env('科技玩家');
"""

import requests
import time
import json

from notify_mtr import send
from utils import get_data


class kejiwanjia:
    def __init__(self, check_items):
        self.check_items = check_items

    @staticmethod
    def sign(cookie,authorization):
        result = ""
        headers = {
            "Cookie": cookie,
            "Host": "www.kejiwanjia.com",
            "Referer": "https://www.kejiwanjia.com/mission/today",
            #User-Agent最好更换为自己的
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Mobile/15E148 Safari/604.1",
        }
        s = requests.session()
        resp1 = s.get( "https://www.kejiwanjia.com/mission/today", headers=headers )
        time.sleep(1)
        s.headers.update({'Origin': 'https://www.kejiwanjia.com/', 'Authorization': authorization,})
        resp = s.post( "https://www.kejiwanjia.com/wp-json/b2/v1/userMission", headers=headers )
        ta = resp.content.json()
        tb = json.loads(ta)
        if int(ta) < 100 :
            result += f"今天已签到\n\n获得积分（签到可能未成功，请登录网页查看）：{int(ta)}"
        else:
            result += f"签到成功\n\n已连续签到：{tb['mission']['always']}\n获得积分：{tb['mission']['credit']}\n总积分：{tb['mission']['my_credit']}"
        s.close()
        return result

    def main(self):
        i = 1
        msg_all = ""
        for check_item in self.check_items:
            cookie = check_item.get("cookie")
            authorization = 'Bearer '+cookie
            cookie = 'b2_token='+cookie
            sign_msg = self.sign(cookie=cookie,authorization=authorization)
            msg = f"账号 {i} 签到状态: {sign_msg}\n"
            msg_all += msg + "\n"
            i += 1
        return msg_all


if __name__ == "__main__":
    data = get_data()
    _check_items = data.get("KEJIWANJIA", [])
    res = kejiwanjia(check_items=_check_items).main()
    send("科技玩家", res)
