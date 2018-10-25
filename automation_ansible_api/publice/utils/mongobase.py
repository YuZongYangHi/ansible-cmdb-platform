#!/usr/bin/env python
# -*- coding:utf-8 -*-
import sys
import os
import django
sys.path.append('../../')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from assets.models import Host
from mongoengine import *
from django.conf import settings 

connect(settings.MONGODB_DATABASE, host=settings.MONGODB_HOST, port=settings.MONGODB_PORT)

class Host_state(Document): 
    host  = StringField(required=True)
    state = IntField(required=True)



#user1 = Host_state.objects.all().first().delete()

class MongoBase(object):

	def add(self,host,state=0):
		_is_have = Host_state.objects.filter(host=host).first()
		if not _is_have:
			Host_state(host=host,state=state).save()
		return True 
	
	def remove(self,host):
		_instance = Host_state.objects.filter(host=host).first()
		if _instance:
			_instance.delete()
		return True 

	def update(self,old_host,new_host,state=None):
		_instance = Host_state.objects.filter(host=old_host).first()
		if _instance:
			_instance.host = new_host 
			_instance.save()
		return True 

	def query(self,host=None):
		if host:
			result = Host_state.objects.filter(host=host).first()
		else:
			result = Host_state.objects.all()
		return result 


if __name__ == '__main__':
	s = Host_state.objects.all()
	for i in s:
		print(i.host)
#Host_state.objects.all().delete()
