import React from 'react';
import echarts from 'echarts'
import {dashborad_host_count} from '../api/request'

export default class Dashboard_host extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            success:null,
            field: null
        }
    }
    
    componentDidMount() {
        var success,field
        dashborad_host_count().then(res=>{
            if (res.data.code == 200) {
                this.setState({
                    success:res.data.data[0],
                    field:res.data.data[1]
                })
                this.showcharts()
            }
        })
    }
    showcharts() {
        var myChart = echarts.init(document.getElementById('host'));
       
        myChart.setOption({
            title : {
                text: '资产主机占比',
                subtext: '资产主机',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['未存活主机占比','存活主机占比']
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:this.state.field, name:'未存活主机占比'},
                        {value:this.state.success, name:'存活主机占比'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        },true)
    }

    render() {
        return (
            <div id="host" style={{ width: 500, height: 500,float:'left'}} ></div>
        )
    }
}