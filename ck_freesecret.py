# -*- coding: utf-8 -*-
"""
cron: 53 7 * * *
new Env('FREESECRET');
"""

import requests
import base64
import re
import os
import time

from notify_mtr import send
from utils import get_data


class daili:
    def __init__(self, check_items):
        self.check_items = check_items

    def get_link(self):
        url = 'https://proxy.mimvp.com/freesecret'
        res = requests.get(url)
        m = re.findall(r'proxy-ip\'>([0-9.]+)',res.content.decode())
        n = re.findall(r'><img src=([0-9a-zA-Z/?&=]+)',res.content.decode())
        for i in range(len(n)):
            n[i] = 'https://proxy.mimvp.com'+n[i]
        print(n)
        return m,n

    def get_token(ak,sk):
        url = "https://aip.baidubce.com/oauth/2.0/token"
        params = {
            "grant_type": "client_credentials",
            "client_id": ak,
            "client_secret": sk
        }
        headers={
            "Content-Type":"application/json; charset=UTF-8",
        }
        res = requests.get(url,params=params,headers=headers).json()
        access_token = res['access_token']
        return access_token
    
    def baidu_api(token,imgurl):
        ports = []
        for i in range(len(imgurl)):
            request_url = "https://aip.baidubce.com/rest/2.0/ocr/v1/webimage"
            res = requests.get(imgurl[i])
            pic=res.content
            photo = open(r'./1.jpg','wb')
            photo.write(pic)
            photo.close()
            f = open('./1.jpg', 'rb')
            img = base64.b64encode(f.read())
            f.close()
            os.remove('./1.jpg')
            params = {"image":img}
            request_url = request_url + "?access_token=" + token
            headers = {'content-type': 'application/x-www-form-urlencoded'}
            response = requests.post(request_url, data=params, headers=headers).json()
            ports.append(response['words_result'][0]['words']) #空列表使用append添加元素
            time.sleep(3)
        return ports
    
    def main(self):
        ip_cistern = []
        for check_item in self.check_items:
            ak = check_item.get("ak")
            sk = check_item.get("sk")
            ip_tmp = self.get_link()
            token = self.get_token(ak=ak,sk=sk)
            ports = self.baidu_api(token=token,imgurl=ip_tmp[1])
            for j in range(len(nn)):
                ip_cistern.append(ip_tmp[0][j]+':'+nn[j]) #空列表使用append添加元素
            msg = f"获取到的代理池为: {ip_cistern}"
        return msg


if __name__ == "__main__":
    data = get_data()
    _check_items = data.get("FREESECRET", [])
    res = Pojie(check_items=_check_items).main()
    send("FREESECRET", res)