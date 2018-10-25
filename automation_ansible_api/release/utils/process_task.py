#!/usr/bin/env python
# -*- coding:utf-8 -*- 

import json 
import sys 
import os
import django
import time 
import yaml 
sys.path.append('/Users/helloyuyang/Python/project/automation_ansible_api')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()

from django.conf import settings
from release.models import Host_release
from release.utils.ansible_base import AnsibleBase

class ReleaseTask:
    def __init__(self,option):
        self.option = eval(option) 
        self.ansible = AnsibleBase()


    def run(self):
        
        if self.option['type'] == 'adhoc':
            #adhoc
            kwargs = {}
            host = self.option['host']
            for k,v in self.option['cmd'].items():
                module = k 
                cmd = v 
            if '='  in cmd:
                split = cmd.strip().split()
                for i in split:
                    name,value = i.split('=')
                    kwargs[name] = value

            response = self.ansible.run(host,module,cmd,**kwargs)
                      
        else:
            #playbook 
            yml = self.option['cmd']
            
            file = settings.PLAY_BOOK + yml
            
            old_yml = open(file.strip(),'r')
            old_file = yaml.load(old_yml.read())

            if isinstance(self.option['host'],list):
                host = ''
                for i in self.option['host']:
                    host += i + ','
                host = host.rstrip(',')
            else:
                host = self.option['host']
  
            old_file[0]['hosts'] = host 
           

            yml = open(file.strip(),'w')
            yaml.dump(old_file,yml)
            yml.close()
               
            response = str(self.ansible.play(file.strip()))

        this = Host_release.objects.filter(host=self.option['host']).filter(release_status=0).first()
            
        if this:
            this.release_status = True 
            this.content = response
            this.save()



if __name__ == '__main__':
    option = sys.argv[1]

    _c = ReleaseTask(option)
    _c.run()