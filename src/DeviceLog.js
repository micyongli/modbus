import React from 'react';
import {  Paper, Table, TableBody, TableCell, TableFooter, TableRow, TableHead } from '@material-ui/core';

class DeviceLog extends React.Component {

    state = {
        data: []
    };

    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        return fetch('/api/dtu_log', { credentials: 'include', method: 'get' })
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



    render() {
        const { data, openDlg, edited, v } = this.state;
        return (

            <Paper>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align={'center'}>上线日期</TableCell>
                            <TableCell align={'center'}>DTU标识</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.map((v, inx) => {
                                return (
                                    <TableRow key={inx}>
                                        <TableCell align={'center'}>{v['create_time']}</TableCell>
                                        <TableCell align={'center'}>{v['device_id']}</TableCell>
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
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Paper >
        );
    }
}

import { withSnackbar } from 'notistack';
export default withSnackbar(DeviceLog);