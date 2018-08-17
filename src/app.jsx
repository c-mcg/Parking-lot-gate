import React from 'react'

import {connect} from "react-redux";

import {cls} from './util'
import {VIEWS} from './util/constants'

import {toggleAdminSettings} from "./redux/actions";

import GateStatus from './components/gate-status'
import OptionsPane from './components/options-pane'
import EnterOptions from './components/enter-options'
import LeaveOptions from './components/leave-options'
import AdminOptions from './components/admin-options'

import './app.less'

const NUM_SPACES = 120;

const mapStateToProps = (state) => {
    return {
        adminPassword: state.adminPassword,
        view: state.view,
        adminSettingsOpen: state.adminSettingsOpen
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleAdminSettings: (open) => {
            toggleAdminSettings(dispatch, open);
        }
    };
};

class App extends React.Component {
        displayName: "App";

    constructor(props) {
        super(props);

        this.gateTimeout = 0;

        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown)
    }

    onKeyDown(e) {
        if (e.which === 69 && e.ctrlKey && e.shiftKey) {//ctrl + shift + e
            this.props.toggleAdminSettings(!this.props.adminSettingsOpen);
            
            e.preventDefault();
            e.stopPropagation();
        }
    }

    render() {

        return (
            <div className={cls(this)}>

                {(!this.props.adminPassword || this.props.adminSettingsOpen) &&
                    <AdminOptions/>
                }

                {this.props.adminPassword && this.props.view !== -1 &&
                    <GateStatus/>   
                }

                {(this.props.view === VIEWS.both || this.props.view === VIEWS.enter) && this.props.adminPassword && 
                    <EnterOptions/>
                }

                {(this.props.view === VIEWS.both || this.props.view === VIEWS.leave) && this.props.adminPassword && 
                    <LeaveOptions/>
                }
            </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App)