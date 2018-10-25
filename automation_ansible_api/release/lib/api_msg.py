#!/usr/bin/env python
# -*- coding:utf-8 -*-
import json 
from django.http import JsonResponse

class ResponseMessage(object):
	def __init__(self):
		self._result = {
			"code": 200,
			"message": "",
			"data": [],
			"token": ""
		}
		
	''' 
		只写405,401，自定义函数,该返回程序并不一直用，我们打算用django-rest-framework
	'''
	def response(self,code='200',msg='true',data=[],token=""):
		self._result["code"] = code 
		self._result["message"] = msg
		self._result["data"] = data
		self._result["token"] = token
		return JsonResponse(self._result)

	def method(self):
		self._result['code'] = 405
		self._result['message'] = "request method error"
		return JsonResponse(self._result) 

	def authorization(self):
		self._result['code'] = 401
		self._result['message'] = "authorization error"
		return JsonResponse(self._result) 
