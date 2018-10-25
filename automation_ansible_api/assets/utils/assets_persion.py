#!/usr/bin/env python
# -*- coding:utf-8 -*-

import sys,os,django,json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from assets.models import Manager_persion
from publice.lib.remove_header import Header_Message
from release.models import Operation_logs
import logging 

logger_info  = logging.getLogger('assets_info')
logger_error = logging.getLogger('assets_error')
request_header = Header_Message()

class Persions(object):
    '''
        负责人信息封装
    '''

    def __init__(self,request):
        self.request = request 

    def add(self,name,phone):
        is_have = Manager_persion.objects.filter(persion=name).first()
        if not is_have:
            _save = Manager_persion(persion=name,phone=phone)
            _save.save()
            logger_info.info('用户:%s 添加联系人:%s' % (request_header.current_user(self.request),name))
            Operation_logs(username=request_header.current_user(self.request),operation_msg="添加联系人:%s" % name).save()
            return True 
        return False


    def remove(self,name):
        is_have = Manager_persion.objects.filter(persion=name).first()
      
        if is_have:
            is_have.delete()
            logger_info.info('用户:%s 删除联系人:%s' % (request_header.current_user(self.request),name))
            Operation_logs(username=request_header.current_user(self.request),operation_msg="删除联系人:%s" % name).save()
            return True 
        return False

    def update(self,old_persion,new_persion=None,new_phone=None):
        is_have = Manager_persion.objects.filter(persion=old_persion).first()
        if is_have:
            if new_persion:
                is_have.persion = new_persion
            if new_phone:
                is_have.phone = new_phone
            is_have.save()
            logger_info.info('用户:%s 修改联系人:%s' % (request_header.current_user(self.request),old_persion))
            Operation_logs(username=request_header.current_user(self.request),operation_msg="修改联系人:%s" % old_persion).save()
            return True 
        return False

    def select(self,name=None,is_number=None,*,is_json=True,response_all=True):

        if response_all: 
            queryset = Manager_persion.objects.all()

        elif name and not response_all:
            queryset = Manager_persion.objects.filter(persion__contains=name)

        if queryset:
            if is_json:
                data = []
                for i in queryset:
                    temp = {
                        "id": i.id,
                        "persion": i.persion,
                        "phone": i.phone,
                        "operation": i.persion
                    }
                   
                    data.append(temp)
                return json.dumps(data)
            return queryset
        return []




