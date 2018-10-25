#!/usr/bin/env python
# -*- coding:utf-8 -*- 

import sys,os,django,json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from publice.utils.ansible_base import AnsibleBase
from assets.models import Host,Describe_message
from mongoengine import *
from django.conf import settings

connect(settings.MONGODB_DATABASE, host=settings.MONGODB_HOST, port=settings.MONGODB_PORT)

class Host_state(Document):
    host  = StringField(required=True)
    state = IntField(required=True)


class FactBase(object):
	def __init__(self):
		pass 

	def get_fact(self,hosts=None):
		'''
			print('主机名:%s' % hostname)
			print('物理内存:%sMB' % wuli_mem)
			print('虚拟内存:%sMB' % virtual_mem)
			print('cpu型号:%s' % cpu_number)
			print('cpu核数:%s' % cpu_he)
			print('系统类型:%s' % operation_system)
			print('系统内核:%s' % system_kernel)
			print('磁盘容量:%s' % all_mount_value['size'])

		'''
		_instance = AnsibleBase()
		if not hosts:
			hosts = []
			get_result = Host.objects.all()
			for i in get_result:
				is_run = Host_state.objects.filter(host=i.ip_address).first()
				if is_run.state == 1:
					hosts.append(i.ip_address)

		result = _instance.run(hosts,'setup')
		if not result['success']:

			return False
		data = result['success']
	
		for  result  in data:
			disks = []
			hostname = data[result]['ansible_facts']['ansible_hostname']
			wuli_mem = data[result]['ansible_facts']['ansible_memtotal_mb']
			virtual_mem = data[result]['ansible_facts']["ansible_memory_mb"]["swap"]["total"]
			cpu_number = data[result]['ansible_facts']["ansible_processor"][-1]
			cpu_he = data[result]['ansible_facts']["ansible_processor_vcpus"]
			operation_system = ''.join(data[result]['ansible_facts']["ansible_distribution"]+ ' ' + data[result]['ansible_facts']["ansible_distribution_version"])
			system_kernel = data[result]['ansible_facts']['ansible_kernel']

			for i in range(len(data[result]['ansible_facts']['ansible_mounts'])):
				temp = {
					"mount":data[result]['ansible_facts']['ansible_mounts'][i]['mount'],
					"size": str(int(int(data[result]['ansible_facts']['ansible_mounts'][i]['size_total'])/1024/1024/1024)) + 'G'
				} 
				disks.append(temp)
			count = 0
			for disk in data[result]['ansible_facts']["ansible_devices"]:
				if disk[0:2] in ("sd", "ss","vd"):

					count += float(data[result]['ansible_facts']["ansible_devices"][disk]['size'].split('G')[0])
			count = str(count) + 'G'
			_instance_example = Describe_message.objects.filter(ip=result).first()
			if _instance_example:
				example = _instance_example
			else:
				example = Describe_message()

			example.host_name = hostname
			example.cpu_type = cpu_number.strip() 
			example.cpu_count = cpu_he 
			example.mhysics_memory = str(wuli_mem) + 'MB'
			example.virtual_memory = str(virtual_mem)   + 'MB'
			example.disk_size = count 
			example.system_type = operation_system
			example.system_kernel = system_kernel
			example.disk_mount = disks
			aliasname = Host.objects.filter(ip_address=result).first()
			example.alias_name  = aliasname.host_name
			example.ip = result
			example.save()
			if isinstance(hosts,str):
				return hostname
		
	def select(self,id=None):
		if id:
			queryset = Describe_message.objects.filter(host_name=id)
		else:
			queryset = Describe_message.objects.all()
		
		if queryset:
			data = []
			for i in queryset:
				temp = {
					"hostname": i.host_name,
					"cpu_type": i.cpu_type,
					"cpu_count": i.cpu_count,
					"mhysics_memory": i.mhysics_memory,
					"virtual_memory": i.virtual_memory,
					"disk_size": i.disk_size,
					"system_type": i.system_type,
					"system_kernel": i.system_kernel,
					"disk_mount": i.disk_mount
				}
				data.append(temp)
			return json.dumps(data)
		return []

	def update(self,update_host):
		ip = Describe_message.objects.filter(host_name=update_host).first()
		
		if ip:
			ip_addr = ip.ip 
		else :
			ip = Host.objects.filter(host_name=update_host).first()
			ip_addr = ip.ip_address 

	
		new_host = self.get_fact(ip_addr)
		if not new_host:
			return True 
		result = Host.objects.filter(host_name=update_host).first()
		if result:
			if result.host_name != new_host:
				result.host_name = new_host			
				result.save()
		return True 
			
if __name__ == '__main__':
	s = FactBase()
	s.get_fact()
