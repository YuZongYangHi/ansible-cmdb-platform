cmdb & ansible 



``视图分析图``
![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number1.gif)


``资产管理(主机管理，ansible主机群组管理，负责人管理)``
![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number2.gif)

``基于ansible fact进行设备硬件收集，可进行更新与设备信息同步或者手动编辑修改``

![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number3.gif)

``可进行联系人管理增删改查、ansible主机群组增删改查``
![image](https://github.com/YuZongYangHi/ansible-cmdb/blob/master/image/number4.gif)


``3、发布管理(发布任务，发布详情，定时任务)``

``4、日志管理(登录日志，操作日志记录)``

``后端:Django2.0.1``

``前端:React + Antd + axios + react-router``

``DB: MySQL5.7+ + Redis + Memcache + MongoDB``

``
支持定时检测主机存活状况，基于ansible fact进行主机硬件信息收集，展示，可支持更新
``

``
基于ansible api 2.4+ 方式调用发布主机，可基于ad-hoc模式 && play-book模式
``


``
基于异步非阻塞模式进行任务发布，定时任务完全替代crontab利用celery进行异步任务分发,基于ansible api方式进行主机群组模式或主机多选模式进行定时任务分发！
``

``
pip -r package_list.txt
``

``
cd automation_ansible_api/ && python3.6  manage.py runserver
``

``
cd automation_ansible_ui/ && yarn start 
``





