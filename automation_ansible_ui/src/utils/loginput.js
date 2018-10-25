import React from 'react';
import LogTable from '../utils/logtable'
import { Form, Row, Col, Input, Button, Icon, Spin } from 'antd';
import '../css/loginlog.css'
import {async_logins,async_operations} from '../api/request'
const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Logsearch extends React.Component {
    state = {
        load: false,
        style: {
            marginLeft: "10px"
        },
        filter: ''
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (this.props.control) {
                if (values.username) {
                    this.setState({
                        load: true,
                        style: {
                            marginLeft: "30px",
                        },
                        filter: {
                            username: values.username
                        }
                    })
                }
            } else {
                if (values.username || values.message) {
                    this.setState({
                        load: true,
                        style: {
                            marginLeft: "30px",
                        },
                        filter: {
                            username: values.username,
                            message: values.message
                        }
                    })
                }
            }
        });
    }

    handleResetLoad() {
        this.setState({
            load: false,
            filter: ""
        })
    }
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({
            load: false,
            style: {
                marginLeft: "10px"
            },
            filter: ""
        })
        var uri = window.location.pathname.split('/')[2]
        window.location.href = '/log/' + uri + '/'
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const button = this.state.load ? <Spin indicator={antIcon} style={{ marginLeft: "10px" }} /> : <Button type="primary" htmlType="submit">搜索</Button>
        const childprops = this.props.test
            ?
            <FormItem>
                {getFieldDecorator('message', {
                    rules: [{ required: false }],
                })(
                    <Input placeholder="搜索事件名..." />
                    )}
            </FormItem>
            :
            ''
        return (
            <div className="global-style">
                <Form layout="inline" onSubmit={this.handleSearch}>
                    <FormItem

                    >
                        {getFieldDecorator('username', {
                            rules: [{ required: false }],
                        })(
                            <Input placeholder="搜索用户名..." />
                            )}
                    </FormItem>
                    {childprops}
                    <FormItem

                    >
                        {getFieldDecorator('data', {
                            rules: [{ required: false }],
                        })(
                            <Input type="text" placeholder="搜索日期..." disabled={true} />
                            )}
                    </FormItem>
                    <FormItem>
                        {button}
                        <span>&nbsp;&nbsp;</span>
                        <Button style={this.state.style} onClick={this.handleReset}>重置</Button>

                    </FormItem>
                </Form>
                <br />
                <LogTable filter={this.state.filter} control={this.props.control} location={this.props.res} reset={this.handleResetLoad.bind(this)} />
            </div>


        );

    }
}
const Logsearchs = Form.create()(Logsearch);
export default Logsearchs