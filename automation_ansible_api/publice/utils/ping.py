#!/usr/bin/env python
# -*- coding:utf-8 -*- 

import subprocess
import re 
import sys 
import time 
import sys,os,django,json
sys.path.append('../../')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from threading   import Thread,Lock
from django.conf import settings 
from mongoengine import *

connect(settings.MONGODB_DATABASE, host=settings.MONGODB_HOST, port=settings.MONGODB_PORT,connect=False)

lock = Lock()

class Host_state(Document):
    host  = StringField(required=True)
    state = IntField(required=True)


def run(ip,state):
	p = subprocess.Popen(["ping -c 1 -i 0.2 -W 3 "+ ip],	
		stdin = subprocess.PIPE,
		stdout = subprocess.PIPE,
		stderr = subprocess.PIPE,
		shell = True)
	out = p.stdout.read()
	regex = re.findall("received, (.*?)% packet",out.decode())
	if regex:
		number = regex[0]
		if float(number) != float(100.0) or float(number) == float(0.00):
			response  = True 
		else:
			response = False 
	else:
		response  = False 
	print(regex)	
	if response:
		status = 1
	else:
		status = 2
	with lock:
		this = Host_state.objects.filter(host=ip).first()
		if this:
			this.state = status 
			this.save()

if __name__ == '__main__':
	while True:
		for i in Host_state.objects.all():
			thread = Thread(target=run,args=(i.host,i.state))
			thread.start()
			thread.join()
		time.sleep(2)
