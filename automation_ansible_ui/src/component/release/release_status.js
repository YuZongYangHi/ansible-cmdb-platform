import React from 'react';
import { Table,Tag,Input,Button,Icon,message} from 'antd';
import {task_list,task_search, message_get} from '../../api/request'
import { Route, Switch } from 'react-router-dom'
import Detail from './detail'
const Search = Input.Search

export default class ReleaseDetail extends React.Component {

    constructor(props) {
        super(props) 
        this.state = {
            loading: true,
            data: null
        }
        this.columns = [{
            title: 'task_id',
            dataIndex: 'task_id',
            width: '5%',
            
        },{
            title: '发布列表',
            dataIndex:'hosts',
            width: '10%',
        },{
           title: '发布模式',
           dataIndex: 'release_type',
           width: '10%'
        },{
            title:'发布状态',
            dataIndex:'release_state',
            width: '10%',
            render: (res) => {
                return (
                    <div>
                        {this.is_running(res)}
                    </div>
                )
            }
        },{
            title:'发布内容',
            dataIndex: 'release_detail',
            width: '10%'
        },{
            title:'详情',
            dataIndex: 'id',
            width: '10%',
            render: (id) => {
                return (
                    <div>
                        <a href="javascript:;" onClick={()=> this.handler_detail(id)}>详细信息</a>
                    </div>
                )
            }
        }]
        this.is_running = (states) => {
            if (!states ) {
                return <Tag color="#2db7f5">任务发布中</Tag>
            } else {
            return <Tag color="#87d068">发布完成</Tag>
            }
        }
    }

    handler_detail(id) {
        this.props.history.push(String(id))

    }

    handleSearch(id) {
        
        if (!id) {
            this.componentDidMount()
            return 
        }
        if (Number(id)) {
        task_search(id).then(res=>{
            if (res.data.code == 200) {
                this.setState({
                    data:res.data.data
                })
            }
        })
    } else {
        message.error('请输入正确的任务id')
    }
    }
    componentDidMount() {
        task_list().then( response => {
            if (response.data.code == 200) {
                this.setState({
                    loading: false,
                    data:response.data.data
                })
            }
        })

    }

    render() {
        let uri = window.location.pathname.split('/')[3]

        var delivery = uri ? <Route path="/release/status/:id" component={Detail}></Route>  :
         (
            <div>
                <Button type='primary' style={{ marginBottom: 16 }}  icon="cloud"  ></Button>
                 <Search
                    style={{  width: 250,marginBottom: 16,float: 'right' }}
                    placeholder="搜索任务id..."
                    onSearch={value => this.handleSearch(value)}
                    enterButton
                />
                <Table bordered rowKey={record => record.id} dataSource={this.state.data} columns={this.columns} loading={this.state.loading} />
            </div>
        )
        return (
            <div>
                    {delivery}
            </div>
        )
    }
}