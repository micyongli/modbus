import React from 'react';

import { withSnackbar } from 'notistack';
import { Paper} from '@material-ui/core';

import Button from "@material-ui/core/Button";

class UserInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        showResetDlg: false,
        data: void 0
    }


    newUser = e => {
        this.setState({ showResetDlg: false });
    }


    componentWillMount() {
        fetch('/api/user', { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } })
            .then(v => {
                if (v.status >= 200 && v.status < 300) {
                    return v.json();
                }
                throw new Error(v.statusText);
            })
            .then(v => {
                this.setState({ data: v });
            })
            .catch(e => {
                this.props.enqueueSnackbar(e.message, {
                    variant: 'warning',
                    autoHideDuration: 1500,
                });
            });
    }

    render() {

        const { showResetDlg, data } = this.state;
        return (

            <Paper style={{ paddingTop: '8px' }}>
                {/* <Table padding={'default'}>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ width: '35%' }} align={'right'}>登录ID</TableCell>
                            <TableCell>{data ? data['user_id'] : ''}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align={'right'}>上次登录</TableCell>
                            <TableCell>{data ? data['last_login_time'] : ''}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align={'right'}></TableCell>
                            <TableCell>
                                <Button color={'primary'} variant="outlined" onClick={e => this.setState({ showResetDlg: true })}>密码重置</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Dialog open={showResetDlg} onClose={e => this.setState({ showResetDlg: false })} >
                    <DialogTitle >
                        密码重置
                    </DialogTitle>
                    <DialogContent style={{ flex: 1 }}>
                        <TextField type={'password'} label={'输入密码'} margin={'normal'} ></TextField>
                        <br />
                        <TextField type={'password'} label={'重新输入'} margin={'normal'}></TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button variant={'outlined'} color={'primary'} onClick={this.newUser} >确定</Button>
                    </DialogActions>
                </Dialog> */}
            </Paper>

        );
    }
}

export default withSnackbar(UserInfo);