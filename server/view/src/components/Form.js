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
        console.log(this.props.match.params.formId);
        const { classes } = this.props;
        return (
            <Fragment>Form</Fragment>
        )
    }
}

export default withStyles(styles)(Form);
