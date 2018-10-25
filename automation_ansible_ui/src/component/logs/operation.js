import React from 'react';
import Logsearch from '../../utils/loginput';

export default class Operationlog extends React.Component {

    render() {
        return (
            <div>
                <Logsearch async={"operation"} res={false} test={true} control={false}/>
            </div>
        )
    }
}



