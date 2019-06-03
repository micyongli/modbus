import React from 'react';

import {
    TextField, Select, MenuItem, Divider,
    Button, Dialog,
    FormControlLabel,
    Radio, DialogContent, DialogTitle
} from '@material-ui/core';

import './VarTester.css';


const testerBtn = {
    marginLeft: '12px'
};




class VarTester extends React.Component {
    constructor(props) {
        super(props);

        const { open } = props;
        this.state = {
            open: !!open,
            formVal: {
                dataType: 0,
                opType: 0,
                register: 0,
                alph: 1,
                devAdd: 2,
                value: 0
            }
        };

    }

    componentWillReceiveProps(props) {
        if (props.open !== this.props.open) {
            this.setState({ open: props.open });
        }
    }


    postData = e => {
        const { formVal } = this.state;
        const dev = this.props.getDev();
        const { opType } = formVal;
        return fetch(
            '/api/tester',
            {
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(Object.assign({}, formVal, { dev })),
                method: 'post'
            })
            .then(v => {
                if (v.status >= 200 && v.status < 300) {
                    return v.json();
                }
                throw new Error(v.statusText);
            })
            .then(v => {
                if (v.code !== 0) {
                    throw new Error(v.message);
                }
                const el = this.alph;
                let xs = parseFloat(el.value);

                if (isNaN(xs)) {
                    this.alph.value = 1;
                    xs = 1;
                }
                if (opType === 0) {
                    this.txt.value = xs * v.data[0];
                }
                this.props.enqueueSnackbar('ok', {
                    variant: 'success',
                    autoHideDuration: 1000,
                });

            })
            .catch(e => {
                this.props.enqueueSnackbar(e.message, {
                    variant: 'error',
                    autoHideDuration: 1000,
                });
            });
    }


    onTestClick = e => {

        this.postData();
    }

    onStoreClick = e => {
        this.props.enqueueSnackbar('暂未实现', {
            variant: 'warning',
            autoHideDuration: 1000,
        });
    }


    render() {
        const { open, formVal } = this.state;
        return (
            <Dialog open={open} onClose={e => this.props.onClose()}>
                <DialogTitle children={<div>变量测试</div>} />
                <Divider />
                <DialogContent className='tester-dlg-content'>
                    <TextField
                        margin={'normal'}
                        fullWidth={true}
                        defaultValue={formVal.devAdd}
                        onChange={v => {
                            this.setState({ formVal: Object.assign({}, formVal, { devAdd: v.target.value }) });
                        }}
                        label={'总线地址'} />

                    <TextField
                        margin={'normal'}
                        fullWidth={true}
                        defaultValue={formVal.register}
                        onChange={v => {
                            this.setState({ formVal: Object.assign({}, formVal, { register: v.target.value }) });
                        }}
                        label={'寄存器'}
                    />

                    <div style={{ marginTop: '10px' }}>
                        <FormControlLabel label='Int16' control={
                            <Radio
                                checked={formVal.dataType === 0}
                                onChange={e => { this.setState({ formVal: Object.assign({}, formVal, { dataType: 0 }) }) }} />
                        } />
                        <FormControlLabel label='Int32' control={
                            <Radio
                                checked={formVal.dataType === 1}
                                onChange={e => { this.setState({ formVal: Object.assign({}, formVal, { dataType: 1 }) }) }} />
                        } />
                        <FormControlLabel label='Float' control={
                            <Radio
                                checked={formVal.dataType === 2}
                                onChange={e => { this.setState({ formVal: Object.assign({}, formVal, { dataType: 2 }) }) }} />
                        } />
                    </div>
                    <TextField
                        margin={'normal'}
                        fullWidth={true}
                        defaultValue={formVal.alph}
                        inputRef={ref => this.alph = ref}
                        onChange={v => {
                            this.setState({ formVal: Object.assign({}, formVal, { alph: v.target.value }) });
                        }}
                        label={'系数'} />

                    <div style={{ marginTop: '10px' }}>
                        <FormControlLabel label='读' control={
                            <Radio
                                checked={formVal.opType === 0}
                                onChange={e => {
                                    this.txt.value = ' ';
                                    this.setState({ formVal: Object.assign({}, formVal, { opType: 0 }) });
                                }} />
                        } />
                        <FormControlLabel label='写' control={
                            <Radio
                                checked={formVal.opType === 1}
                                onChange={
                                    e => {
                                        this.setState({ formVal: Object.assign({}, formVal, { opType: 1 }) });
                                    }
                                } />
                        } />
                    </div>
                    <TextField
                        margin={'normal'}
                        fullWidth={true}
                        defaultValue={' '}
                        disabled={formVal.opType === 0}
                        inputRef={ref => this.txt = ref}
                        onChange={v => {
                            this.setState({ formVal: Object.assign({}, formVal, { value: v.target.value }) });
                        }}
                        label={'值'}

                    />

                    <div className='tester-divider' >
                        <Button onClick={this.onTestClick} variant='contained' color='primary'>测试</Button>
                        <Button onClick={this.onStoreClick} style={testerBtn} variant='contained' color='secondary'>存储</Button>
                    </div>
                </DialogContent>

            </Dialog>
        );
    }
}

import { withSnackbar } from 'notistack';
export default withSnackbar(VarTester);