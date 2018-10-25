import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router,Route,Link,Switch} from 'react-router-dom'
import Login from './component/login';
import E403 from './utils/E403';
import E404 from './utils/E404';

class Main extends React.Component{
    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path='/login' component={Login}></Route>
                        <Route path="/" component={App}></Route>
                        <Route component={E404}></Route>
                    </Switch>
                </Router>
            </div>
        )
    }
}
ReactDOM.render(<Main />, document.getElementById('root'));
