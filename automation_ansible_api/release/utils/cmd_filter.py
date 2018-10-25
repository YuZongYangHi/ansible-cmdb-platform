#!/usr/bin/env python 
# -*- coding:utf-8 -*- 


import json 

data = {'failed': {},
 'success': {'140.143.191.129': {'_ansible_no_log': False,
   '_ansible_parsed': True,
   'changed': True,
   'cmd': 'ls',
   'delta': '0:00:00.010379',
   'end': '2018-10-19 12:19:53.883748',
   'invocation': {'module_args': {'_raw_params': 'ls',
     '_uses_shell': True,
     'argv': None,
     'chdir': None,
     'creates': None,
     'executable': None,
     'removes': None,
     'stdin': None,
     'warn': True}},
   'rc': 0,
   'start': '2018-10-19 12:19:53.873369',
   'stderr': '',
   'stderr_lines': [],
   'stdout': '1.py\naccess.gz\nanaconda-ks.cfg\nbaishan.py\nbuild\ndatetimer.py\ngame.sh\nhosts.cfg\nicmp_echo_ignore_all~\nicmp_echo_ignore_alw~\nicmp_echo_ignore_alx~\nicmp_echo_ignore_aly~\nicmp_echo_ignore_alz~\nindex.html\nindex.html.1\ninstall.log\ninstall.log.syslog\niptabels-bak\nmaster.zip\nnetpas7.tar.bz2\npydiction\nQcloud\nservices.cfg\nsource.gz\ntest.py\nzabbix-3.2.1.tar.gz\nzbx_connection.py',
   'stdout_lines': ['1.py',
    'access.gz',
    'anaconda-ks.cfg',
    'baishan.py',
    'build',
    'datetimer.py',
    'game.sh',
    'hosts.cfg',
    'icmp_echo_ignore_all~',
    'icmp_echo_ignore_alw~',
    'icmp_echo_ignore_alx~',
    'icmp_echo_ignore_aly~',
    'icmp_echo_ignore_alz~',
    'index.html',
    'index.html.1',
    'install.log',
    'install.log.syslog',
    'iptabels-bak',
    'master.zip',
    'netpas7.tar.bz2',
    'pydiction',
    'Qcloud',
    'services.cfg',
    'source.gz',
    'test.py',
    'zabbix-3.2.1.tar.gz',
    'zbx_connection.py']},
  '192.168.1.21': {'_ansible_no_log': False,
   '_ansible_parsed': True,
   'changed': True,
   'cmd': 'ls',
   'delta': '0:00:00.005858',
   'end': '2018-10-19 12:20:01.157976',
   'invocation': {'module_args': {'_raw_params': 'ls',
     '_uses_shell': True,
     'argv': None,
     'chdir': None,
     'creates': None,
     'executable': None,
     'removes': None,
     'stdin': None,
     'warn': True}},
   'rc': 0,
   'start': '2018-10-19 12:20:01.152118',
   'stderr': '',
   'stderr_lines': [],
   'stdout': 'anaconda-ks.cfg\nbind.sh\nDesktop\nDocuments\nDownloads\nGit\ninstall.log\ninstall.log.syslog\nmirror\nMusic\nnohup.out\nPictures\nPublic\nTemplates\nVideos',
   'stdout_lines': ['anaconda-ks.cfg',
    'bind.sh',
    'Desktop',
    'Documents',
    'Downloads',
    'Git',
    'install.log',
    'install.log.syslog',
    'mirror',
    'Music',
    'nohup.out',
    'Pictures',
    'Public',
    'Templates',
    'Videos']}},
 'unreachable': {}}


def parse_shell(data):
    result = []

    success,failed,unreachable = data['success'],data['failed'],data['unreachable']

    #success filter 
    for k,v in success.items():
        temp = {
            'status': 'success',
            'host':k,
            'start': v['start'],
            'end': v['end'],
            'shell': v['cmd'],
            'result': v['stdout_lines']
        }
        result.append(temp)
    print(failed)
    if len(failed) > 0:
        for k,v in failed.items():
            temp = {
                'status':'failed',
                'host':k,
                'msg':v['msg']
            }
            result.append(temp)
    return json.dumps(result,indent=4)

 
if __name__ == '__main__':
    parse_other()