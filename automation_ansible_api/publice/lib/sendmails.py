#!/usr/bin/env python
# -*- coding:utf-8 -*- 

import sys
import os
import django
sys.path.append('../../')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from django.core import mail 
from django.conf import settings

class Sendmail(object):
    def __init__(self,subject,message):
        self.title = subject
        self.content = message

    def send(self):
        mail.send_mail(self.title,self.content,settings.EMAIL_HOST_USER,settings.ACCEPT_LIST,fail_silently=False)
        

if __name__ == '__main__':
    this = Sendmail('康亮亮','123123')
    this.send()