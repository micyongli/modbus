import React from 'react';
import { Toolbar, Grid, AppBar, Avatar, Drawer, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'
import { Route, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';
import DtuList from './DtuList';
import DeviceLog from './DeviceLog';
import { withSnackbar } from 'notistack';

class Home extends React.Component {

    state = {
        displayDrawer: false
    };


    componentWillMount() {
        // this.getUser();
    }

    getUser = () => {
        return fetch('/api/user', { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } })
            .then(v => {
                if (v.status >= 200 && v.status < 300) {
                    return v.json();
                }
                throw new Error(v.statusText);
            })
            .then(v => {

            })
            .catch(e => {
                this.props.enqueueSnackbar(e.message, {
                    variant: 'warning',
                    autoHideDuration: 1500,
                });
            });
    }

    exitLogin = e => {
        fetch('/logout', {
            type: 'post',
            headers: {
                'content-type': 'application/json;charset=utf8'
            },
            credentials: 'include'
        })
            .then(v => {
                const { status } = v;
                if (status >= 200 && status < 300) {
                    return v.json();
                }
                throw new Error(v.statusText);
            })
            .then(v => {
                if (v.code !== 0) {
                    throw new Error(v.message);
                }
                this.props.history.push('/login');
            })
            .catch(e => { })
    }

    drawerAction = (x) => {
        this.setState({ displayDrawer: x });
    }

    jump = url => {
        this.props.history.push(url);
    }

    render() {
        return (
            <Grid container justify={'center'}>
                <AppBar>
                    <Toolbar>
                        <IconButton onClick={e => this.drawerAction(true)}>
                            <MenuIcon style={{ color: 'white' }} />
                        </IconButton>
                        <div style={{ flex: 1 }}></div>
                        <Avatar style={{ marginLeft: -12, marginRight: 20 }} >U</Avatar>
                    </Toolbar>

                </AppBar>
                <Drawer open={this.state.displayDrawer} onClose={e => this.drawerAction(false)}>
                    <List>
                        <ListItem button onClick={e => { this.jump('/h/register'); this.drawerAction(false); }}>
                            <ListItemText >设备注册</ListItemText>
                        </ListItem>
                        <ListItem button onClick={e => { this.jump('/h'); this.drawerAction(false); }}>
                            <ListItemText >线上日志</ListItemText>
                        </ListItem>

                    </List>
                </Drawer>
                <Grid item xs={10} style={{ marginTop: '64px' }}>
                    <Route exact path="/h" component={DeviceLog} />
                    <Route exact path="/h/register" component={DtuList} />
                </Grid>
            </Grid>
        );
    }
}

export default withSnackbar(Home);