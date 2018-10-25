import React from 'react';
import {
    Table,
    Tag,Input,Button,
    Icon,message,Modal,
    Popconfirm,Form,Select,Radio
    } from 'antd';
import {crontab_task_list,crontab_list,index_v,get_group,celery_add,celery_del} from '../../api/request'

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class Timer extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            data:null,
            modal:false,
            load:false,
            crontab_list:new Array,
            host_list:new Array,
            group_list:new Array,
            host_type:'block',
            group_type:'none',
            defalut_type:'host',
            loading:false,
        }
        this.columns = [{
            title: '任务ID',
            dataIndex: 'id',
            width: '5%',
            
        },{
            title: '发布列表',
            dataIndex:'hosts',
            width: '10%',
        },{
            title:'任务模版',
            dataIndex:'task_template',
            width: '10%',
        },{
        title:'任务描述',
        dataIndex:'task_desc',
        width: '10%',
        },{
            title:'发布命令',
            dataIndex: 'task_cmd',
            width: '10%'
        },{
            title:'crontab',
            dataIndex: 'crontab',
            width: '10%',
        },{
            title:'操作',
            dataIndex: 'opera',
            width: '10%',
            render: (text) => {
                return (
                    (<div>
                            <Popconfirm title="确定删除该定时任务？" okText="Yes" onConfirm={() => this.handler_desc_update(text)} cancelText="No">
                            <a href="javascript:;" >删除</a>&nbsp;&nbsp;
                        </Popconfirm>
                    </div>
                    )
                )
            }
            
        }]
    }
    handler_modal(value) {
        this.setState({
            modal:value
        })
    }
    handler_desc_update(id) {
        this.setState({
            loading:true
        })
        celery_del(id).then(res=>{
            if (res.data.code == 200) {
                message.success('删除成功')
                setTimeout = (2000,()=>{
                    window.location.reload()
                })

            }
        })
    }
    componentDidMount() {
        crontab_task_list().then(res=>{
            if (res.data.code == 200) {
                this.setState({
                    data:res.data.data
                })
            }
        })
        crontab_list().then(res=>{
            if (res.data.code == 200) {
                var items = res.data.data;
                for (let i in items) {
                    this.state.crontab_list.push(<Option key={items[i].crontab} value={items[i].id}>{items[i].crontab}</Option>)
                  //  this.state.groups.push(<Option key="123" value="123">4</Option>)
                  }
            }
        })
        
        index_v().then(res=>{
            if (res.data.code == 200) {
                var items = JSON.parse(res.data.data);
               
                for (let i in items) {
                    
                    this.state.host_list.push(<Option key={items[i].hostname} value={items[i].address}>{items[i].hostname}</Option>)
                  //  this.state.groups.push(<Option key="123" value="123">4</Option>)
                  }
            }
        })
        get_group().then(res=>{
            if (res.data.code == 200) {
                var items = JSON.parse(res.data.data);
                for (let i in items) {
                    
                    this.state.group_list.push(<Option key={items[i].groupname} value={items[i].groupname}>{items[i].groupname}</Option>)
                  //  this.state.groups.push(<Option key="123" value="123">4</Option>)
                  }

            }
        })

    }
    handler_create(e) {
        e.preventDefault()
        var form = this.props.form.getFieldsValue();
        if (!form.shell || !form.desc || !form.shell || !form.crontab) {
            message.info('输入有误')
            return 
        }
        var host = '';
        var type = '';
        if (this.state.host_type == 'block') {
            for (let i in form.hosts) {
               host = host + form['hosts'][i].key + ','
               type = 'host';
              
            }  
        } else {
            host = form['groups'].key
            type = 'group'
        }
        this.setState({
            load:true
        })
        var post = {
            task:form.template,
            desc:form.desc,
            shell:form.shell,
            host:host,
            crontab:form.crontab,
            type:type
        }
        celery_add(post).then(res=>{
            if (res.data.code == 200) {
                this.setState({
                    load:false
                })
                message.success('任务创建成功')
                this.handler_modal(false)
            }
        })


    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        return (
            <div>
                <Button type="primary" style={{ marginBottom: 10 }} onClick={() => {
                    this.handler_modal(true)
            }}>创建</Button>
                <Search
                    style={{ width: 250, float: 'right' }}
                    placeholder={'搜索关键字id信息....'}
                    onSearch={value => { }}
                    enterButton
                />
            <Table bordered rowKey={record => record.id} dataSource={this.state.data} columns={this.columns} loading={this.state.loading} />


            <Modal
                    title="创建定时任务"
                    cancelText="关闭"
                    okText="确认"
                    visible={this.state.modal}
                    onOk={() =>  this.handler_modal(false)}
                    onCancel={() =>  this.handler_modal(false)}
                    destroyOnClose={true}
                >

<FormItem
                label="主机类型"
               
              >
                {getFieldDecorator('host_type', {
                  rules: [{ required: true }],
                  initialValue: this.state.defalut_type
                })(
                  <RadioGroup
                    // defaultValue={this.state.use_host_option}
                    onChange={(e) => {
                       
                      this.props.form.resetFields()
                      this.setState({
                        defalut_type:e.target.value,
                        host_type: this.state.host_type == 'block' ? 'none' : 'block',
                        group_type: this.state.group_type == 'none' ? 'block': 'none'
                      })
                    }}>
                    <Radio value="host">主机模式</Radio>
                    <Radio value="group">群组模式</Radio>
                  </RadioGroup>
                  )}
              </FormItem>
                    <Form onSubmit={this.handler_create.bind(this)}>
                        <FormItem label="发布描述">
                            {getFieldDecorator('desc', {
                                rules: [{ required: true, message: '请填写任务描述名称' }],
                                initialValue: this.state.minute
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    placeholder="请填写任务描述名称"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>

                        <FormItem label="发布模版">
                            {getFieldDecorator('template', {
                                rules: [{ required: true, message: '模版必须存在并且可执行' }],
                                initialValue: this.state.hour
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入正确的可执行任务模版"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>

                        <FormItem label="crontab">
                            {getFieldDecorator('crontab', {
                                rules: [{ required: true, message: 'crontab不能为空' }],
                                initialValue: this.state.week
                            })(
                              /*  <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请选择正确的crontab"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />*/
                                <Select>
                                    {this.state.crontab_list}
                                </Select>
                                )}

                        </FormItem>

                        <FormItem label="shell">
                            {getFieldDecorator('shell', {
                                rules: [{ required: true, message: '请填写正确的shell命令' }],
                                initialValue: this.state.month
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请填写正确的shell命令"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>
                        
                     
                        <FormItem label="主机列表" style={{display:this.state.host_type}}>
                            {getFieldDecorator('hosts', {
                                rules: [{ required: true, message: '主机至少是一个' }],
                                initialValue: this.state.year
                            })(
                               <Select
                               labelInValue
                               mode="multiple"
                               allowClear={true}>
                                   
                                   {this.state.host_list}
                               </Select>
                                )}
                        </FormItem>

                        <FormItem label="群组列表" style={{display:this.state.group_type}}>
                            {getFieldDecorator('groups', {
                                rules: [{ required: true, message: '群组至少是一个' }],
                                initialValue: this.state.year
                            })(
                               <Select
                               labelInValue
                              
                               allowClear={true}>
                                   
                                   {this.state.group_list}
                               </Select>
                                )}
                        </FormItem>
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                style={{ textAlign: 'center' }}
                                type='primary'
                                htmlType="submit"
                                loading={this.state.load}>

                                
                                创建
                </Button>
                        </div>

                    </Form>

                </Modal>

            </div>
        )
    }
}

export default  Timer = Form.create()(Timer)