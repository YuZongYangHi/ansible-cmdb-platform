import './css/app.css';
import React, { Component } from 'react';
import { Button } from 'antd';
import { Layout, Menu, Icon, Dropdown } from 'antd';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import Dashboard from './component/dashboard';
import { logout_v } from './api/request';
import ansible_pic  from './image/cmdb.png';
import Assetshost   from './component/assets/host_assets'
import Host_edit    from './utils/assets_edit'
import Zesher from './component/assets/assets_group'
import Persion from './component/assets/assets_persion'
import Loginlog from './component/logs/login'
import Operationlog from './component/logs/operation'
import Next_release from './component/release/next_one'
import ReleaseDetail from './component/release/release_status'
import Crontabs from './component/release/crontab'
import Timer from './component/release/timer'

const SubMenu = Menu.SubMenu;
const { Header, Sider, Content, Footer } = Layout;

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentstyle: '',
            menustyle: ''
        }

    }
    componentWillMount() {
        if (!window.localStorage.getItem('username') || !window.localStorage.getItem('token')) {
            this.props.history.push('/login')
        }

        var uri = window.location.pathname.split('/')[2] || '1'
        var menu = window.location.pathname.split('/')[2] || '1'
        this.setState({
            currentstyle: [String(uri)],
            menustyle: ["sub" + String(menu)]
        })
    }
    logout() {
        let form = {
            'username': window.localStorage.getItem('username')
        }
        logout_v(form).then(res => {
            if (res.data.code == 200) {
                this.props.history.push('/login')
            }
        })
    }
    render() {
    
        const username = window.localStorage.getItem('username')
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <a target="_blank" onClick={() => { this.logout() }}>注销</a>
                </Menu.Item>
            </Menu>
        );

        return (
            <div>
                <Layout>
                    <Sider
                        style={{ overflow: 'auto', height: '100vh', position: 'relative', left: 0 }}
                    >
                        <div className="logo-index">
                            <img src={ansible_pic} />
                        </div>

                        <Menu theme="dark" mode="inline" defaultOpenKeys={this.state.menustyle} defaultSelectedKeys={this.state.currentstyle}>
                            <SubMenu key="subassets" title={<span><Icon type="file-text" />资产管理</span>}>
                                <Menu.Item key="1"><Link to="/">视图</Link></Menu.Item>
                                <Menu.Item key="assets_dashboard"><Link to="/assets/assets_dashboard/">主机管理</Link></Menu.Item>
                                <Menu.Item key="assets_group"><Link to="/assets/assets_group/">群组管理</Link></Menu.Item>
                                <Menu.Item key="assets_persion"><Link to="/assets/assets_persion/">负责人管理</Link></Menu.Item>


                            </SubMenu>

                            <SubMenu key="subrelease" title={<span><Icon type="notification" />发布管理</span>}>
                                <Menu.Item key="release_dashboard"><Link to="/release/release_dashboard/">发布任务</Link></Menu.Item>
                                <Menu.Item key="status"><Link to="/release/status/">发布状态</Link></Menu.Item>
                                <Menu.Item key="timer"><Link to="/release/timer/">定时任务</Link></Menu.Item>
                                <Menu.Item key="crontab"><Link to="/release/crontab/">Crontab</Link></Menu.Item>

                            </SubMenu>
                            
                          
                            
                            <SubMenu key="sublog" title={<span><Icon type="dot-chart" />日志管理</span>}>
                                <Menu.Item key="login"><Link to="/log/login/">登录日志</Link></Menu.Item>
                                <Menu.Item key="operation"><Link to="/log/operation/">操作日志</Link></Menu.Item>
                            </SubMenu>
                        </Menu>

                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0, textAlign: 'right' }}>
                            <Dropdown overlay={menu}>
                                <a className="ant-dropdown-link" href="#">
                                    {username} <Icon type="down" />
                                </a>
                            </Dropdown>,</Header>
                        <Content style={{ margin: '24px 16px 0' }}>
                            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                                <Switch>
                                    <Route exact path="/" component={Dashboard}></Route>
                                    <Route path="/assets/assets_dashboard/"    component={Assetshost}></Route>
                                    <Route path="/assets/assets_group/"        component={Zesher}></Route>]
                                    <Route path="/assets/assets_persion/"      component={Persion}></Route>
                                    <Route path="/log/operation/"              component={Operationlog}></Route>
                                    <Route path="/log/login/"                  component={Loginlog  }></Route>
                                    <Route path="/release/release_dashboard/"  component={Next_release}></Route>
                                    <Route path="/release/status/"             component={ReleaseDetail}></Route>
                                    <Route path='/release/timer/'              component={Timer}></Route>
                                    <Route path="/release/crontab/"            component={Crontabs}></Route>
                                </Switch>
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            cmdb - ansible  ©2018 to open source 
      </Footer>
                    </Layout>
                </Layout>
            </div>
        )
    }
}
export default withRouter(App);
