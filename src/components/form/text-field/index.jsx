import React from 'react';
import PropTypes from 'prop-types';

import {cls} from "../../../util"

import './index.less'

export default class TextField extends React.Component {
        displayName: "TextField";

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        var value = e.target ? e.target.value : e;

        if (this.props.maxLength && value.length > this.props.maxLength) {
            value = value.substring(0, this.props.maxLength);
        }

        this.props.onChange && this.props.onChange(value);
    }

    render() {
        return (
            <div className={cls(this)}>

                {this.props.label &&
                    <div className={cls(this, 'label')}>
                        {this.props.label}
                    </div>
                }

                <div className={cls(this, 'inputContainer')}>
                    <input type={this.props.type}
                        name={this.props.name}
                        autoFocus={this.props.autoFocus}
                        value={this.props.value}
                        onChange={this.onChange}
                        className={cls(this, 'input') + ' ' + this.props.className}/>
                </div>
            </div>
        );
    }
}

TextField.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    maxLength: PropTypes.number,
    buttonId: PropTypes.string,
    autoFocus: PropTypes.bool,
    type: PropTypes.string,
    name: PropTypes.string
}

TextField.defaultProps = {
    onChange: null,
    value: "",
    label: null,
    className: "",
    maxLength: 0,
    buttonId: "",
    autoFocus: false,
    type: "text",
    name: ""
}