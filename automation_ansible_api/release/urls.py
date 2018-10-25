#!/usr/bin/env python
# -*- coding:utf-8 -*- 

from django.urls import path
from . import views

urlpatterns = [
    path('login/',views.login,name="release_login"),
    path('logout/',views.logout,name="release_logout"),
    path('dashboard/' ,views.dashboard,name ="release_dashboard"),
    path('logs_login/',views.log_login,name="release_log_login"),
    path('logs_operation/',views.log_operation,name="release_log_operation"),
    path('submit/',views.task_submit,name="task_submit"),
    path('check/',views.task_check,name='task_check'),
    path('task_list/',views.task_list,name='task_list'),
    path('task_search/<str:task_id>/',views.task_search,name='task_list'),
    path('task_detail/<str:task_id>/',views.task_detail,name='task_detail'),
    path('crontab_list/',views.crontab_list,name="crontab_list"),
    path('crontab/<str:task_id>/',views.crontab_update,name='crontab_update'),
    path('crontab_add/',views.crontab_add,name='crontab_add'),
    path('crontab_task_list/',views.crontab_task_list),
    path('celery_add/',views.celery_add),
    path('celery_del/<str:id>/',views.celery_del)

]

