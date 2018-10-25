import React,{Component} from 'react';
import Httpcode from './http_code';

export default class E404 extends Component {
    
    render() {
        return (
            <Httpcode code="404" />
        )
    }
}