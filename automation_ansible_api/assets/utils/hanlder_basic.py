#!/usr/bin/env python
# -*- coding:utf-8 -*- 

import re 
import logging 
import time 
import json 
import sys 
import requests 

logging.basicConfig(
                level=logging.DEBUG,
                format='%(asctime)s %(filename)s %(levelname)s %(message)s')
logger = logging.getLogger('devops')

logger.setLevel(logging.DEBUG)

regex_ip = r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}"

regex_gname = r"\[(.*?)\]"

regex_hname = r"(.*?):"

result = []

url = "http://127.0.0.1:8000/v1/assets/basic_sync/"

header = {
		"Authorization" : "devops Un/46MfEnyjmqQPOSFNTSxNIir0="
	}

def handler_files(files):
    with open(files,'r') as f:
        files = f.readlines()
        return files 

#公共调用
def handler_publice():
    '''
        默认寻找/etc/ansible/hosts读取ip地址
    '''
    return 
    
#netpas配置
def handler_default():
    ''' 
        warning: 注意该函数仅对作者我思调用初始化
        1: 读取/etc/ansible/hosts配置文件
        2: 地区/etc/hosts主机名称
    '''
    temp = {}
    ans_files = handler_files('ansible_hosts')
    ips_files = handler_files('etc_hosts')
    logger.info('staring......')
    #time.sleep(3)
    for f in ans_files:
        group = re.findall(regex_gname,f.strip())
        if group:
            time.sleep(2)
            temp[group[0]] = {}
            group_name = group[0]
            logger.debug('采集主机组:%s' % str(group_name))
            time.sleep(2)
        
        ip = re.findall(regex_ip,f.strip())
        host = re.findall(regex_hname,f.strip())
        for i in (ip,host):
            if i and i[0] not in temp.values():
                for ip in ips_files:
                    if ip.split(' ')[-1].strip() == i[0]:
                        ip_address = ip.split(' ')[0]
                        temp[group_name][i[0]] = ip_address
                        logger.debug('采集主机:%s,ip地址:%s' % (i[0],ip_address))
        time.sleep(0.1)
    logger.info('正在入库...........')
    data = {
        "body": json.dumps(temp)
    }
    html = requests.post(url,data=data,headers=header).text
    print(html)

if __name__ == '__main__':
    handler_default()
