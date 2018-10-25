#!/usr/bin/env python
# -*- coding:utf-8 -*-

import sys
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "automation_ansible_api.settings")
django.setup()
from assets.models import Host
from mongoengine import *
from django.conf import settings
connect(settings.MONGODB_DATABASE, host=settings.MONGODB_HOST, port=settings.MONGODB_PORT)

class Host_state(Document):
    host  = StringField(required=True)
    state = IntField(required=True)


def Host_state_count():
    success_host = Host_state.objects.filter(state=1).count()
    field_host = Host_state.objects.filter(state=2).count()
    return (success_host,field_host)
   
if __name__ == "__main__":
    Host_state_count()