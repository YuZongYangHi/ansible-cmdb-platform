import React from 'react';
import {
    Table,
    Tag, Input, Button,
    Icon, message, Modal,
    Popconfirm, Form
} from 'antd';

import {
    crontab_list,
    crontab_opera_put, crontab_opera_del,
    crontab_add, crontab_opera_get
} from '../../api/request'

const FormItem = Form.Item
const Search = Input.Search

class Crontabs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            load: false,
            create_modal: false,
            put_modal: false,
            minute: null,
            hour: null,
            week: null,
            month: null,
            year: null,
            task_id: null
        }
        this.columns = [{
            title: '序号',
            dataIndex: 'id',
            width: '10%',

        }, {
            title: 'crontab',
            dataIndex: 'crontab',
            width: '10%',
        }, {
            title: '操作',
            dataIndex: 'opera',
            width: '10%',
            render: (text) => {
                return (
                    (<div>
                        <a href="javascript:;" onClick={() => this.handler_put(text)}>修改</a>&nbsp;|&nbsp;
                            <Popconfirm title="确定删除该定时时间？" okText="Yes" onConfirm={() => this.hander_del(text)} cancelText="No">
                            <a href="javascript:;" >删除</a>&nbsp;&nbsp;
                        </Popconfirm>
                    </div>
                    )
                )
            }
        }]
    }
    componentDidMount() {
        crontab_list().then(res => {
            if (res.data.code == 200) {
                this.setState({
                    data: res.data.data
                })
            }
        })
    }
    handler_update(e) {
        e.preventDefault()
        var form = this.props.form.getFieldsValue();
        this.setState({
            is_load: true,
            load: true

        })

        crontab_opera_put(this.state.task_id, form).then(res => {
            if (res.data.code == 200) {
                this.setState({
                    load: false,

                })
                message.success('修改成功!')
                window.location.reload()

            }
        })


    }
    handler_submit(e) {
        e.preventDefault()
        var form = this.props.form.getFieldsValue();
        if (!form.minute || !form.hour || !form.day_of_week || !form.day_of_month || !form.month_of_year) {
            message.warning('输入内容不能为空')
            return
        }
        this.setState({
            is_load: true,
            load: true

        })
        crontab_add(form).then(res => {
            if (res.data.code == 200) {
                this.setState({
                    load: false,

                })
                message.success('添加成功!')
                window.location.reload()

            }
        })

    }
    handler_put(id) {
        crontab_opera_get(id).then(res => {
            if (res.data.code == 200) {
                var from = res.data.data

                this.setState({
                    hour: from.hour,
                    minute: from.minute,
                    week: from.week,
                    year: from.year,
                    month: from.month,
                    put_modal: true,
                    task_id: from.id
                })
            }
        })
    }
    hander_del(id) {
        crontab_opera_del(id).then(res => {
            if (res.data.code == 200) {
                window.location.reload()
            }
        })

    }

    handler_callbak_modal(value) {
        this.setState({
            create_modal: value
        })
    }

    close_put_modal(value) {
        this.setState({
            put_modal: value
        })
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        return (
            <div>
                <Button type="primary" style={{ marginBottom: 10 }} onClick={() => {
                    this.setState({
                        create_modal: true
                    })
                }}>创建</Button>
                <Modal
                    title="新增Crontab"
                    cancelText="关闭"
                    okText="确认"
                    visible={this.state.create_modal}
                    onOk={() => this.handler_callbak_modal(false)}
                    onCancel={() => this.handler_callbak_modal(false)}
                    destroyOnClose={true}
                >

                    <Form onSubmit={this.handler_submit.bind(this)}>
                        <FormItem label="minute">
                            {getFieldDecorator('minute', {
                                rules: [{ required: true, message: 'minute不能为空' }],
                                initialValue: this.state.hostname
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入minute"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>

                        <FormItem label="hour">
                            {getFieldDecorator('hour', {
                                rules: [{ required: true, message: 'hour不能为空' }],
                                initialValue: this.state.hostname
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入hour"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>

                        <FormItem label="day_of_week">
                            {getFieldDecorator('day_of_week', {
                                rules: [{ required: true, message: 'minute不能为空' }],
                                initialValue: this.state.hostname
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入day_of_week"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>

                        <FormItem label="day_of_month">
                            {getFieldDecorator('day_of_month', {
                                rules: [{ required: true, message: 'minute不能为空' }],
                                initialValue: this.state.hostname
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入day_of_month"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>

                        <FormItem label="month_of_year">
                            {getFieldDecorator('month_of_year', {
                                rules: [{ required: true, message: 'month_of_year不能为空' }],
                                initialValue: this.state.hostname
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入day_of_year"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>
                        <div style={{ textAlign: 'center' }}>
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
                    title="修改Crontab"
                    cancelText="关闭"
                    okText="确认"
                    visible={this.state.put_modal}
                    onOk={() => this.close_put_modal(false)}
                    onCancel={() => this.close_put_modal(false)}
                    destroyOnClose={true}
                >

                    <Form onSubmit={this.handler_update.bind(this)}>
                        <FormItem label="minute">
                            {getFieldDecorator('minute', {
                                rules: [{ required: true, message: 'minute不能为空' }],
                                initialValue: this.state.minute
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    placeholder="请输入minute"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>

                        <FormItem label="hour">
                            {getFieldDecorator('hour', {
                                rules: [{ required: true, message: 'hour不能为空' }],
                                initialValue: this.state.hour
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入hour"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>

                        <FormItem label="day_of_week">
                            {getFieldDecorator('day_of_week', {
                                rules: [{ required: true, message: 'minute不能为空' }],
                                initialValue: this.state.week
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入day_of_week"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>

                        <FormItem label="day_of_month">
                            {getFieldDecorator('day_of_month', {
                                rules: [{ required: true, message: 'minute不能为空' }],
                                initialValue: this.state.month
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入day_of_month"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>

                        <FormItem label="month_of_year">
                            {getFieldDecorator('month_of_year', {
                                rules: [{ required: true, message: 'month_of_year不能为空' }],
                                initialValue: this.state.year
                            })(
                                <Input
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    disabled={this.state.is_edit} placeholder="请输入day_of_year"
                                    prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)    ', width: '300' }} />}
                                />
                                )}
                        </FormItem>
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                style={{ textAlign: 'center' }}
                                type='primary'
                                htmlType="submit"
                                loading={this.state.load}>

                                <Icon type="check-circle-o" />
                                修改
                </Button>
                        </div>

                    </Form>

                </Modal>


                <Search
                    style={{ width: 250, float: 'right' }}
                    placeholder={'搜索关键字id信息....'}
                    onSearch={value => { }}
                    enterButton
                />
                <Table bordered rowKey={record => record.id} dataSource={this.state.data} columns={this.columns} loading={this.state.loading} />

            </div>
        )
    }
}
export default Crontabs = Form.create()(Crontabs)