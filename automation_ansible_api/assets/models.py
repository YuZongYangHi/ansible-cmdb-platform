# -*- coding:utf-8 -*- 
from django.db import models

# Create your models here.

class Describe_message(models.Model):
    '''
        主机详情字段:
        1: 主机名称
        2: cpu型号
        3: cpu核数
        4: 物理内存
        5: 虚拟内存
        6: 磁盘容量
        7: 系统类型
        8: 系统内核
        9: 磁盘分区
        10: 别名地址       
        CASCADE
    '''
    host_name = models.CharField(max_length=30)
    cpu_type = models.TextField()
    cpu_count = models.IntegerField()
    mhysics_memory = models.CharField(max_length=128)
    virtual_memory = models.CharField(max_length=128)
    disk_size = models.CharField(max_length=10)
    system_type = models.CharField(max_length=20)
    system_kernel = models.TextField()
    disk_mount = models.TextField()
    alias_name = models.TextField()
    ip = models.CharField(max_length=15)
   
   

class Group(models.Model):
    '''
        主机群组: default /etc/ansible/hosts
    '''
    name = models.CharField(max_length=20) 

class Manager_persion(models.Model):
    '''
        负责人
    '''
    persion = models.CharField(max_length=20)
    phone = models.BigIntegerField()


class Host(models.Model):
    '''
        展示信息: 
        1: 主机名称
        2: 所属群组
        3: 公网地址
        4: 运行状态
        5: 负责人
        6: 详情: 详情|编辑|删除  -> Describe_message
    '''
    host_status = (
        (0,'init'),
        (1,'running'),
        (2,'faild')
        )
    host_name = models.TextField()
    group_name = models.ManyToManyField('Group')
    ip_address = models.CharField(max_length=15)
    running_state = models.CharField(choices=host_status,max_length=10)
    manager_persion = models.ForeignKey('Manager_persion',on_delete=models.SET_NULL, null=True, blank=True)


class Dashboard_host_status(models.Model):
    run_host = models.IntegerField()
    fail_host = models.IntegerField()



