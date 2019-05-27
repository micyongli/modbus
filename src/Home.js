import React from 'react';
import { Toolbar, Grid, AppBar, Avatar, Drawer, IconButton, List, ListItem, ListItemText, Tooltip, ListItemIcon } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ListSharpIcon from '@material-ui/icons/ListSharp';
import DevicesIcon from '@material-ui/icons/DevicesSharp';
import { Route, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';
import DtuList from './DtuList';
import DeviceLog from './DeviceLog';
import { withSnackbar } from 'notistack';

import UserInfo from './UserInfo';

import './Home.css';

import { getTitleByPath } from './RouteConfig';


class Home extends React.Component {

    state = {
        displayDrawer: false,
        title: '设备注册'
    };


    setTitle = txt => {
        this.setState({ title: txt })
    }


    componentWillMount() {
        console.log('home will mount')
        const { location } = this.props.history;
        const { pathname } = location;
        const mapTile = getTitleByPath(pathname);
        if (mapTile)
            this.setTitle(mapTile);
    }

    shouldComponentUpdate(p, s) {
        return s.title !== this.state.title || s.displayDrawer !== this.state.displayDrawer;
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

    jump = (url, desc) => {
        this.props.history.push(url);
    }

    componentWillReceiveProps(nextProps) {
        const { location } = nextProps;
        const newTitle = getTitleByPath(location.pathname);
        if (newTitle && this.state.title !== newTitle) {
            this.setTitle(newTitle);
        }
    }

    menuItemClick = (route) => {
        this.jump(route);
        this.drawerAction(false);
    }


    render() {
        const { title, displayDrawer } = this.state;
        console.log('render home ', new Date());
        return (
            <Grid container justify={'center'}>
                <AppBar>
                    <Toolbar>
                        <IconButton onClick={e => this.drawerAction(true)}>
                            <MenuIcon className={'toolbar-text-color'} />
                        </IconButton>
                        <h4 style={{ marginLeft: '16px' }} color={'inherited'}>{title}</h4>
                        <div style={{ flex: 1 }}></div>
                        <Tooltip title={'用户'}>
                            <Avatar alt={'xx'} style={{ cursor: 'pointer', marginLeft: -12, marginRight: 20 }} onClick={e => {
                                this.jump('/h/user');
                            }} />
                        </Tooltip>
                    </Toolbar>

                </AppBar>
                <Grid item xs={10} style={{ marginTop: '64px' }}>
                    <Route exact path="/h" component={DeviceLog} />
                    <Route exact path="/h/register" component={DtuList} />
                    <Route exact path={'/h/user'} component={UserInfo} />
                </Grid>
                <Drawer open={displayDrawer} onClose={e => this.drawerAction(false)}>

                    <List className={'drawer-left'}>
                        <ListItem button onClick={e => this.menuItemClick('/h/register')}>
                            <ListItemIcon><DevicesIcon /></ListItemIcon>
                            <ListItemText primary='设备注册' />
                        </ListItem>
                        <ListItem button onClick={e => this.menuItemClick('/h')}>
                            <ListItemIcon><ListSharpIcon /></ListItemIcon>
                            <ListItemText primary='上线日志' />
                        </ListItem>

                    </List>
                </Drawer>

            </Grid>

        );
    }
}

export default withSnackbar(Home);