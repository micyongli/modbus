import React from 'react';

import { Input, Button, Paper, Grid, FormControl, FormLabel, TextField } from '@material-ui/core';

import './Login.css';


const submitBtn = {
    marginTop: '2.5em'
}
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
            <Grid className='login-container' container justify={'center'}>
                <Paper className="login-paper" >
                    <div className="login-div">
                        <form onSubmit={this.submit}>
                            <FormControl margin={'normal'} fullWidth={true}>

                                <TextField label={'帐号'} onChange={v => this.user = v.target.value} autoComplete='off' name={'user'} />
                            </FormControl>
                            <FormControl margin={'normal'} fullWidth={true}>

                                <TextField type="password" label={'密码'} onChange={v => this.pwd = v.target.value} autoComplete='off' name={'pwd'} />
                            </FormControl>
                            <FormControl style={submitBtn} margin={'normal'} fullWidth={true} >
                                <Button bgcolor={'primary.main'} color='primary' variant='contained' type="submit" >登录</Button>
                            </FormControl>
                        </form>
                    </div>
                </Paper>

            </Grid >
        );
    }

}