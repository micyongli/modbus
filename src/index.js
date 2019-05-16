import ReactDOM from 'react-dom';
import React from 'react';
import { SnackbarProvider } from 'notistack';
import { Route, BrowserRouter as Router, withRouter, Redirect } from 'react-router-dom';

import Login from './Login';
import Home from './Home';

class App extends React.Component {

    componentWillMount() {
        console.log(this.props)
    }

    render() {
        return (
            [
                <Route exact key={0} path="/" component={() => <Redirect to={'/h'} />} />,
                <Route key={1} path="/h" component={Home}></Route>,
                <Route key={2} path="/login" component={Login}></Route>
            ]
        );
    }

}

const AppRoot = withRouter(App);

ReactDOM.render(<Router><SnackbarProvider hideIconVariant={false}><AppRoot /></SnackbarProvider></Router>, document.getElementById('app'));