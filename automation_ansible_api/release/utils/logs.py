#!/usr/bin/env python
# -*- coding:utf-8 -*- 

import sys,os,django,json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from release.models import Record_logs,Operation_logs


class LogBase(object):

    def query(self,_instance,option=False):
        
        queyset = _instance.objects.all().order_by('-operation_time')
        data = []

        for i in queyset:
            temp = {
                "id": i.id,
                "username": i.username,
                "operation_time": i.operation_time
                }
            if option:
                temp['messages'] = i.operation_msg 
            data.append(temp)
        return data 
        
    def search(self,_instance,user=None,event=None,option=False):
        if user and event:
            queryset = _instance.objects.filter(username__contains=user).filter(operation_msg__contains=event).order_by('-operation_time')
        
        elif event:
            queryset = _instance.objects.filter(operation_msg__contains=event).order_by('-operation_time')

        else:
            queryset = _instance.objects.filter(username__contains=user).order_by('-operation_time')

        data = []

        for i in queryset:
            temp = {
                "id": i.id,
                "username": i.username,
                "operation_time": i.operation_time
                }
            if option:
                temp['messages'] = i.operation_msg 
            data.append(temp)
        return data


