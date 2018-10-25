#!/usr/bin/env python
# -*- coding:utf-8 -*- 

class Header_Message(object):

    def remote_ip(self,request):
        return request.META['REMOTE_ADDR']

    def current_user(self,request):
        return request.META.get('HTTP_AUTHORIZATION').split(' ')[0]

    def current_token(self,request):
       return request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
