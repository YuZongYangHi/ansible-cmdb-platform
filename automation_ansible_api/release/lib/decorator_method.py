#!/usr/bin/env python
# -*- coding:utf-8 -*- 

from release.lib.api_msg import ResponseMessage

'''
    请求方法装饰器
'''


def api_method(methods=[]):
    
    def handler(func):

        def wrapper(request,*args,**kwargs):
            
            if not methods or type(methods) != list:
                raise ValueError('method is dict args is required(1)')

            request_method = request.method
           
            if request_method not in methods:
                return ResponseMessage().method()

            return func(request,*args,**kwargs)
        return wrapper
    return handler
