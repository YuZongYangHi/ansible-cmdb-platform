import React from 'react';
import { task_detail, dashborad_host_count } from '../../api/request'

export default class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
    }

    componentDidMount = () => {
        let task_id = this.props.match.params.id;
        task_detail(task_id).then(res => {
        var timer
        try {
             timer = eval("("+res.data.data +")")
        } catch (error) {
            console.log(error)
             timer = res.data.data
        }
        
            if (res.data.code == 200) {
                this.setState({
                    data: JSON.stringify(timer,null,4)
                })
            }
        })
    }
    render() {
        return (
            <div>
                <pre>
                {this.state.data}
                </pre>
            </div>
        )
    }
}