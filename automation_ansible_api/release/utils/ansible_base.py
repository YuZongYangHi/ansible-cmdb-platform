#!/usr/bin/env python
# -*- coding:utf-8 -*- 
import json 
from ansible.plugins.callback import CallbackBase
from ansible.parsing.dataloader import DataLoader
from ansible.vars.manager import VariableManager
from ansible.inventory.manager import InventoryManager
from ansible.playbook.play import Play
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.executor.playbook_executor import PlaybookExecutor
from collections import namedtuple
from release.utils.cmd_filter import parse_shell



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
    
    def run(self,host_list,moduls,_args=None,**kwargs): 
        
        if kwargs:
          parame = kwargs
        elif _args:
          parame = _args
        else:
          parame = {}
        print(parame)
        play_source =  dict(
            name = "Ansible Play ad-hoc",
            hosts = host_list,
            gather_facts = 'no',
            tasks = [
                dict(action=dict(module=moduls, args=parame)),
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
        
        if moduls == 'shell':
      
          return parse_shell(result_raw)

        return result_raw
    
    def play(self,yml,**kwargs):

        callback = PlayBookResultsCollector()
        passwords = dict()
        playbook = PlaybookExecutor(playbooks=[yml],
            inventory=self.inventory,
            variable_manager=self.variable_manager,
            loader=self.loader,
            options=self.options,
            passwords=passwords,
            )

        playbook._tqm._stdout_callback = callback
        playbook.run()

        results_raw = {'skipped':{}, 'failed':{}, 'ok':{},"status":{},'unreachable':{},"changed":{}}
        for host, result in callback.task_ok.items():
            results_raw['ok'][host] = str(result)

        return results_raw


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

class PlayBookResultsCollector(CallbackBase):
    CALLBACK_VERSION = 2.0
    def __init__(self, *args, **kwargs):
        super(PlayBookResultsCollector, self).__init__(*args, **kwargs)
        self.task_ok = {}
        self.task_skipped = {}
        self.task_failed = {}
        self.task_status = {}
        self.task_unreachable = {}
    def v2_runner_on_ok(self, result, *args, **kwargs):
        self.task_ok[result._host.get_name()]  = result
    def v2_runner_on_failed(self, result, *args, **kwargs):
        self.task_failed[result._host.get_name()] = result
    def v2_runner_on_unreachable(self, result):
        self.task_unreachable[result._host.get_name()] = result
    def v2_runner_on_skipped(self, result):
        self.task_ok[result._host.get_name()]  = result
    def v2_playbook_on_stats(self, stats):
        hosts = sorted(stats.processed.keys())
        for h in hosts:
            t = stats.summarize(h)
            self.task_status[h] = {
                                       "ok":t['ok'],
                                       "changed" : t['changed'],
                                       "unreachable":t['unreachable'],
                                       "skipped":t['skipped'],
                                       "failed":t['failures']
                                   }

if __name__ == '__main__':
    s = AnsibleBase()
    s.run('Development','ping',)
