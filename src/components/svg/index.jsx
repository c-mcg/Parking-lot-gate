import React from 'react';
import PropTypes from 'prop-types';

import {cls} from "../../util"

import './index.less'

import loading from './svgs/loading.svg'

const SVGS = {
    loading
}

export default class SVG extends React.Component {

    render() {

        var svg = SVGS[this.props.name];

        if (!svg) {
            return null;
        }

        return (
            <div className={cls(this) + ' ' + this.props.className} dangerouslySetInnerHTML={{ __html: loading }}/>
        );
    }
}

SVG.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string
}

SVG.defaultProps = {
    name: "",
    className: ""
}

exports.SVGS = SVGS;//export for tests