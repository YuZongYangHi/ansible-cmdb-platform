#!/usr/bin/env python
# -*- coding:utf-8 -*- 

import sys,os,django,json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from assets.models import Group
from publice.lib.remove_header import Header_Message
from release.models import Operation_logs
import logging 

logger_info  = logging.getLogger('assets_info')
logger_error = logging.getLogger('assets_error')
request_header = Header_Message()

class Groups(object): 
    '''
        ansible 主机群组封装类
    '''

    def __init__(self,request):
        self.request = request 

    def add(self,name):
        ''' 
            多值添加，添加前会去判断当前是否存在该主机群组，如果不存在则添加
        '''
        
        is_null = Group.objects.filter(name=name).first()

        if not is_null:
            handler = Group(name=name)
            handler.save()
            logger_info.info('用户:%s 添加主机组:%s' % (request_header.current_user(self.request),name))
            Operation_logs(username=request_header.current_user(self.request),operation_msg="添加主机组:%s" % name).save()
            return True 
        return False
    
    def update(self,source_name=None,new_name=None):
        '''
            修改主机群组名称,不推荐使用update方法，直接filter去过滤查询到的主机群组进行更新
        '''
        update_group = Group.objects.filter(name=source_name).first()
        if update_group:
            update_group.name = new_name
            update_group.save()
            logger_info.info('用户:%s 修改主机组:%s' % (request_header.current_user(self.request),source_name))
            Operation_logs(username=request_header.current_user(self.request),operation_msg="修改主机组:%s" % source_name).save()
            return True 
        return False 

    def remove(self,name):
        '''
            删除主机群组，filter出来进行删除
        '''
        result = Group.objects.filter(name=name).first()
        if result:
            result.delete() 
            logger_info.info('用户:%s 删除主机组:%s' % (request_header.current_user(self.request),name))
            Operation_logs(username=request_header.current_user(self.request),operation_msg="删除主机组:%s" % name).save()  
            return True 
        return False 

    def select(self,name=None,*,is_json=True,response_all=True):
        '''
            查找主机组,response_all为true时,则返回所有数据
            否则换回传递参数的数据
        '''
        data = []

        
        if response_all:
            query = Group.objects.all()
        else:
            query = Group.objects.filter(name__contains=name)

        if query:
            if is_json:
                for i in query:
                    temp = {
                        "id": i.id,
                        "groupname": i.name,
                        "operation": i.name
                    }
                    data.append(temp)
                return json.dumps(data)
            return query
        return []








