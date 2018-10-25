import '../css/login.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Icon, Input, Button, message } from 'antd';
import logo from '../image/cmdb.png'
import {handler_login} from '../api/request';

const FormItem = Form.Item;

class Logins extends Component {
    constructor(props) {
        super(props)
    }
    componentWillMount() {
        window.localStorage.removeItem('username')
        window.localStorage.removeItem('token')   
    }
    LoginSubmit(e) {
        e.preventDefault();
        let form = this.props.form.getFieldsValue();
        if (!form.username || !form.password) {
            message.error('用户名或密码不能为空');
            return;
        }
        handler_login(form).then((res)=> {
            if (res.data.code == '200') {
                window.localStorage.username = form.username;
                window.localStorage.token = res.data.token;
                this.props.history.push('/')
            } else {
                message.error('账号密码有误,请重新输入!')
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-block">
                <div className="logo">
                    <img src={logo} />
                </div>
                <Form className="forms" onSubmit={this.LoginSubmit.bind(this)}>
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入您的用户名!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                            )}
                    </FormItem>

                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入您的密码!' }],
                        })(
                            <Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Password" />
                            )}
                    </FormItem>
                    <Button type="primary" htmlType="submit" style={{ width: "100%", marginLeft: "0px", marginBottom: "10px" }}>登录</Button>
                </Form>
            </div>
        )
    }
}

const Login = Form.create()(Logins);

export default withRouter(Login);