#!/usr/bin/env python
# -*- coding:utf-8 -*- 

import sys
import os
import django
import json 
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from assets.utils.assets_group import Groups
from assets.utils.assets_host  import Hosts
from assets.models import Host,Group


class BasicInit(object):

    def __init__(self,data):
        self.data = json.loads(data)

    def initialize(self):
        for group in self.data:
            gresponse = Groups()
            asserts = gresponse.add(group)
           # if  asserts:
              #  raise ValueError('init is ok ')
            for k,v in self.data[group].items():
               
                hresponse = Hosts()
                gname = Group.objects.filter(name=group).first()
                
                hresponse.add(k,v,'0',group=gname)