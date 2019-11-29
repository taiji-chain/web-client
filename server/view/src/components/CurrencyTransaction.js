import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import moment from "moment";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

class CurrencyTransaction extends Component {

    render() {
        const { classes } = this.props;
        console.log(this.props.form.result);
        let result;
        if(this.props.form.result) {
            result = (
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell numeric>TxId</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>ToAddress</TableCell>
                                <TableCell numeric>Amount in SHELL</TableCell>
                                <TableCell>Data</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.form.result.map(row => {
                                return (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>
                                        <TableCell>{moment.utc(row.time).format()}</TableCell>
                                        <TableCell>{row.toAddress}</TableCell>
                                        <TableCell numeric>{this.props.address === row.toAddress? '+' + row.value : '-' + row.value}</TableCell>
                                        <TableCell>{row.data}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            )
        } else {
            if(this.props.error) {
                console.log('error is not empty');
                result = <div>Error: {this.props.form.error}</div>
            } else {
                result = ''
            }
        }
        return (
            <Fragment>
                {result}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    form: state.form
});


export default connect(
    mapStateToProps
)(withStyles(styles)(CurrencyTransaction));
