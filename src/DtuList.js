import React from 'react';
import {
    TextField, TablePagination, Fab,
    Paper, Table, TableBody, TableCell,
    TableFooter, TableRow, TableHead, Button, Dialog,
    DialogActions, DialogContent, DialogTitle
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import EditIcon from '@material-ui/icons/Edit';
import AccessibilityIcon from '@material-ui/icons/Accessibility';

import './DtuList.css';

class DtuList extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        data: [],
        openDlg: false,
        edited: false,
        record: null,
        pageInfo: {
            rowsPerPage: 8,
            count: 0,
            page: 0,
            currentPage: 0
        }
    };

    componentWillMount() {
        this.loadData();
    }


    loadPageData = (rowsPerPage, currPageNum, callback) => {
        const url = `/api/dtu?rows=${rowsPerPage}&page=${currPageNum}`;
        return fetch(url, { headers: { 'content-type': 'application/json' }, credentials: 'include', method: 'get' })
            .then(v => {
                const { status } = v;
                if (status >= 200 && status < 300) {
                    return v.json();
                }
                throw new Error(v.statusText);
            })
            .then(v => {
                callback(v);
            })
            .catch(e => {
                this.props.enqueueSnackbar(e.message, {
                    variant: 'warning',
                    autoHideDuration: 1500,
                });
            });
    }

    loadData = () => {
        const { rowsPerPage, currentPage } = this.state.pageInfo;
        this.loadPageData(rowsPerPage, currentPage, v => {
            const { count, data } = v;
            const newPage = Object.assign({}, this.state.pageInfo, { count });
            this.setState({ data: data, pageInfo: newPage });
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
                    this.setState({ openDlg: false }, () => this.loadData());

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

    shouldComponentUpdate(nextProps, nextStat) {
        const b = nextStat.openDlg !== this.state.openDlg
            || nextStat.data !== this.state.data
            || this.state.pageInfo != nextStat.pageInfo;
        return b;
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
        return fetch('/api/dtu', {
            body: JSON.stringify({ newid, oldid }),
            method: 'put',
            credentials: 'include',
            headers: { 'content-type': 'application/json' }
        })
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

    getCurrentRecord = (obj, id) => {
        if (obj) {
            return obj[id];
        }
    }

    setCurrentRecord = (obj, id, val) => {
        if (obj) {
            obj[id] = val;
        }
    }


    rwTester = e => {

    }

    render() {
        const { data, openDlg, edited, pageInfo } = this.state;

        return (

            <Paper style={{ paddingTop: '8px' }}>
                <Table size={'small'}>
                    <TableHead>

                        <TableCell>
                            <Fab onClick={e => this.setState({ edited: false, openDlg: true })} size="small" color="secondary" aria-label="Add" >
                                <AddIcon />
                            </Fab>
                        </TableCell>

                        <TableRow>
                            <TableCell align={'center'}>在线状态</TableCell>
                            <TableCell align={'center'}>DTU标识</TableCell>
                            <TableCell align={'center'}>使用描述</TableCell>
                            <TableCell align={'center'}>创建日期</TableCell>
                            <TableCell align={'center'}>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.map((v, inx) => {
                                return (
                                    <TableRow key={inx}>
                                        <TableCell align={'center'}>{v['state']}</TableCell>
                                        <TableCell align={'center'}>{v['device_id']}</TableCell>
                                        <TableCell align={'center'}>{v['device_desc']}</TableCell>
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
                                                style={{ marginLeft: '8px' }}
                                                onClick={e => {
                                                    this.currentDTU = Object.assign({}, v);
                                                    this.setState({ edited: true, openDlg: true });
                                                }} size="small" color="default" aria-label="Remove" >
                                                <EditIcon />
                                            </Fab>
                                            <Fab
                                                style={{ marginLeft: '8px' }}
                                                onClick={this.rwTester} size="small" color="default" aria-label="Remove" >
                                                <AccessibilityIcon />
                                            </Fab>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }

                    </TableBody>
                    <TableFooter>
                        <TableRow>

                            <TablePagination
                                rowsPerPageOptions={[8]}
                                count={pageInfo.count}
                                page={pageInfo.currentPage}
                                rowsPerPage={pageInfo.rowsPerPage}
                                onChangePage={
                                    (e, num) => {
                                        this.loadPageData(pageInfo.rowsPerPage, num, v => {
                                            const { count, data } = v;
                                            const newPage = Object.assign({}, this.state.pageInfo, { count });
                                            newPage.currentPage = num;
                                            this.setState({ data: data, pageInfo: newPage });

                                        })
                                    }
                                }

                                onChangeRowsPerPage={
                                    (e) => {
                                        const { value } = e.target;
                                        const newPageInfo = Object.assign({}, pageInfo);
                                        newPageInfo.rowsPerPage = value;
                                        this.setState({ pageInfo: newPageInfo });
                                    }
                                }

                            >
                            </TablePagination>

                        </TableRow>
                    </TableFooter>
                </Table>
                <Dialog open={openDlg} onClose={e => this.setState({ openDlg: false })}>
                    <DialogTitle >{edited ? '编辑' : '添行'}</DialogTitle>
                    <DialogContent>
                        <div className={'dlg-content'}>
                            <TextField margin={'normal'} fullWidth={true} variant='filled' defaultValue={edited ? this.getCurrentRecord(this.currentDTU, 'device_id') : ''} onChange={v => this.currentDTU = v.target.value} label={'DTU标识'} />


                            <TextField margin={'normal'} fullWidth={true} variant='filled' defaultValue={edited ? this.getCurrentRecord(this.currentDTU, 'device_desc') : ''} onChange={v => this.currentDesc = v.target.value} label={'DTU描述'} />

                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={
                            e => {
                                const { edited } = this.state;
                                if (edited) {
                                    this.put();
                                } else {
                                    this.newLine();
                                }
                            }
                        }>确定</Button>
                        <Button onClick={e => this.setState({ openDlg: false })}>取消</Button>
                    </DialogActions>
                </Dialog>

            </Paper >
        );
    }
}

import { withSnackbar } from 'notistack';
export default withSnackbar(DtuList);