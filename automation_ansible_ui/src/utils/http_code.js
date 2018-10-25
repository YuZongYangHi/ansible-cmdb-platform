import React from 'react';

export default class Httpcode extends React.Component {
    render() {
        return (
            <div>
                <h1 style={{color: 'red'}}>{this.props.code}</h1>
            </div>
        )
    }
}