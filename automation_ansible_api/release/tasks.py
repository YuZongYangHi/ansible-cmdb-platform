#!/usr/bin/env python
#-*- coding:utf-8 -*- 

from __future__ import absolute_import, unicode_literals
from celery import shared_task,task,app
from release.utils.ansible_base import AnsibleBase
from multiprocessing import current_process
from automation_ansible_api.celery import app


#@shared_task
@app.task
def ansible(*args,**kwargs):
    current_process()._config = {'semprefix': '/mp'}
  
    host_list = kwargs.get('host')
    instance = AnsibleBase()
    instance.run(host_list=host_list,moduls='shell',_args=args[0])
 