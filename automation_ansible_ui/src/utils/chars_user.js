import React from 'react';
import echarts from 'echarts'

export default class Dashboard_release extends React.Component {

    componentDidMount() {
        this.showcharts()
    }
    showcharts() {
        var myChart = echarts.init(document.getElementById('user'));
        myChart.setOption( {
            title: {
                text: '发布状态汇总'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['发布失败','发布成功']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'发布失败',
                    type:'line',
                    stack: '总量',
                    data:[3,13,1,14,6,3,5]
                },
                {
                    name:'发布成功',
                    type:'line',
                    stack: '总量',
                    data:[20,14,31,42,6,17,27]
                }
            ]
        },true)
    }

    render() {
        return (
            <div id="user" style={{ width: 700, height: 500,float:'left'}} ></div>
        )
    }
}