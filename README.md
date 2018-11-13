cmdb & ansible 


``视图分析图``
![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number1.gif)


``资产管理(主机管理，ansible主机群组管理，负责人管理)``
![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number2.gif)

``基于ansible fact进行设备硬件收集，可进行更新与设备信息同步或者手动编辑修改``

![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number3.gif)

``可进行联系人管理增删改查、ansible主机群组增删改查``
![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number4.gif)


``基于ansible2.4+ api进行adhoc模式或playbook模式进行任务批量分发，基于异步非阻塞方式，只允许一个任务进行发布``

![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number5.gif)

``发布详情展示发布任务状况，如发布完成会以json格式展示到页面``
![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number6.gif)

``定时任务，完美替换crontab以celery进行异步任务分发，结合ansible api模式``
![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number7.gif)

``结合celery任务，进行服务器查看是否实时进行任务发布``
![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number8.gif)

``定时任务时间可进行增删查，与crontab设置方式一致``
![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number9.gif)

``4、日志管理(登录日志，操作日志记录)``
![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number10.png)

``后端:Django2.0.1``

``前端:React + Antd + axios + react-router``

``DB: MySQL5.7+ + Redis + Memcache + MongoDB``


``
pip -r package_list.txt
``

``
cd automation_ansible_api/ && python3.6  manage.py runserver
``

``
cd automation_ansible_ui/ && yarn start 
``





