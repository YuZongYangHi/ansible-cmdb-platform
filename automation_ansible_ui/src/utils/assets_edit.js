import '../css/host_edit.css'
import React from 'react';
import { Form, Button, Select, Tag, Icon, Input, Divider,message } from 'antd';
import {search_group} from '../api/request'
import {get_group} from '../api/request'
import {search_host,host_change} from '../api/request'
import { disConnect } from 'echarts/lib/echarts';
import {get_persion} from '../api/request'

const FormItem = Form.Item;
const Option = Select.Option

class Host_edit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            is_edit: true,
            hostname: null,
            groups: new Array,
            persions: new Array,
            manager: null,
            ip: null,
            default_group: null,
            host: null,
            default_persion:null,
            post_name: null,
            load:false
        }
    }

    handler_edit(e) {
        e.preventDefault();
        let form = this.props.form.getFieldsValue();
        let {is_edit} = this.state 
       
         if (is_edit) {
            message.warning('未做任何改变！')
            return 
        } else if (!form.persion || !form.group) {
            message.error("主机组或负责人未选择")
            return 
        }
        
        this.setState({
            load:true
        })
 
        host_change(this.state.post_name,form).then((res) => {
            if (res.data.code == 200) {
                message.success("主机信息更新成功")
                this.setState({
                    data:false
                })
                setTimeout(()=>{window.location.reload()},2000)
                 
            }
        })
        
    }
    handler_form(hosts = null, group = null) {
  
        const { getFieldDecorator, getFieldValue } = this.props.form;
       
        return (
            <div>
                <Button style={{ marginBottom: 10 }} type='primary' onClick={() => { 
                    this.setState({
                        hostname: null,
                        groups: new Array,
                        persions: new Array,
                        manager: null,
                        ip: null,
                        default_group: null,
                        host: null,
                        default_persion:null,
                        post_name: null,
                        load:false
                    })
                    
                    this.props.history.push('/assets/assets_dashboard/') 
                    }}>
                    <Icon type='arrow-left' />返回
                </Button>
                <Divider />
                <div className="edit-box" style={{ width: 1000,height:"auto" }}>
                    <Form onSubmit={this.handler_edit.bind(this)}>

                        <div>
                            <div style={{ float: 'left' }}>
                                <FormItem label="主机名称">
                                    {getFieldDecorator('host', {
                                        rules: [{ required: true, message: '主机名称不能为空!' }],
                                        initialValue: this.state.hostname
                                    })(
                                        <Input
                                            style={{ width: 400, color: 'rgba(0,0,0,.25)' }}
                                            disabled={this.state.is_edit} placeholder="请输入主机名称"
                                            prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                        />
                                        )}
                                </FormItem>
                            </div>
                            <div style={{ float: 'right' }}>
                                <FormItem label="主机群组">
                                    {getFieldDecorator('group', {
                                        rules: [{ required: false, message: '' }],
                                        initialValue: this.state.default_group
                                    })(
                                        <Select 
                                            disabled={this.state.is_edit} 
                                            //defaultValue={this.state.default_group} 
                                            style={{ width: 400 }} 
                                            onChange={(e) => console.log(e)}>

                                            {this.state.groups}
                                        </Select>
                                        )}
                                </FormItem>
                            </div>
                        </div>
                        <Divider />
                        <div >
                            <div style={{ float: 'left' }}>
                               
                                <FormItem label="IP地址">
                                    {getFieldDecorator('ip', {
                                        rules: [{ required: true, message: 'IP地址不能为空!' }],
                                        initialValue: this.state.ip
                                    })(
                                        <Input
                                            style={{ width: 400, color: 'rgba(0,0,0,.25)' }}
                                            disabled={this.state.is_edit} placeholder="请输入ip地址"
                                            prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                        />
                                        )}
                                </FormItem>
                            </div>
                            <div style={{ float: 'right' }}>
                            <FormItem label="所负责人">
                            {getFieldDecorator('persion', {
                                rules: [{ required: false, message: '' }],
                                initialValue: this.state.default_persion
                            })(
                                <Select 
                                    disabled={this.state.is_edit} 
                                    //defaultValue={this.state.default_group} 
                                    style={{ width: 400 }} 
                                    onChange={(e) => console.log(e)}>

                                    {this.state.persions}
                                </Select>
                                )}
                        </FormItem>
                        </div>

                        </div>
                        
                      
                    <Divider/>
                       <div style={{marginLeft:'auto'}}>
                        <Button
                            onClick={()=> {this.setState({ is_edit: !this.state.is_edit })}}
                            type='primary'
                        >
                            <Icon type="edit" />
                            修改
                </Button>

                        <Button
                            style={{ marginLeft: 20 }}
                            type='primary'
                            htmlType="submit"
                            loading={this.state.load}>
                           
                            <Icon type="check-circle-o" />
                            保存
                </Button>
                      </div>
                    </Form>
                </div>
            </div>
        )
    }
    componentDidMount() {
        let group, cloud, manager;
        let host = this.props.match.params.id;
        this.setState({
            host: host
        })
        search_host(host).then((res)=> {
        if (res.data.code == 200) {
            let form = JSON.parse(res.data.data)[0]
           
    
            this.setState({
                hostname: form.hostname,
                ip: form.address,
                manager: form.persion,
                cloud: form.cloud,
                default_group: form.group,
                default_persion: form.persion,
                post_name:form.hostname
            })
            }
        })
      
       // <Option key={accout_name[i].id} value={accout_name[i].id}>{accout_name[i].message}</Option>
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
    }
    render() {
    
        return (
            <div>
                {this.handler_form()}
            </div>
        )
    }
}

export default Host_edit = Form.create()(Host_edit);