# -*- coding:utf-8 -*- 

import json 
from . import models
from assets.lib.assets_basic   import BasicInit
from assets.utils.assets_host  import Hosts
from assets.utils.assets_group import Groups 
from assets.utils.assets_fact import FactBase
from assets.utils.assets_persion import Persions
from release.lib.decorator_auth import login_required
from release.lib.decorator_method import api_method 
from release.lib.api_msg import ResponseMessage 

api = ResponseMessage()

@login_required
@api_method(['POST'])
def basic_sync(request):
    params = request.POST.get('body')
    Global = BasicInit(params)
    Global.initialize()
    return api.response()


@login_required
@api_method(['POST','GET'])
def assets_host(request):
    if request.method == 'GET':
        data = Hosts(request).select(is_number=True,is_json=True,response_all=True)
        return api.response(data=data)
    
    elif request.method == 'POST':
        ip = request.POST.get('ip')
        host = request.POST.get('host')
        group = request.POST.get('group')
        persion = request.POST.get('persion')
        Hosts(request).add(name=host,ip=ip,group=group,persion=persion)
        return api.response()


@login_required
@api_method(['GET','POST','DELETE'])
def assets_host_get(request,host):
    if request.method == 'GET':
        data = Hosts(request).select(host=host,is_json=True,response_all=False)
        return api.response(data=data)
   
    elif request.method == 'DELETE':
        Hosts(request).remove(hostname=host)
        return api.response()
    
    else:
        ip = request.POST.get('ip')
        hosts = request.POST.get('host')
        group = request.POST.get('group')
        persion = request.POST.get('persion')
        Hosts(request).update(old_host=host,ip=ip,host=hosts,group=group,persion=persion,option=True)
        return api.response()


@login_required
@api_method(['GET','POST'])
def assets_group(request):
    if request.method == 'GET':
        data = Groups(request).select(is_json=True,response_all=True)
        return api.response(data=data)
    
    else:
        name = request.POST.get('group_name')
        Groups(request).add(name) 
        return api.response()


@login_required
@api_method(['GET','POST','DELETE'])
def assets_group_get(request,group):
    if request.method == 'GET':
        data = Groups(request).select(name=group,is_json=True,response_all=False)
        return api.response(data=data)

    elif request.method == 'DELETE':
        data = Groups(request).remove(group)
        return api.response()
    
    else:
        name = request.POST.get('group_name')
        response =  Groups(request).update(group,name)
        return api.response()


@login_required
@api_method(['GET','POST'])
def assets_persion(request):
    if request.method == 'GET':
        data = Persions(request).select(is_json=True,response_all=True) 
        return api.response(data=data)

    else:
        name = request.POST.get('persion_name')
        phone = request.POST.get('persion_phone')
        Persions(request).add(name,phone) 
        return api.response()


@login_required
@api_method(['GET','POST','DELETE'])
def assets_persion_get(request,persion):
    if request.method == 'GET':
        data = Persions(request).select(persion,is_json=True,response_all=False)
        return api.response(data=data)

    elif request.method == 'POST':
        name = request.POST.get("persion_name")
        phone = request.POST.get("persion_phone")
        res = Persions(request).update(persion,name,phone)   
        return api.response()

    else:
        Persions(request).remove(name=persion)
        return api.response()

@login_required
@api_method(['GET','POST'])
def assets_message(request,id):
    if request.method == 'GET':
        _instance = FactBase()
        data = _instance.select(id=id)
        return api.response(data=data)
    else:
        
        FactBase().update(id)
        return api.response() 
