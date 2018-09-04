import React from 'react';
import PropTypes from 'prop-types';

import {cls} from "../../../util"

import './index.less'

export default class Button extends React.Component {

    constructor(props) {
        super(props);

        this.isButton = true;
    }

    render() {
        return (
            <input
                type={this.props.submit ? "submit" : "button"}
                name={this.props.id}
                onClick={this.props.submit ? null : this.props.onClick}
                className={cls(this) + ' ' + this.props.className}
                value={this.props.text}/>
        );
    }
}

Button.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string,
    className: PropTypes.string,
    submit: PropTypes.bool
}

Button.defaultProps = {
    onClick: null,
    text: "",
    className: "",
    submit: false
}