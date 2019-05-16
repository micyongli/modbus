import React from 'react';
import { Input, InputLabel, Paper, Table, TableBody, TableCell, TableFooter, TableRow, TableHead, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

class DtuList extends React.Component {

    state = {
        data: [],
        openDlg: false,
        edited: false,
        v: ''
    };

    componentWillMount() {

        this.loadData();

    }

    loadData = () => {
        return fetch('/api/dtu', { credentials: 'include', method: 'get' })
            .then(v => {
                const { status } = v;
                if (status >= 200 && status < 300) {
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

    newLine = e => {
        if (this.currentDTU) {
            fetch('/api/dtu', { body: JSON.stringify({ id: this.currentDTU }), method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } })
                .then(v => {
                    if (v.status >= 200 && v.status < 300) {
                        return;
                    }
                    throw new Error(v.statusText);
                })
                .then(() => {
                    this.setState({ openDlg: false });
                    this.loadData();
                })
                .catch(e => {
                    this.props.enqueueSnackbar(e.message, {
                        variant: 'warning',
                        autoHideDuration: 1500,
                    });
                });
        }

    }

    delete = (id) => {
        return fetch('/api/dtu', { body: JSON.stringify({ id }), method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } })
            .then(v => {
                if (v.status >= 200 && v.status < 300) {
                    return;
                }
                throw new Error(v.statusText);
            })
            .then(() => {
                return this.loadData();
            })
            .catch(e => {
                this.props.enqueueSnackbar(e.message, {
                    variant: 'warning',
                    autoHideDuration: 1500,
                });
            });
    }


    put = () => {
        const { v } = this.state;
        let newid = this.currentDTU;
        let oldid = v;
        if (newid === v) {
            this.props.enqueueSnackbar('无需更新!', {
                variant: 'info',
                autoHideDuration: 1500
            });
            return;
        }
        return fetch('/api/dtu', { body: JSON.stringify({ newid, oldid }), method: 'put', credentials: 'include', headers: { 'content-type': 'application/json' } })
            .then(v => {
                if (v.status >= 200 && v.status < 300) {
                    this.setState({ openDlg: false, edited: false });
                    return;
                }
                throw new Error(v.statusText);
            })
            .then(() => {
                return this.loadData();
            })
            .catch(e => {
                this.props.enqueueSnackbar(e.message, {
                    variant: 'warning',
                    autoHideDuration: 1500,
                });
            });
    }

    render() {
        const { data, openDlg, edited, v } = this.state;
        return (

            <Paper>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align={'center'}>DTU标识</TableCell>
                            <TableCell align={'center'}>创建日期</TableCell>
                            <TableCell align={'center'}>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.map((v, inx) => {
                                return (
                                    <TableRow key={inx}>
                                        <TableCell align={'center'}>{v['device_id']}</TableCell>
                                        <TableCell align={'center'}>{v['create_time']}</TableCell>
                                        <TableCell align={'center'}>
                                            <Button onClick={e => {
                                                const id = v['device_id'];
                                                if (confirm('确定要删除？')) {
                                                    this.delete(id);
                                                }
                                            }}>删除</Button>

                                            <Button onClick={e => {
                                                const id = v['device_id'];
                                                this.currentDTU = id;
                                                this.setState({ v: id, edited: true, openDlg: true })
                                            }}>编辑</Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }

                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell align={'center'}>查询: {data.length} 行</TableCell>
                            <TableCell align={'center'}></TableCell>
                            <TableCell align={'center'}>
                                <Button onClick={e => this.setState({ edited: false, openDlg: true })}>添行</Button>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <Dialog open={openDlg} onClose={e => this.setState({ openDlg: false })}>
                    <DialogTitle >{edited ? '编辑' : '添行'}</DialogTitle>
                    <DialogContent>
                        <Input defaultValue={edited ? v : ''} onChange={v => this.currentDTU = v.target.value} placeholder={'DTU标识'} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={e => {
                            const { edited } = this.state;
                            if (edited) {
                                this.put();
                            } else {
                                this.newLine();
                            }
                        }}>确定</Button>
                        <Button onClick={e => this.setState({ openDlg: false })}>取消</Button>
                    </DialogActions>
                </Dialog>

            </Paper >
        );
    }
}

import { withSnackbar } from 'notistack';
export default withSnackbar(DtuList);