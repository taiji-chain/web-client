import React, {Component, Fragment} from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

class Form extends Component {

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <form>
                    <TextField
                        label="Address"
                        value={this.props.address}
                        onChange={this.props.handleChange('address')}
                        margin="normal"
                        style={{width: 370}}
                    />
                    <pre/>
                    <TextField
                        label="Amount"
                        value={this.props.amount}
                        onChange={this.props.handleChange('amount')}
                        margin="normal"
                    />
                    <pre/>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="currency-helper">Currency</InputLabel>
                        <Select
                            value={this.props.currency}
                            onChange={this.props.handleChange('currency')}
                            input={<Input name="currency" id="currency-helper" />}
                        >
                            <MenuItem value={'taiji'}>TAIJI</MenuItem>
                        </Select>
                        <FormHelperText>Select the currency you want to populate</FormHelperText>
                    </FormControl>
                    <pre/>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="unit-helper">Unit</InputLabel>
                        <Select
                            value={this.props.unit}
                            onChange={this.props.handleChange('unit')}
                            input={<Input name="unit" id="unit-helper" />}
                        >
                            <MenuItem value={'SHELL'}>SHELL</MenuItem>
                            <MenuItem value={'KSHELL'}>KSHELL</MenuItem>
                            <MenuItem value={'MSHELL'}>MSHELL</MenuItem>
                            <MenuItem value={'TAIJI'}>TAIJI</MenuItem>
                            <MenuItem value={'KTAIJI'}>KTAIJI</MenuItem>
                        </Select>
                        <FormHelperText>Select the currency unit</FormHelperText>
                    </FormControl>

                </form>
                <Button color="primary" variant="contained" onClick={this.props.postFaucet}>
                    Populate
                </Button>
                <Result currencyMap={this.props.currencyMap} />
            </Fragment>
        )
    }
}

export default withStyles(styles)(Form);
