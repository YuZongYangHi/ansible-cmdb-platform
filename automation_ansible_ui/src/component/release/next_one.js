import '../../css/release_next.css'
import React from 'react'
import { get_group, index_v,task_submit,task_check, search_group  } from '../../api/request'
import {
  Form, Select, InputNumber, Switch, Radio, Divider,
  Steps, Slider, Button, Upload, Icon, Rate, message,
  Input, Alert,Row, Col,Progress
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const Step = Steps.Step;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

class Next_release extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      sign: null,
      result_option: null,
      host_data: new Array,
      group_data: new Array,
      use_host: new Array,
      use_group: null,
      use_host_option: null,
      use_group: null,
      host_is_disable: true,
      group_is_disable: true,
      release_type: null,
      play_book_is_none: 'none',
      ad_hoc_is_none: 'none',
      release_type:null,
      release_host:null,
      release_cmd:null,
      release_option:null,
      new_token:null,
      salt_token:new Array,
      unicode:null,
      use_host_options:null,
      option_shell:'shell',
      result_from:null,
      release_list_ready:null,
      host_list_res:null,
      task_id:null
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;
    this.steps = [{
      title: '发布信息',
      content: () => {
        return (
          <div className="release_first">
            <Form
              onSubmit={this.handleSubmit}
              layout={'horizontal'}
            >
              <FormItem
                label="主机类型"
                { ...formItemLayout}
              >
                {getFieldDecorator('host_type', {
                  rules: [{ required: true }],
                  initialValue: this.state.use_host_options
                })(
                  <RadioGroup
                    // defaultValue={this.state.use_host_option}
                    onChange={(e) => {
                      this.props.form.resetFields()
                      if (e.target.value == 'host') {
                        this.setState({
                          group_is_disable: true,
                          host_is_disable: false,
                          use_group: new Array,
                          unicode:'主机多选模式'

                        })
                      } else {
                        this.setState({
                          group_is_disable: false,
                          host_is_disable: true,
                          use_host: new Array,
                          unicode:'群组模式',
                          

                        })
                      }
                      this.setState({
                        use_host_options: e.target.value,
                      })
                    }}>
                    <Radio value="host">主机模式</Radio>
                    <Radio value="group">群组模式</Radio>
                  </RadioGroup>
                  )}
              </FormItem>
              <FormItem
                label="选择主机"
                { ...formItemLayout}
              >
                {getFieldDecorator('host_name', {
                  rules: [{ required: true, message: "主机至少是一个" }],
                  initialValue: this.state.use_host,

                })(
                  <Select
                    labelInValue
                    mode="multiple"
                    allowClear={true}
                    style={{ width: '300px' }}
                    disabled={this.state.host_is_disable}

                    onChange={(e) => {
                      this.setState({
                        use_host: e
                      })
                     
                    }}>
                    {this.state.host_data}
                  </Select>
                  )}
              </FormItem>
              <FormItem
                label="选择群组"
                { ...formItemLayout}
              >
                {getFieldDecorator('group_name', {
                  rules: [{ required: true, message: "主机群组至少是一个" }],
                  initialValue: this.state.use_group
                })(
                  <Select
                    // defaultValue={['abc', '5800']}
                    allowClear={true}
                    style={{ width: '300px' }}
                    disabled={this.state.group_is_disable}
                    onChange={(e) => {
                      this.setState({
                        use_group: e
                      })
                    }}>
                    {this.state.group_data}
                  </Select>
                  )}
              </FormItem>
              <FormItem
                label="发布类型"
                { ...formItemLayout}
              >
                {getFieldDecorator('release_type', {
                  rules: [{ required: true }],
                  initialValue: this.state.release_type
                })(
                  <RadioGroup
                    // defaultValue={this.state.use_host_option}
                    onChange={(e) => {
                      this.setState({
                        release_type: e.target.value,
                        play_book_is_none: e.target.value == 'playbook' ? 'block' : 'none',
                        ad_hoc_is_none: e.target.value == 'adhoc' ? 'block' : 'none',
                        use_host_option:null
                      })
                    }}>
                    <Radio value="adhoc">Ad-hoc</Radio>
                    <Radio value="playbook">Playbook</Radio>
                  </RadioGroup>
                  )}
              </FormItem>
              <FormItem
                style={{ display: this.state.play_book_is_none }}
                label="文件选择"
                { ...formItemLayout}
              >
                {getFieldDecorator('file', {
                  rules: [{ required: true, message: "请填写正确的文件" }],
                  initialValue: this.state.use_host_option
                })(
                  <Input prefix={<Icon type="file" style={{ color: 'rgba(0,0,0,.25)' }} />} style={{ width: 300 }} placeholder="/etc/ansible/" 
                  onChange={(e)=> {this.setState({
                    use_host_option:e.target.value
                  })}}
                  />
                  )}
              </FormItem>
              <FormItem
                style={{ display: this.state.ad_hoc_is_none }}
                label="执行命令"
                { ...formItemLayout}
              >
                {getFieldDecorator('cmd', {
                  rules: [{ required: true, message: "请填写正确的值" }],
                  initialValue: this.state.use_host_option
                })(
                  <Input addonBefore={this.selectBefore} prefix={<Icon type="file" style={{ color: 'rgba(0,0,0,.25)' }} />} style={{ width: 300 }} placeholder="name=$1 state=$2" 
                    onChange={
                      (e)=> {this.setState({
                      use_host_option:e.target.value
                    })}} 
                    />
                  )}
              </FormItem>
            </Form>
          </div>
        )
      },
    }, {
      title: '确认发布信息',
      content: () => {
        return (
          <div className="release_first">
              <Alert message="确认提交后,将开始发布任务，一经发布无法撤回" type="info" showIcon /><br/>
              <div style={{textAlign:'initial',fontWeight:'bold',letterSpacing:3}} >
                主机类型:{this.state.unicode}
              </div>
              <br/>
              <div style={{textAlign:'initial',fontWeight:'bold',letterSpacing:3}} >
                发布模式:{this.state.release_type}
              </div>
              <br/>
              <div style={{textAlign:'initial',fontWeight:'bold',letterSpacing:2}} >
                发布列表:{this.state.release_list_ready}
              </div>
              <br/>
              <div style={{textAlign:'initial',fontWeight:'bold'}} >
              发布命令:{this.state.option_shell} -> {this.state.use_host_option}
              </div>
                <Divider />       
               <div className="gutter-box" style={{ marginBottom: 16 }}>
                  <Input addonBefore="token:" type="password" defaultValue={this.state.new_token} onChange={(e) => {this.setState({new_token:e.target.value})} } />              
          </div>  
          </div>
        )
      },
    }, {
      title: '完成',
      content: () => {
        return (
          <div>
          <div className="release_result" >
            <Progress type="circle" percent={100} width={80} />
            </div>
            <div className='release_size'>任务id:{this.state.task_id}</div>
            <div className='release_alert'>请耐心等待发布完成,期间不允许发布其他任务</div>

           
         </div>
        )
      }
    }];
    
    this.selectBefore = (
      <Select defaultValue={this.state.option_shell}  allowClear={true}  style={{ width: 90 }} onChange={(e)=> {this.setState({option_shell:e})}} >
        <Option value="shell">shell</Option>
        <Option value="command">command</Option>
        <Option value="service">service</Option>
        <Option value="copy">copy</Option>
        <Option value="user">user</Option>
        <Option value="group">group</Option>
        <Option value="file">file</Option>
        <Option value="template">template</Option>
        <Option value="yum">yum</Option>
        <Option value="apt">apt</Option>
        <Option value="pip">pip</Option>
    
      </Select>
    );
  }

  next() {
    
    if (this.state.current == 0) {
      var form = this.props.form.getFieldsValue();

      if (!this.state.use_host_option || !this.state.use_host || !this.state.use_group || !form.release_type) {
        message.warning('填写正确的发布信息')
        return
      } else if (this.state.release_type == 'playbook' && !form.file) {
        message.warning('请填写正确的playbook执行文件')
        return
      } else if (this.state.release_type == 'adhoc' && !form.cmd) {
        message.warning('请选择正确的adhoc命令')
        return
      } else if (this.state.use_host_option == 'host' && this.state.use_host.length == 0 || this.state.use_host_option == "group" && this.state.use_group.length == 0) {
        message.warning("请选择主机或主机组")
        return
      }
      this.setState({
        result_from:form
      })
      this.release_list()
    } else if (this.state.current == 1) {
      if (!this.state.new_token) {
        message.error('token不能为空!')
        return 
      } else {
        this.state.result_from['token'] = this.state.new_token
        this.state.result_from['use_hosts'] = this.state.release_list_ready
        this.state.result_from['option'] = this.state.host_is_disable
        this.state.result_from['module'] = this.state.option_shell
        console.log(this.state.option_shell)
        task_submit(this.state.result_from).then(res=>{
         
          if (res.data.code == 200) {
            this.setState({
              task_id:res.data.data.id
            })
          } else if (res.data.code == 499) {
            message.error('token输入有误!')
            this.setState({
              current: 1
            })
            return 
          }
        })
        //return  
      }
    }
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

 
  componentDidMount() {
    task_check().then(res=> {
      if (res.data.code == 6666) {
        this.setState({
          current:2,
          task_id:res.data.data.task_id
        })
      }
    })
    try {
      index_v().then(res => {
        let data = JSON.parse(res.data.data)
       
        for (let i in data) {
          if (data[i].running == 1) {
            this.state.host_data.push(<Option key={data[i].id} value={data[i].hostname}>{data[i].hostname}</Option>)
          }
        }
      })
      get_group().then(res => {
        let data = JSON.parse(res.data.data);
        for (let i in data) {
          this.state.group_data.push(<Option key={data[i].id} value={data[i].groupname}>{data[i].groupname}</Option>)
        }
      })

    } catch (error) {
      
    }
  }

  release_list() {
    var response;
    var form = this.props.form.getFieldsValue();
    if (!this.state.host_is_disable) {
      var result = '';
      for (let i in form.host_name) {
        result = result + form['host_name'][i].key + ','
      }  
      response = result
    } else {
      var result = form['group_name'];
     response = result 
  }
  this.setState({
    release_list_ready:response
  })
  }
  handleSubmit(e) {
    e.preventDefault()
  }
  handler_submit() {
    message.success('提交成功')
  }

  render() {

    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          {this.steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{this.steps[current].content()}</div>
        <div className="steps-action">
          {
            //current < this.steps.length - 1
            current == 0 ?
             <Button type="primary" onClick={() => this.next()}>下一步</Button> 
             : current == 1 ?
             <Button type="primary" onClick={() => this.next()}>提交</Button>:
             <Button type="primary" >返回</Button>

             
          }
       {/*   {
            current === this.steps.length - 1
            && <Button type="primary" loading={false} onClick={() => this.handler_submit()}>发布</Button>
          }*/}
          {
            current > 0
            && current == 2 && (
              <Button style={{ marginLeft: 8 }} onClick={ () => window.location.href = '/release/status/'}>
                查看状态 
            </Button> ||  <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                上一步
            </Button>
            )
          }
        </div>
      </div>
    );
  }
}

export default Next_release = Form.create()(Next_release)