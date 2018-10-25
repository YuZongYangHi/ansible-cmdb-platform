import React from 'react';
import { Table } from 'antd';
import {async_logins,async_operations,async_logins_get,async_operations_get} from '../api/request'

export default class LogTable extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      data: [],
      pagination: {
        pageSize: 10,
        total: 100
      },
      datapage: 10,
      loading: false
    };
  }

  handlerChange() {
    this.setState({
      loading: false
    })
  }
  componentDidMount() {
    const request = this.props.location ? async_logins : async_operations
    this.setState({
      loading: true
    })
    request().then(res => {
      this.setState({
        loading: false,
        data: res.data.data
      })
    })

    setInterval(() => {
      if (this.props.filter) {
        this.setState({
          loading:true
        })
        var _instance 
        if (this.props.location) {
          _instance = async_logins_get
        } else {
          _instance = async_operations_get
        }
        let form = this.props.filter
        _instance(form).then( res=> {
          if (res.data.code == 200) {
            this.setState({
              data:res.data.data,
              loading:false
            })
            this.props.reset()
          }
        })
      } 
    },1000)
  }
 
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    var columns = this.props.control ? [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: "30%"
    }, {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      width: "40%"
    }, {
      title: '最近登录',
      dataIndex: 'operation_time',
      key: 'logintime',
      render:(res)=> {return res.split('T')[0] + ' ' + res.split('T')[1].split('.')[0]}
    }] : [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: "20%"
    }, {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      width: "20%"
    }, {
      title: '操作事件',
      dataIndex: 'messages',
      key: 'messages',
      width: "20%"
    }, {
      title: '操作时间',
      dataIndex: 'operation_time',
      key: 'operation_time',
      width: "20%",
      render:(res)=> {return res.split('T')[0] + ' ' + res.split('T')[1].split('.')[0]}
    }]

    return (
      <Table columns={columns}
        rowKey={record => record.id}
        //pagination={this.state.pagination}
        dataSource={this.state.data}
        loading={this.state.loading}
        onChange={this.handlerChange.bind(this)}
      />
    );
  }
}
