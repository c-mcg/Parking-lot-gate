import React from 'react';
import PropTypes from 'prop-types';

import {cls} from "../../util"

import './index.less'

export default class Ticket extends React.Component {

    render() {

        var test = ""
        return (
            <div className={cls(this)}>
                <img src={this.props.ticket.image}/>
            </div> 
        );
    }
}

Ticket.defaultProps = {
    ticket: null
}