# -*- coding:utf-8 -*- 

from django.db import models

class Record_logs(models.Model):
    '''
        记录每一个用户的登录时间
    '''
    username = models.CharField(max_length=20)
    operation_time = models.DateTimeField(auto_now_add=True)

class Operation_logs(models.Model):
    '''
        记录每一个用户的操作时间，操作时间
    '''
    username = models.CharField(max_length=20)
    operation_msg = models.TextField() 
    operation_time = models.DateTimeField(auto_now=True)


class Host_release(models.Model):
    '''
        发布名称 -> Host || Group  name
        发布模式 -> adhoc && playbook 
        发布状态 -> 发布中 && false || 发布完成 && true 
        发布信息 -> shell && yml 
        发布结果 -> message -> playbook return message  || shell message 
    '''
    host = models.TextField()
    release_type = models.CharField(max_length=10)
    release_status = models.BooleanField()    
    release_cmd = models.TextField()
    content = models.TextField(null=True)


class Crontab(models.Model):
    host = models.TextField()
    cmd = models.TextField()
    desc = models.TextField()
    minute = models.CharField(default='*',max_length=20) 
    hour= models.CharField(default='*',max_length=20) 
    day_of_week = models.CharField(default='*',max_length=20) 
    day_of_month = models.CharField(default='*',max_length=20) 
    month_of_year= models.CharField(default='*',max_length=20) 
    status = models.BooleanField()

