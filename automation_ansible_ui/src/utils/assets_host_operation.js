import React, { Component } from 'react';
import { Model, Form } from 'antd';


export class Create extends Component {
    constructor(props) {
        super(props)
        this.state = {
            managervisible: false 
        }
    }
    handlemodel(value) {
        this.setState({
            managervisible: value
        })
    }
    render() {
        return (
            <div>
                <Modal
                    title="管理"
                    cancelText="关闭"
                    okText="确认"
                    visible={this.state.managervisible}
                    onOk={() => this.handlemodel(false)}
                    onCancel={() => this.handlemodel(false)}
                    destroyOnClose={true}
                >
                </Modal>

            </div>
        )
    }
}