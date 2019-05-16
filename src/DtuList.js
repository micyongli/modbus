import React from 'react';
import { Input, Fab, Paper, Table, TableBody, TableCell, TableFooter, TableRow, TableHead, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import EditIcon from '@material-ui/icons/Edit';
class DtuList extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        data: [],
        openDlg: false,
        edited: false,
        v: ''
    };

    componentWillMount() {
        console.log(this.props.title)
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

            <Paper style={{ paddingTop: '8px' }}>

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
                                            <Fab onClick={e => {
                                                const id = v['device_id'];
                                                if (confirm('确定要删除？')) {
                                                    this.delete(id);
                                                }
                                            }} size="small" color="default" aria-label="Edit" >
                                                <RemoveIcon />
                                            </Fab>
                                            <Fab
                                                
                                                style={{marginLeft:'8px'}}
                                                onClick={e => {
                                                    const id = v['device_id'];
                                                    this.currentDTU = id;
                                                    this.setState({ v: id, edited: true, openDlg: true });
                                                }} size="small" color="default" aria-label="Remove" >
                                                <EditIcon />
                                            </Fab>

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

                                <Fab onClick={e => this.setState({ edited: false, openDlg: true })} size="small" color="secondary" aria-label="Add" >
                                    <AddIcon />
                                </Fab>
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