import React from 'react';
import {
    TextField, TablePagination, Divider,
    Paper, Table, TableBody, TableCell,
    TableFooter, TableRow, TableHead, Button, Dialog,
    DialogActions, DialogContent, DialogTitle
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/RefreshSharp'
import AccessibilityIcon from '@material-ui/icons/Accessibility';

import VarTester from './VarTester';

import './DtuList.css';

class DtuList extends React.Component {

    constructor(props) {
        super(props);
        this.currentRecord = {};
    }

    state = {
        data: [],
        openDlg: false,
        edited: false,
        pageInfo: {
            rowsPerPage: 8,
            count: 0,
            page: 0,
            currentPage: 0
        },
        varTesterVisible: false
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

    create = e => {

        fetch('/api/dtu', { body: JSON.stringify(this.getEditRecordValues()), method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } })
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
            || this.state.pageInfo != nextStat.pageInfo ||
            nextStat.varTesterVisible !== this.state.varTesterVisible;
        return b;
    }

    update = () => {

        if (!this.editRecordRequireUpdate()) {
            this.props.enqueueSnackbar('无需更新!', {
                variant: 'info',
                autoHideDuration: 1500
            });
            return;
        }
        return fetch('/api/dtu', {
            body: JSON.stringify(this.getEditRecordValues()),
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


    /**编辑功能-开始 */

    initEditRecord = () => {
        this.currentRecord = Object.assign({});
    }

    assignEditRecord = r => {
        this.currentRecord = Object.assign({}, r, { oldVal: Object.freeze(Object.assign({}, r)) });
    }


    getEditRecord = id => {
        return this.currentRecord[id];
    }

    setEditRecord = (id, val) => {
        this.currentRecord[id] = val;
        return val;
    }

    editRecordRequireUpdate = () => {
        const { oldVal, ...newVal } = this.currentRecord;
        for (let key in newVal) {
            if (newVal[key] !== oldVal[key]) {
                return true;
            }
        }
        return false;
    }

    getEditRecordValues = () => {
        const { oldVal, ...newVal } = this.currentRecord;
        let old = {};
        if (typeof oldVal !== 'undefined') {
            old = { old_device_id: oldVal['device_id'] }
        }
        return Object.assign({}, newVal, old);
    }

    switchVarTesterDlg = selEl => {
        const { varTesterVisible } = this.state;
        const v = !varTesterVisible;
        if (!selEl)
            this.setState({ varTesterVisible: v });
        else {
            this.setState({ selEl, varTesterVisible: v });
        }
    }

    /**编辑功能-结束 */

    getDev = () => {
        const { selEl } = this.state;
        return Object.assign({}, selEl);
    }



    render() {
        const { data, openDlg, edited, pageInfo } = this.state;

        return (

            <Paper style={{ paddingTop: '8px' }}>
                <div className='tool-bar' >
                    <Button onClick={e => this.loadData()} color='primary'><RefreshIcon /></Button>
                    <Button onClick={e => this.setState({ edited: false, openDlg: true })} color='primary'><AddIcon /></Button>
                </div>
                <Divider />
                <div className='tab-container'>
                    <Table size={'small'}>
                        <TableHead>

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
                                            <TableCell align={'center'}>{v['online'] ? '在线' : '-'}</TableCell>
                                            <TableCell align={'center'}>{v['device_id']}</TableCell>
                                            <TableCell align={'center'}>{v['device_desc']}</TableCell>
                                            <TableCell align={'center'}>{v['create_time']}</TableCell>
                                            <TableCell align={'center'}>
                                                <Button
                                                    onClick={e => {
                                                        const id = v['device_id'];
                                                        if (confirm('确定要删除？')) {
                                                            this.delete(id);
                                                        }
                                                    }}
                                                    size="small"
                                                    color="primary"
                                                >
                                                    <RemoveIcon />
                                                </Button>
                                                <Button
                                                    style={{ marginLeft: '8px' }}
                                                    onClick={e => {
                                                        this.assignEditRecord(v);
                                                        this.setState({ edited: true, openDlg: true });
                                                    }}
                                                    size="small"
                                                    color="primary"
                                                >
                                                    <EditIcon />
                                                </Button>
                                                <Button
                                                    style={{ marginLeft: '8px' }}
                                                    onClick={e => this.switchVarTesterDlg(Object.assign({}, v))}
                                                    size="small"
                                                    color="primary"
                                                >
                                                    <AccessibilityIcon />
                                                </Button>
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
                </div>
                <Dialog open={openDlg} onClose={e => this.setState({ openDlg: false })}>
                    <DialogTitle >{edited ? '编辑' : '添加'}</DialogTitle>
                    <DialogContent>

                        <div className={'dlg-content'}>
                            <TextField
                                margin={'normal'}
                                fullWidth={true}
                                // variant='filled'
                                defaultValue={edited ? this.getEditRecord('device_id') : ''}
                                onChange={v => this.setEditRecord('device_id', v.target.value)}
                                label={'DTU标识'} />
                            <TextField
                                margin={'normal'}
                                fullWidth={true}
                                // variant='filled'
                                defaultValue={edited ? this.getEditRecord('device_desc') : ''}
                                onChange={v => this.setEditRecord('device_desc', v.target.value)}
                                label={'DTU描述'} />

                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={
                            e => {
                                const { edited } = this.state;
                                edited ? this.update() : this.create();
                            }
                        }>确定</Button>
                        <Button
                            onClick={e => this.setState({ openDlg: false })}
                        >取消</Button>
                    </DialogActions>
                </Dialog>


                <VarTester getDev={this.getDev} open={this.state.varTesterVisible} onClose={this.switchVarTesterDlg} />
            </Paper >
        );
    }
}

import { withSnackbar } from 'notistack';
export default withSnackbar(DtuList);