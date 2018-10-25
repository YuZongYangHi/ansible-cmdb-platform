#!/usr/bin/env python
# -*- coding:utf-8 -*-
import sys
import os
import django
sys.path.append('../../')
sys.path.append('../')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from assets.models import Host
from mongoengine import *
from django.conf import settings

connect(settings.MONGODB_DATABASE, host=settings.MONGODB_HOST, port=settings.MONGODB_PORT)

class Host_state(Document):
    host  = StringField(required=True)
    state = IntField(required=True)


def main():
	if os.path.isfile(".mongo.id"):
		raise ValueError('init is sync please delete .mongo.id')
	host_list = Host.objects.all()
	for i in host_list:
		user = Host_state(host=i.ip_address,state=0)
		user.save()
	os.system('touch .mongo.id')

if __name__ == '__main__':
	main()
