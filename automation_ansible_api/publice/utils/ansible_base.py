#!/usr/bin/env python
# -*- coding:utf-8 -*- 
import json 
from ansible.plugins.callback import CallbackBase
from ansible.parsing.dataloader import DataLoader
from ansible.vars.manager import VariableManager
from ansible.inventory.manager import InventoryManager
from ansible.playbook.play import Play
from ansible.executor.task_queue_manager import TaskQueueManager
from collections import namedtuple


class AnsibleBase(object):
    def __init__(self):
        self.loader = None 
        self.inventory = None 
        self.variable_manager = None 
        self.options = None 

        self.__Initialization()


    def __Initialization(self):
        self.loader = DataLoader()
        self.inventory = InventoryManager(loader=self.loader,sources='hosts')
        self.variable_manager = VariableManager(loader=self.loader,inventory=self.inventory)
        Options = namedtuple('Options',
                         ['connection',
                          'remote_user',
                          'ask_sudo_pass',
                          'verbosity',
                          'ack_pass',
                          'module_path',
                          'forks',
                          'become',
                          'become_method',
                          'become_user',
                          'check',
                          'listhosts',
                          'listtasks',
                          'listtags',
                          'syntax',
                          'sudo_user',
                          'sudo',
                          'diff'])
        self.options = Options(connection='smart',
                           remote_user=None,
                           ack_pass=None,
                           sudo_user=None,
                           forks=5,
                           sudo=None,
                           ask_sudo_pass=False,
                           verbosity=5,
                           module_path=None,
                           become=None,
                           become_method=None,
                           become_user=None,
                           check=False,
                           diff=False,
                           listhosts=None,
                           listtasks=None,
                           listtags=None,
                           syntax=None)
    
    def run(self,host_list,moduls,**kwargs): 
        play_source =  dict(
            name = "Ansible Play ad-hoc",
            hosts = host_list,
            gather_facts = 'no',
            tasks = [
                dict(action=dict(module=moduls, args='')),
            ]
        )
        play = Play().load(play_source, variable_manager=self.variable_manager, loader=self.loader)
        callback = ModelResultsCollector()
        passwords = dict()

        tqm = TaskQueueManager(
                inventory=self.inventory,
                variable_manager=self.variable_manager,
                loader=self.loader,
                options=self.options,
                passwords=passwords,
                stdout_callback=callback,
              )
        
        result = tqm.run(play)

        result_raw = {'success':{},'failed':{},'unreachable':{}}
        for host,result in callback.host_unreachable.items():
            result_raw['unreachable'][host] = result._result
        for host,result in callback.host_ok.items():
            result_raw['success'][host] = result._result
        for host,result in callback.host_failed.items():
            result_raw['failed'][host] = result._result
        
        return result_raw

class ModelResultsCollector(CallbackBase):
    def __init__(self, *args, **kwargs):
        super(ModelResultsCollector, self).__init__(*args, **kwargs)
        self.host_ok = {}
        self.host_unreachable = {}
        self.host_failed = {}
    def v2_runner_on_unreachable(self, result):
        self.host_unreachable[result._host.get_name()] = result
    def v2_runner_on_ok(self, result):
        self.host_ok[result._host.get_name()] = result
    def v2_runner_on_failed(self, result):
        self.host_failed[result._host.get_name()] = result

if __name__ == '__main__':
    s = AnsibleBase()
    s.run('all','ping')
