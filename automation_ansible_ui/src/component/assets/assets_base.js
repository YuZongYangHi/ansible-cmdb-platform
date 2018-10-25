import React from 'react';
import {Form,message,Input,Table,Modal,Popconfirm,Button,Icon} from 'antd';

const FormItem = Form.Item;
const Search = Input.Search;

class Basemanager extends React.Component {
    constructor(props) {
        super(props)
        this.group_colums =   [{
            title: 'id',
            dataIndex: 'id',
            width: '10%',
        }, {
            title: '群组名称',
            dataIndex: 'groupname',
            width: "10%",
            render: (text) => {
                return (
                    <a href="#">{text}</a>
                )
            }
        },{
            title: '操作',
            dataIndex: 'operation',
            width: "10%",
            render: (text) => {
                return (
                    (<div>
    
                            <a href="javascript:;" onClick={() => 
                                {
                                this.setState({
                                    title: this.props.update_modal,
                                    button:  "修改",
                                    defalut: text,
                                    mark:2,
                                    is_update:2
                                })
                                this.handler_is_button_hover()
                            
                                }
                                }
                                >修改</a>&nbsp;|&nbsp;
                            <Popconfirm title="确定删除该主机群组？" okText="Yes" onConfirm={() => this.handler_delete(text)} cancelText="No">
                            <a href="javascript:;" >删除</a>&nbsp;&nbsp;
                        </Popconfirm>
                    </div>
                    )
                );
            },
        }]
        this.persion_colums =  [{
            title: 'id',
            dataIndex: 'id',
            width: '10%',
        }, {
            title: '所负责人',
            dataIndex: 'persion',
            width: "10%",
            render: (text) => {
                return (
                    <a href="#">{text}</a>
                )
            }
        }, {
            title: '联系电话',
            dataIndex: 'phone',
            width: "10%",
            render: (text) => {
                return (
                    <a href="#">{text}</a>
                )
            }
        },{
            title: '操作',
            dataIndex: 'operation',
            width: "10%",
            render: (text) => {
                return (
                    (<div>
                            <a href="javascript:;" onClick={ () => {
                                this.setState({
                                    title: this.props.update_modal,
                                    button: "修改",
                                    defalut:text,
                                    mark:2,
                                    is_update:2
                                })
                                this.handler_is_button_hover()
                                
                                }
                                }>修改</a>&nbsp;|&nbsp;
                            <Popconfirm title="确定删除该负责人信息？" okText="Yes" onConfirm={() => this.handler_delete(text)} cancelText="No">
                            <a href="javascript:;" >删除</a>&nbsp;&nbsp;
                        </Popconfirm>
                    </div>
                    )
                );
            },
        }]
        this.state = {
            is_search_load: false,
            is_tab_load: false,
            data:[],
            columns: null,
            is_button_hover:false,
            button: null,
            title: null,
            defalut:null,
            persion: null,
            group: null,
            phone: null,
            mark: 1,
            create_load: false,
            is_update: 1
        }
        
    }

    handler_is_button_hover() {
        this.setState({
            is_button_hover: !this.state.is_button_hover
        })
    }
    handler_tab_load(options) {
        this.setState({
            is_tab_load: options
        })
    }

    handler_delete(name) {
        this.handler_tab_load(true)
        this.props.remove(name).then( (res) => {
            if ( res.data.code == 200 ) {
                message.success('删除成功')
                setTimeout( () => {
                    window.location.reload()
                },2000)
            } 
        })
    }

    handler_create(e) {
        e.preventDefault()
        var form = this.props.form.getFieldsValue();
    }

    handler_update(e) {
        this.setState({
            create_load: true
        })
        e.preventDefault()
        var form = this.props.form.getFieldsValue();
        if (this.props.mark == "group") {
            if (!form.group_name) {
                message.warning("请输入值！")
                this.setState({
                    create_load: false
                })
                return 
            }
        } else if ( this.props.mark == "persion") {
            if (!form.persion_name || !form.persion_phone) {
                message.warning("请输入值！")
                this.setState({
                    create_load: false
                })
                return 
            }
        }
        
        if (this.state.mark == 1) {
           this.props.create(form).then( (res) => {
               if (res.data.code == 200) {
                   message.success("添加成功")
                   setTimeout(() => {
                    this.setState({
                        create_load: false
                    })
                    window.location.reload()
                },2000)
               }
           })
        } else {
            let args;
            if (this.props.mark == 'group') {
                args = this.state.group 
            } else {
                args = this.state.persion
            }
            
            this.props.update(args,form).then( (res) => {
                if (res.data.code == 200) {
                    message.success("修改成功")
                    setTimeout(() => {
                     this.setState({
                         create_load: false
                     })
                     window.location.reload()
                 },2000)
                }
            })
        }
    }

    handler_is_update() {
        console.log(this.state.is_update)
        if (this.state.is_update == 2) {
        let args = this.state.defalut
           this.props.search(args).then( (res) => {
               if ( res.data.code == 200 ) {
                   try {
                       console.log(res.data.data)
                       let form = JSON.parse(res.data.data)[0]
                       this.setState({
                           persion: form.persion,
                           phone:form.phone,
                           group:form.groupname,
                           is_update: 1

                       })
                      
                   } catch (error) {
                      
                   }
               }
           })
        } 
        
        
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const group_form = () => {
            return  (
                <div>
                    <FormItem
                        label="主机群组"
                        >
                            {getFieldDecorator('group_name', {
                                rules: [{ required: true, message: '群组名称不能为空!' }],
                                initialValue: this.state.group
                          })(
                               <Input prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)', width: '300' }} />} placeholder="请输入主机群组"  />
                               )}
                        </FormItem>
                </div>
            )
        }
        const persion_form = () => {
            return  (
                <div>
                    <FormItem
                        label="负责人名称"
                        >
                            {getFieldDecorator('persion_name', {
                                rules: [{ required: true, message: '负责人名称不能为空!' }],
                                initialValue:this.state.persion
                          })(
                               <Input prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)', width: '300' }} />} placeholder="请输入负责人名称"  />
                               )}
                        </FormItem>
                        <FormItem
                        label="负责人电话"
                        >
                            {getFieldDecorator('persion_phone', {
                                rules: [{ required: true, message: '负责人电话不能为空!' }],
                                initialValue:this.state.phone
                          })(
                               <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)', width: '300' }} />} placeholder="请输入负责人电话" />
                               )}
                        </FormItem>
                </div>
            )
        }
        const form_style = {
            group: group_form(),
            persion: persion_form()
        } 
        return form_style[this.props.mark]
    }

    handler_search(name) {
        if (!name) {
            this.componentDidMount()
            return 
        } 
        var data;
        this.handler_tab_load(true)
        this.props.search(name).then( (res) => {
            if ( res.data.code == 200 ) {
                try {
                    data = JSON.parse(res.data.data)
                    this.setState({
                        data: data,
                    })
                } catch (error) {
                    this.setState({
                        data: [],
                    })
                }
            }
        } )
    this.handler_tab_load(false)
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
          return;
        };
      }
    componentDidMount() {
        const tab_style = {
            group: this.group_colums,
            persion: this.persion_colums
        } 
        var data;
        this.handler_tab_load(true)
        this.setState({
            columns: tab_style[this.props.mark]
        })
        
        this.props.select().then((res) => {
            if ( res.data.code == 200 ) {
                try {
                    data = JSON.parse(res.data.data)
                } catch (error) {
                    data = []
                }
            }
        this.setState({
            data: data
        })
        this.handler_tab_load(false)
            
        })
    }

    render() {
      
        return (
            <div>
                <Button type="primary" style={{marginBottom:10}} onClick={() => 
                    {   
                        this.setState({
                            title: this.props.create_modal,
                            button: "新增",
                            mark: 1
                        })
                        this.handler_is_button_hover()
                    
                    }}>新建</Button>
                 <Search
                    style={{ width: 250, float: 'right' }}
                    placeholder={`搜索关键${this.props.kwargsname}...`}
                    onSearch={value => this.handler_search(value)}
                    enterButton
                />
                <Table bordered rowKey={record => record.id} dataSource={this.state.data} columns={this.state.columns} loading={this.state.is_tab_load} />
            

                <Modal
                title={`${this.state.title}`}
                visible={this.state.is_button_hover}
                okText="确认"
                cancelText="关闭"
                onOk={() => {
                    this.setState({
                        is_update:1
                    })
                    this.handler_is_button_hover()
                
                }}
                onCancel={() => {
                    this.setState({
                        is_update:1
                    })
                    this.handler_is_button_hover()
                }
                } 
                destroyOnClose={true}
                >
                
                <Form onSubmit={this.handler_update.bind(this)}>
                        
                        {this.handler_is_update()}
                    
                    <div style={{ textAlign: 'center' }}><Button loading={this.state.create_load} type="primary" htmlType="submit">{this.state.button}</Button></div>
                </Form>

                </Modal>
            </div>
        )
    }
}

export default Basemanager = Form.create()(Basemanager);