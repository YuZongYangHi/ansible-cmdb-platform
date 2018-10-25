#!/usr/bin/env python
# -*- coding:utf-8 -*- 

import json 
import sys 
import os
import django
import subprocess 
sys.path.append('../../')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from assets.models import Group
from assets.utils.assets_group import Groups
from assets.utils.assets_host  import Hosts 
from release.lib.api_msg import ResponseMessage
from release.models import Host_release,Operation_logs
from django.conf import settings 
from publice.lib.sendmails import Sendmail
from publice.lib.remove_header import Header_Message


request_header = Header_Message()

api = ResponseMessage()


class HanderTaskRun:

    def __init__(self,request):
        self.request = request
        self.data = self.request.POST


    def auth(self):
        token = self.request.POST.get('token')
        #asdlhmnbxvclsdkasld
        assert token == settings.RELEASE_TOKEN

    def filter(self):
        '''
            release_type: (adhoc,playbook),
            file:
            cmd:
            token:
            host_name:
            group_name 
        '''
       
        #if self.data['release_type'] == 'adhoc':
        option = {}
        option['type'] = self.data['release_type']
       # print(self.data['module'])
       # print(self.data['cmd'])
        if self.data['option'] == 'false':
            
            hostname_list = [ i for i in self.data['use_hosts'].split(',') if i.strip()]
            option['host'] = self.Host_filter(hostname_list)
        else:
            option['host'] = self.data['group_name']

        if self.data['release_type'] == 'adhoc':
           option['cmd'] = {self.data['module']:self.data['cmd']}
        else:
            option['cmd'] = self.data['cmd']
        
        return option

    def Host_filter(self,hosts):
        h_instance = Hosts(self.request)
        result = []
        for i in hosts:
            queryset = h_instance.select(host=i,is_json=False,response_all=False)
            result.append(queryset.first().ip_address)
        return result

    def run(self):
        try:
            self.auth()
        except AssertionError:
            return 0
        
        option = self.filter()

        _opertor = Operation_logs(username=request_header.current_user(self.request),operation_msg='发布任务')
        _opertor.save()

        _obc = Host_release(host=option['host'],release_type=option['type'],release_status=False,release_cmd=option['cmd'])
        _obc.save()
       
        command = 'python %s "%s"' % (settings.PROCESS_TASK_RELEASE,option)

        subprocess.Popen(command,shell=True)

        task_id =  Host_release.objects.filter(host=option['host']).filter(release_status=0).first()
        return task_id.id



