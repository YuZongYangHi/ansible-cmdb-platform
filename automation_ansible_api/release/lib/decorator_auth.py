#!/usr/bin/env python
# -*- coding:utf-8 -*- 

from release.lib.redis_connection import RedisPoll
from release.lib.api_msg import ResponseMessage

this = ResponseMessage()

handelr_redis = RedisPoll()

''' 
    判断token过期时间，从redis里面获取，如果过期，返回401，前端强制push到login页面

'''
def login_required(func):

    def wrapper(request,*args,**kwargs):
        
        try:
            username,token = request.META.get('HTTP_AUTHORIZATION').split(' ')
        
        except AttributeError:
            
            return this.authorization()
        
        auth = handelr_redis.get(username)

        if not auth or auth.decode() != token:

            return this.authorization()
    
        return func(request,*args,**kwargs)
    
    return wrapper  

