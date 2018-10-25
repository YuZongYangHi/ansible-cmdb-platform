# -*- coding:utf-8 -*- 
import hashlib
import hmac
import base64
import logging 
import json 
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Record_logs, Operation_logs,Host_release
from release.lib.api_msg import ResponseMessage
from release.lib.decorator_auth import login_required
from release.lib.decorator_method import api_method
from release.lib.redis_connection import RedisPoll
from release.lib.hash import hash_token
from release.utils.dashborad_host_count import Host_state_count
from release.utils.logs import LogBase
from release.utils.handler_task import HanderTaskRun
from assets.models import Group,Host
from  djcelery.models import TaskMeta,TaskState,CrontabSchedule,PeriodicTasks,PeriodicTask

#日志
logger_info = logging.getLogger('release_info')
logger_error = logging.getLogger('release_error')
#部分使用返回信息其余则用restful
api = ResponseMessage()

#redis
rds = RedisPoll()

def login(request):
    if request.method != 'POST':
        return api.method()

    username = request.POST.get('username',None)
    password = request.POST.get('password',None)
    login_user = authenticate(username=username, password=password)
    if not login_user:
        return api.authorization()

    token = hash_token(username,password)
    rds.set(username,token)
    record_log = Record_logs(username=username)
    record_log.save()
    return api.response(token=token)

@login_required
@api_method(['POST'])
def logout(request):
    username = request.POST.get('username')
    rds.redis.delete(username)
    return api.response()

@login_required
@api_method(['GET','POST'])
def dashboard(request):
    if request.method == 'GET':
        return api.response(data=Host_state_count())
    

@login_required
@api_method(['GET','POST'])
def log_operation(request):
    if request.method == 'GET':
        query_instance = Operation_logs
        data = LogBase().query(query_instance,option=True)
        return api.response(data=data)
    else:
        username = request.POST.get('username')
        event = request.POST.get('message') 
        query_instance = Operation_logs
        data = LogBase().search(_instance=query_instance,user=username,event=event,option=True)
        return api.response(data=data)


@login_required
@api_method(['GET','POST'])
def log_login(request):
    if request.method == 'GET':
        query_instance = Record_logs
        data = LogBase().query(query_instance,option=False)
        return api.response(data=data)
    else:
        username = request.POST.get('username')
        query_instance = Record_logs
        data = LogBase().search(_instance=query_instance,user=username,option=False)
        return api.response(data=data)


@login_required
@api_method(['POST'])
def task_submit(request):
    instance = HanderTaskRun(request)
    result = instance.run()
    if result:
        task_id = {
            'id': result
        }
        return api.response(data=task_id)
    return api.response(code=499)


@login_required
@api_method(['GET'])
def task_check(request):
    run_task_id = Host_release.objects.filter(release_status=0).first()
    if run_task_id:
        return api.response(code=6666,data={'task_id':run_task_id.id})
    return api.response(code=200)

@login_required
@api_method(['GET'])
def task_list(request):
    queryset = Host_release.objects.all().order_by('release_status')
    data = []
    for i in queryset:
        temp = {
            'task_id':i.id,
            'hosts': i.host ,
            'release_type': i.release_type,
            'release_state': i.release_status,
            'release_detail': i.release_cmd,
            'id': i.id
        }
        data.append(temp)
    return api.response(data=data)

@login_required
@api_method(['GET'])
def task_detail(request,task_id):
    queryset = Host_release.objects.filter(id=int(task_id)).first()
    data = []
    if queryset:
      
        return api.response(data=queryset.content)
    return api.response(data=data)

@login_required
@api_method(['GET'])
def task_search(request,task_id):
    i = Host_release.objects.filter(id=int(task_id)).first()
    data = []
    if i:
        dict_model = {
            'task_id':i.id,
            'hosts': i.host ,
            'release_type': i.release_type,
            'release_state': i.release_status,
            'release_detail': i.release_cmd,
            'id': i.id
        }
        data.append(dict_model)
        return api.response(data=data)
    return api.response(data=data)



@login_required
@api_method(['GET'])
def crontab_list(request):
    queryset = CrontabSchedule.objects.all()
    data = []
    if queryset:
        for i in queryset:
            temp = {
                "id":i.id,
                "crontab": '%s %s %s %s %s (m/h/d/dM/Y)' % (i.minute,i.hour,i.day_of_week,i.day_of_month,i.month_of_year),
                'opera': i.id
            }
            data.append(temp)
        return api.response(data=data)
    return api.response(data=data)


@login_required
@api_method(['POST'])
def crontab_add(request):
    data = request.POST
    _instance = CrontabSchedule(
            minute=data.get('minute','*'),
            hour=data.get('hour','*'),
            day_of_week=data.get('day_of_week','*'),
            day_of_month=data.get('day_of_month','*'),
            month_of_year=data.get('month_of_year','*')
            )
    _instance.save()
    return api.response()


@login_required
@api_method(['DELETE','GET','POST'])
def crontab_update(request,task_id):
    if request.method == 'POST':
        queryset = CrontabSchedule.objects.filter(id=int(task_id)).first() 
        if queryset:
            minute = request.POST.get('minute')
            hour = request.POST.get('hour')
            week = request.POST.get('day_of_week')
            month = request.POST.get('day_of_month')
            year = request.POST.get('month_of_year')
            queryset.minute = minute
            queryset.hour = hour
            queryset.day_of_week = week
            queryset.day_of_month = month
            queryset.month_of_year = year
            queryset.save()
        return api.response()

    elif request.method == 'GET':
        queryset = CrontabSchedule.objects.filter(id=int(task_id)).first()
        data = {}
        if queryset:
            data = {
                'id':queryset.id,
                'minute': queryset.minute,
                'hour':queryset.hour,
                'week':queryset.day_of_week,
                'month':queryset.day_of_month,
                'year':queryset.month_of_year      
            }
            return api.response(data=data)
        return api.response(data=data)

    else:
        crontab_id = int(task_id)
        queryset = CrontabSchedule.objects.filter(id=crontab_id).first()
        if queryset:
            queryset.delete()
        return api.response()


@login_required
@api_method(['GET','POST'])
def crontab_task_list(request):
    if request.method == 'GET':
        queryset = PeriodicTask.objects.all()
        data = []
        for i in queryset:
            temp = {
                "id":i.id,
                "task_template": i.task,
                "task_desc": i.name,
                "task_cmd":i.args,
                "opera":i.id
            }
            crontab = CrontabSchedule.objects.filter(id=int(i.crontab_id)).first()
            if crontab:
                temp["crontab"] = '%s %s %s %s %s' % (crontab.minute,crontab.hour,crontab.day_of_week,crontab.day_of_month,crontab.month_of_year)
            
            
            kwargs = eval(i.kwargs)
          
            host = kwargs.get('host')
            temp['hosts'] = host 

            data.append(temp)
        return api.response(data=data)


@login_required
@api_method(['POST'])
def celery_add(request):
    task = request.POST.get('task')
    desc = request.POST.get('desc')
    shell = request.POST.get('shell')
    host = request.POST.get('host')
    crontab = request.POST.get('crontab')
    types = request.POST.get('type')


    db = PeriodicTask(
        name=desc,
        task=task,
        args=json.dumps([shell]),
        kwargs=json.dumps({'host':host}),
        crontab_id=crontab,
        )
    db.save()
    
    return api.response()

@login_required
@api_method(['DELETE'])
def celery_del(request,id):
    _instance = PeriodicTask.objects.filter(id=int(id)).first()
    if _instance:
        _instance.delete()
    return api.response()
















