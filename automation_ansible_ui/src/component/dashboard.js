import React from 'react';
import echarts from 'echarts'
import Dashboard_host from '../utils/chars_host'
import Dashboard_release from '../utils/chars_user'

export default class Dashboard extends React.Component {

    render() {
        return (
            <div style={{width:2000,height:700}}>
                <Dashboard_host/>
                <Dashboard_release/>
            </div>
        )
    }
}