# -*- coding: utf-8 -*-
"""
cron: 27 7 * * *
new Env('科技玩家');
"""

import requests
import time

from notify_mtr import send
from utils import get_data


class kejiwanjia:
    def __init__(self, check_items):
        self.check_items = check_items

    @staticmethod
    def sign(cookie):
        result = ""
        headers = {
            "Cookie": cookie,
			"Host": "www.kejiwanjia.com",
			"Referer": "https://www.kejiwanjia.com/mission/today",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Mobile/15E148 Safari/604.1",
        }
		s = requests.Session()
        s.get( "https://www.kejiwanjia.com/mission/today", headers=headers )
		time.sleep(2)
		s.headers.update({'Origin': 'https://www.kejiwanjia.com/' , 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3Lmtlaml3YW5qaWEuY29tIiwiaWF0IjoxNjQxNTY4ODU1LCJuYmYiOjE2NDE1Njg4NTUsImV4cCI6MTY0MjM0NjQ1NSwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMTI2OTAifX19.IZli32ODEWdulvKfZER6utlDh3oL8Ifo83kAX-z7LHo'})
		resp = s.post( "https://www.kejiwanjia.com/mission/today", headers=headers )
		totalmessage = resp.json()
		#dailycredit = resp.json().get("credit")
		#totalcredit = resp.json().get("my_credit")

        #if "您需要先登录才能继续本操作" in fc:
        #    result += "Cookie 失效"
        #elif "恭喜" in fc:
        #    result += "签到成功"
        #elif "不是进行中的任务" in fc:
        #    result += "不是进行中的任务"
        #else:
        #    result += "签到失败"
        #return result

    def main(self):
        i = 1
        msg_all = ""
        for check_item in self.check_items:
            cookie = check_item.get("cookie")
	    authorization = check_item.get("authorization")
            sign_msg = self.sign(cookie=cookie)
            msg = f"账号 {i} 签到状态: {sign_msg}"
            msg_all += msg + "\n\n"
            i += 1
        return msg_all


if __name__ == "__main__":
    data = get_data()
    _check_items = data.get("KEJIWANJIA", [])
    res = kejiwanjia(check_items=_check_items).main()
    send("科技玩家", res)
