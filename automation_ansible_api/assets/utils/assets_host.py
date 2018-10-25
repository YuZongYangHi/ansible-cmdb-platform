#!/usr/bin/env python
# -*- coding:utf-8 -*- 

import sys,os,django,json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from  assets.models import Host,Group,Manager_persion
from .assets_group  import Groups
from publice.lib.remove_header import Header_Message
from release.models import Operation_logs
from .assets_persion import Persions
from publice.utils.mongobase import MongoBase


import logging 

logger_info  = logging.getLogger('assets_info')
logger_error = logging.getLogger('assets_error')

request_header = Header_Message()


class Hosts(object):
    '''
        封装主机表
    '''
    def __init__(self,request):
        self.request = request 

    def add(self,name,ip,state=None,*,group,persion):
        '''
            添加主机,group必须存在，因为多对多原因，group必须是一个queryset对象
        '''
          
        _persion_instance = Manager_persion.objects.filter(persion=persion).first()
        is_have = Host.objects.filter(ip_address=ip).first()
        if not is_have:
        
            new_data = Host(
                host_name=name,
                ip_address=ip,
                running_state=0,
                manager_persion=_persion_instance
                )
            new_data.save()
            _mongo = MongoBase()
            _mongo.add(ip)
            _group_instance = Group.objects.filter(name=group).first()
            logger_info.info('用户:%s 添加主机:%s' % (request_header.current_user(self.request),name))
            Operation_logs(username=request_header.current_user(self.request),operation_msg="添加主机:%s" % name).save()
            new_data.group_name.add(_group_instance)
            return True 

    def remove(self,hostname):
        '''
            删除主机,删除不存在主外键关系,自动解除。
        '''
        asset = Host.objects.filter(host_name=hostname).first()
        if asset:
            asset.delete()
            logger_info.info('用户:%s 删除主机:%s' % (request_header.current_user(self.request),hostname))
            Operation_logs(username=request_header.current_user(self.request),operation_msg="删除主机:%s" % hostname).save()
            _mongo = MongoBase()
            _mongo.remove(asset.ip_address)
            return True 
        return False 
    
    def update(self,old_host=None,host=None,ip=None,running=None,persion=None,group=None,*,option=True):
        
        if option:
            _instance = Host.objects.filter(host_name=old_host).first()
            
            if _instance:
                old_ip = _instance.ip_address
                _persion = Persions(self.request)
                _group = Groups(self.request)
                res_group = Group.objects.filter(name=group)
                res_persion = Manager_persion.objects.filter(persion=persion).first()
                _instance.host_name  = host
                _instance.ip_address = ip 
                _instance.manager_persion = res_persion
                _instance.group_name.set(res_group)
                _instance.save()
                _mongo = MongoBase()
                _mongo.update(old_ip,ip)
                if not running:
                    logger_info.info('用户:%s 修改主机:%s' % (request_header.current_user(self.request),old_host))
                    Operation_logs(username=request_header.current_user(self.request),operation_msg="修改主机:%s" % old_host).save()
                return True 
            return False



    def select(self,host=None,is_number=None,*,is_json=True,response_all=True):
        '''
        查询数据,response_all为true时返回所有数据 
        '''
        data = []
       #print(self.request.META['REMOTE_ADDR'])
        if response_all:
            queryset = Host.objects.all().order_by('-running_state')
            #data =  serializers.serialize(queryset=queryset,format='json')
        else:
            queryset = Host.objects.filter(host_name__contains=host).order_by('-running_state')
            #if not queryset[0]:
               # return data

        if queryset:
            if is_json:
                handler_state = MongoBase()

                for i in queryset:
                    try:
                        groupname = i.group_name.all().first().name
                    except Exception as e:
                        groupname = None 
                    
                    try:
                        persion = i.manager_persion.persion
                        number = Manager_persion.objects.filter(persion=persion).first().phone
                       
                    except Exception as e:
                        persion = None
                        number = None 
                    running_state = handler_state.query(host=i.ip_address)
                    temp = {
                        "id": i.id,
                        "hostname": i.host_name,
                        "group": groupname,
                        "address": i.ip_address,
                        "running": running_state.state,
                        "persion": persion,
                        "operation": i.host_name
                    }
                    if is_number:
                        temp['persion'] = [persion,number]

                    data.append(temp)
                data = sorted(data,key=lambda handler: handler['running'],reverse=True)
                return json.dumps(data)
            return queryset
        return []
        






