
import React from 'react';
import { Table, Input, Icon, Button, Popconfirm, Tag, Modal, Divider, message,Form,Select,Tooltip } from 'antd';
import { Route, Switch } from 'react-router-dom'
import { index_v, search_host, delete_host,get_group,get_persion,host_create,message_get,message_update } from '../../api/request'
import Host_edit from '../../utils/assets_edit'

const FormItem = Form.Item;
const Option = Select.Option

const Search = Input.Search;
class Assetshost extends React.Component {
    constructor(props) {
        super(props);
        this.is_running = (states) => {
            if (states == 0) {
                return <Tag color="geekblue">初始中</Tag>
            } else if (states == 1) {
                return <Tag color="#87d068">运行中</Tag>

            } else if (states == 2){
                return <Tag color="red">未建联</Tag>
            } else{
                return <Tag color="red">无法建联</Tag>
            }
        }
        this.columns = [{
            title: 'id',
            dataIndex: 'id',
            width: '10%',
        }, {
            title: '主机名称',
            dataIndex: 'hostname',
            width: "15%",
            render: (text) => {
                return (
                    <a href="#">{text}</a>
                )
            }
        }, {
            title: '接入地址',
            dataIndex: 'address',
            width: "15%",
        },
        {
          title:'运行状态',
          dataIndex: 'running',
          width: '10%' ,
          render: (state) => {
              return (
                  <div>
                    {this.is_running(state)}
                 </div>
              )
          }
        },
        {
            title: '主机群组',
            dataIndex: 'group',
            width:"10%",
            
        },
        {
            title: '负责人',
            dataIndex: 'persion',
            width: "10%",
            render: (text) => {
                var style_hander;
                if (!text[0]  || !text[1]) {
                    style_hander = () => {
                        return null;
                    }
                } else {
                    style_hander = () => {
                        return  <Tag color="cyan">{text[0]}</Tag>
                    }
                }
                return (
                    <div>
                        <Tooltip placement="topLeft" title={`电话:${text[1]}`} >
                           {style_hander()}
                        </Tooltip>
                    </div>
                )
            }
        }, {
            title: '操作',
            dataIndex: 'operation',
            width: "15%",
            render: (text) => {
                var is_disabled;
                //console.log(this.state.data)
                for (let i in this.state.data) {
                    if (this.state.data[i].hostname == text) {
                        if (this.state.data[i].running == 2) {
                        is_disabled = true
                    } else {
                        is_disabled = false
                    }
                }
            }
                return (
                    (<div>
                           <a disabled={is_disabled} href="javascript:;" onClick={()=> this.handler_desc_update(text)}>更新</a>&nbsp;|&nbsp;
                           <a disabled={is_disabled} href="javascript:;" onClick={() => this. handler_async_meesage(text)}>详情</a>&nbsp;|&nbsp;
                            <a href="javascript:;" onClick={() => this.handle_edit(text)}>编辑</a>&nbsp;|&nbsp;
                            <Popconfirm title="确定删除该主机？" okText="Yes" onConfirm={() => this.host_remove(text)} cancelText="No">
                            <a href="javascript:;" >删除</a>&nbsp;&nbsp;
                        </Popconfirm>
                    </div>
                    )
                );
            },
        }];
        this.state = {
            data: [],
            is_load: false,
            managervisible: false,
            create_modal:false,
            groups:new Array,
            persions: new Array,
            hostname:null,
            alias_host:null,
            cpu_type: null,
            cpu_count:null,
            mhysics_memory:null,
            virtual_memory:null,
            disk_size:null,
            system_type:null,
            system_kernel:null,
            disk_mount:new Array
        };
    }
    handler_desc_update(host) {
        this.setState({
            is_load:true
        })
       message_update(host).then( res => {
           if (res.data.code == 200) {
               message.success('更新成功')
               this.setState({
                   is_load:false
               })
               window.location.reload()
           }
       })
    }
    handler_create_modal(value) {
        this.setState({
            create_modal: value,
        })
    }
    handler_callbak_modal(value) {
        this.setState({
            create_modal: value,
            hostname:null,
            groups: new Array,
            persions:new Array
        })
    }
    handler_async_request() {
       
        get_group().then((res)=> {
            if (res.data.code == 200) {
                try {
                 var iterms = JSON.parse(res.data.data)
                } catch (error) {
                    
                }
               
                for (let i in iterms) {
                  this.state.groups.push(<Option key={iterms[i].groupname} value={iterms[i].groupname}>{iterms[i].groupname}</Option>)
                //  this.state.groups.push(<Option key="123" value="123">4</Option>)
                }
            }
         })
 
         get_persion().then(res=> {
             try {
                 var iter = JSON.parse(res.data.data)
             } catch (error) {
                 
             }
             for (let i in iter) {
                 this.state.persions.push(<Option key={iter[i].persion} value={iter[i].persion}>{iter[i].persion}</Option>)
 
             }
             
         })
        this.handler_create_modal(true)
    }
   
    componentDidMount() {
        this.setState({
            is_load: true
        })
        index_v().then((res) => {
            if (res.data.code == 200) {
                try {
                    this.setState({
                        data: JSON.parse(res.data.data),
                        is_load: false
                    })
                } catch (error) {
                    this.setState({
                        data: [],
                        is_load: false
                    })
                }
            } else {
                this.setState({
                    data: [],
                    is_load: false
                })
            }
        })
    }
    handlemodel(value) {
        if (!value) {
            this.setState({
                message: null,
                disk_mount:new Array
            })
        }
        this.setState({
            managervisible: value
        })
        
    }
    handler_async_meesage(id) {
        let data;
        message_get(id).then( (res) => {
            if ( res.data.code == 200 ) {
                try {
                    data = JSON.parse(res.data.data)[0]
                    this.setState({
                        alias_host:data.hostname,
                        cpu_type: data.cpu_type,
                        cpu_count:data.cpu_count,
                        mhysics_memory:data.mhysics_memory,
                        virtual_memory:data.virtual_memory,
                        disk_size:data.disk_size,
                        system_type:data.system_type,
                        system_kernel:data.system_kernel,
                       
                    })
                  
                    let disk_data = eval(data.disk_mount)
                    let count = 0 
                    for (let i in disk_data) {
                        console.log(disk_data[i.mount])
                       this.state.disk_mount.push(
                           <p key={count}>[{disk_data[i].mount}]&nbsp;&nbsp;{disk_data[i].size}</p>
                       )
                       count += 1
                    }
                     this.handlemodel(true)
                } catch (error) {
                    this.setState({
                        alias_host:null,
                        cpu_type: null,
                        cpu_count:null,
                        mhysics_memory:null,
                        virtual_memory:null,
                        disk_size:null,
                        system_type:null,
                        system_kernel:null,
                       
                    })
                    data = []
                    this.handlemodel(true)
                }
            }
        } )
    }
    handledesc(text=null) {
        return (
            <div>
               
                <div>
                    <Tag color="#108ee9">主机名称</Tag>{this.state.alias_host}
                </div>
                <Divider />
                <div>
                    <Tag  color="#108ee9">CPU型号</Tag>{this.state.cpu_type}
                </div>
                
                <Divider />
                
                <div>
                    <Tag color="#108ee9">CPU核数</Tag>{this.state.cpu_count}
                </div>
                <Divider />
                
                <div>
                    <Tag color="#108ee9">物理内存</Tag>{this.state.mhysics_memory}
                </div>
                <Divider />

                <div>
                    <Tag color="#108ee9">虚拟内存</Tag>{this.state.virtual_memory}
                </div>
                <Divider />
                <div>
                    <Tag color="#108ee9">磁盘容量</Tag>{this.state.disk_size}
                </div>
                <Divider />
                <div>
                    <Tag color="#108ee9">系统类型</Tag>{this.state.system_type}
                </div>
                <Divider />
                <div>
                    <Tag color="#108ee9">系统内核</Tag>{this.state.system_kernel}
                </div>
                <Divider />
                <div>
                    <div >
                        <Tag color="#108ee9">磁盘分区</Tag>
                    </div>
                    <div style={{marginLeft:100}}>
                        {this.state.disk_mount}
                    </div>
                </div>
               
            </div>
        )
    }
    handleSearch(value) {
        if (!value) {
            this.componentDidMount()
            return
        }
        this.setState({
            is_load: true
        })

        search_host(value).then((res) => {
            if (res.data.code == 200 && res.data.data) {
                try {
                    this.setState({
                        data: JSON.parse(res.data.data),
                        is_load: false
                    })

                } catch (error) {
                    this.setState({
                        data: [],
                        is_load: false
                    })
                }

            } else {
                this.setState({
                    data: [],
                    is_load: false
                })
            }
        })
    }
    host_remove(del_host) {
        this.setState({
            is_load: true
        })
        delete_host(del_host).then((res) => {
            if (res.data.code == 200) {
                message.success('主机删除成功')
                setTimeout(
                    () => {
                        window.location.reload();
                    }, 3000)
            }
        })
    }
    handle_edit(value) {
        this.props.history.push(value)

    }
    handler_submit(e) {
        e.preventDefault()
        var form = this.props.form.getFieldsValue();
        if (!form.host || !form.ip || !form.group || !form.persion) {
            message.warning('输入内容不能为空')
            return 
        }
        this.setState({
            is_load: true

        })
        host_create(form).then(res=> {
            if ( res.data.code == 200) {
                message.success('主机设备添加成功！')
                setTimeout(()=>{
                    window.location.reload()
                } ,3000)
                
            }
        })
    } 
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let dataSource = this.state.data
        let uri = window.location.pathname.split('/')[3]
     
        const columns = this.columns;
        let delivery = uri ? <Route path="/assets/assets_dashboard/:id" component={Host_edit}></Route> :
            (<div> <Button type='primary' style={{ marginBottom: 16 }} onClick={()=> {this.handler_async_request()}} >添加设备</Button>
                <Search
                    style={{ width: 250, float: 'right' }}
                    placeholder="搜索关键主机名..."
                    onSearch={value => this.handleSearch(value)}
                    enterButton
                />
                <Table bordered rowKey={record => record.id} dataSource={dataSource} columns={columns} loading={this.state.is_load} />
                                
                                
                <Modal
                                    title="新增主机"
                                    cancelText="关闭"
                                    okText="确认"
                                    visible={this.state.create_modal}
                                    onOk={() => this.handler_callbak_modal(false)}
                                    onCancel={() => this.handler_callbak_modal(false)}
                                    destroyOnClose={true}
                                >

                <Form onSubmit={this.handler_submit.bind(this)}>

             
                
                        <FormItem label="主机名称">
                            {getFieldDecorator('host', {
                                rules: [{ required: true, message: '主机名称不能为空!' }],
                                initialValue: this.state.hostname
                            })(
                                <Input
                                    style={{  color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入主机名称"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>
                   
                
                        <FormItem label="IP地址">
                            {getFieldDecorator('ip', {
                                rules: [{ required: true, message: 'IP地址不能为空!' }],
                                initialValue: this.state.ip
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入ip地址"
                                    prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>

                        <FormItem label="主机群组">
                            {getFieldDecorator('group', {
                                rules: [{ required: false, message: '' }],
                                initialValue: this.state.default_group
                            })(
                                <Select 
                                    disabled={this.state.is_edit} 
                                    //defaultValue={this.state.default_group} 
                                 
                                    onChange={(e) => console.log(e)}>

                                    {this.state.groups}
                                </Select>
                                )}
                        </FormItem>
           
                        <FormItem label="所负责人">
                        {getFieldDecorator('persion', {
                            rules: [{ required: false, message: '' }],
                            initialValue: this.state.default_persion
                        })(
                            <Select 
                                disabled={this.state.is_edit} 
                                //defaultValue={this.state.default_group} 
                            
                                onChange={(e) => console.log(e)}>

                                {this.state.persions}
                            </Select>
                            )}
                    </FormItem>
                <div style={{textAlign:'center'}}>
                <Button
                    style={{ textAlign: 'center' }}
                    type='primary'
                    htmlType="submit"
                    loading={this.state.load}>
                
                    <Icon type="check-circle-o" />
                    创建
                </Button>
            </div>

                </Form>
              
               </Modal>
               <Modal
                    title="详情"
                    cancelText="关闭"
                    okText="确认"
                    visible={this.state.managervisible}
                    onOk={() => this.handlemodel(false)}
                    onCancel={() => this.handlemodel(false)}
                    destroyOnClose={true}
                >
                {this.handledesc()}
                </Modal>

</div>)

        return (
            <div>
                    {delivery}
            </div>
        );
    }
}

export default Assetshost = Form.create()(Assetshost)