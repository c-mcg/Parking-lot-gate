import React from 'react';
import PropTypes from 'prop-types';

import TextField from './index'

export default class NumberField extends TextField {
        displayName: "NumberField";

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {

        if (isNaN(value)) {
            return;
        }

        this.props.onChange && this.props.onChange(value);
    }

    render() {
        return (
            <TextField {...this.props} onChange={this.onChange}/>
        );
    }
}