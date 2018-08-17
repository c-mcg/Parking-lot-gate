import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux'

import {cls} from "../../util"

import './index.less'

const mapStateToProps = (state) => {
    return {
        gateOpen: state.gateOpen
    };
};

class OptionsPane extends React.Component {
        displayName: "OptionsPane";

    render() {
        return (
            <div className={cls(this) + ' ' + this.props.className}>
                <div className={cls(this, 'title')}>
                    {this.props.title}
                </div>

                {this.props.hideForGate && this.props.gateOpen ?
                    <div className={cls(this, 'message')}>Please drive through the gate</div>
                :
                    this.props.children
                }

            </div>  
        );
    }
}

OptionsPane.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    hideForGate: PropTypes.bool
}

OptionsPane.defaultProps = {
    title: "",
    className: "",
    hideForGate: true
}

export default connect(mapStateToProps)(OptionsPane);