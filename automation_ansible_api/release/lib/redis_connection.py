#!/usr/bin/env python
# -*- coding:utf-8 -*- 

import redis 
from django.conf import settings

class RedisPoll(object):
    
    host = settings.REDIS_ADDRESS
    port = settings.REDIS_PORT
    
    def __init__(self):
        self.poll  = redis.ConnectionPool(host=RedisPoll.host,port=RedisPoll.port)
        self.redis = redis.Redis(connection_pool=self.poll)

    def get(self,key):
        return self.redis.get(key) 

    def set(self,key,value):
        self.redis.set(key,value,ex=settings.REDIS_EXPIRES)

