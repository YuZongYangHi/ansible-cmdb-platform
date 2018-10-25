# -*- coding:utf-8  -*- 

from django.urls import path,include
'''
    assets:  自动发现主机，主机组清单，可用性，主机配置清单
    release: 新增主机，任务发布，任务查看等
'''
urlpatterns = [
    path('v1/assets/', include('assets.urls')),
    path('v1/release/',include('release.urls'))
]
