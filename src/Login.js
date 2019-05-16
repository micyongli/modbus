import React from 'react';

import { Input, Button, Paper, Grid, FormControl, FormLabel, Tab, Tabs, AppBar } from '@material-ui/core';

export default class Login extends React.PureComponent {

    submit = (e) => {
        e.preventDefault();
        e.stopPropagation();


        fetch('/do',
            {
                headers: {
                    'content-type': 'application/json; charset=utf-8'
                },
                credentials: 'include',
                method: 'post',
                body: JSON.stringify({ user: this.user, pwd: this.pwd })
            })
            .then(v => {
                const { status } = v;
                if (status >= 200 && status < 300) {
                    return v.json();
                }
                throw new Error(v.statusText);
            })
            .then(v => {
                const { code } = v;
                if (code !== 0) {
                    this.user.focus();
                    throw new Error(v.message);
                }
                this.props.history.push('/');
            })
            .catch(e => {
                console.log(e);
            });
        return false;
    }

    render() {

        return (
            <Grid style={{ padding: '2px', paddingTop: '5em' }} container justify={'center'}>


                <Paper style={{ width: '25em', margin: 0 }} >
                   
                    <div style={{ marginTop: '1em', padding: '4em' }}>
                        <form onSubmit={this.submit}>
                            <FormControl margin={'normal'} fullWidth={true}>
                                <FormLabel>帐号</FormLabel>
                                <Input onChange={v => this.user = v.target.value} autoComplete='off' name={'user'} />
                            </FormControl>
                            <FormControl margin={'normal'} fullWidth={true}>
                                <FormLabel>密码</FormLabel>
                                <Input type="password" onChange={v => this.pwd = v.target.value} autoComplete='off' name={'pwd'} />
                            </FormControl>
                            <FormControl margin={'normal'} fullWidth={true} >
                                <Button bgcolor={'primary.main'}  color={'primary'} type="submit" >登录</Button>
                            </FormControl>

                        </form>
                    </div>
                </Paper>

            </Grid >
        );
    }

}