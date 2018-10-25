#!/usr/bin/env python
# -*- coding:utf-8 -*- 

from . import views
from django.urls import path

#router = DefaultRouter()
#router.register('group',views.assets_group,base_name="assets_group")

urlpatterns = [
   path('basic_sync/',views.basic_sync,name="assets_basic_sync"),
   path('host/',views.assets_host,name="assets_host"),
   path('host/<str:host>/',views.assets_host_get,name="assets_host_get"),
   path('group/',views.assets_group,name='assets_group'),
   path('group/<str:group>/',views.assets_group_get,name="assets_group_get"),
   path('persion/<str:persion>/',views.assets_persion_get,name="assets_persion_get"),
   path('persion/',views.assets_persion,name="assets_persion"),
   path('message/<str:id>/',views.assets_message,name="assets_message")
]
