import React from 'react';

import TextField from './index'

export default class PasswordField extends TextField {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TextField {...this.props} type="password"/>
        );
    }
}