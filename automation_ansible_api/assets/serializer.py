# -*- coding:utf-8 -*- 

from . import models 
from rest_framework import serializers

class Assets_Host(serializers.ModelSerializer):
    class Meta:
        model = models.Host  
        fields = (  
            "id",              
            "host_name", 
            "group_name",
            "ip_address",
            "running_state", 
            "manager_person",
            "cloud_addres" 
            )
    group_name = serializers.ReadOnlyField(source="group_name.name")


class Assets_Group(serializers.ModelSerializer):
    class Meta:
        model = models.Group 
        fields = (
            "id",
            "name"
            )
