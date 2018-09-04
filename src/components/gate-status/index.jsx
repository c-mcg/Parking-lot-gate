import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux'

import {cls} from "../../util"

import './index.less'

const mapStateToProps = (state) => {
    return {
        open: state.gateOpen,
    };
};

class GateStatus extends React.Component {

    render() {
        return (
            <div className={cls(this)}>
                Gate:
                <span className={cls(this, 'text', {
                    open: this.props.open
                })}>
                    {this.props.open ? 'Open' : 'Closed'}
                </span>
            </div>  
        );
    }
    
}

export default connect(mapStateToProps)(GateStatus);