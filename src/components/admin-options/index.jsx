import React from 'react';
import PropTypes from 'prop-types';

import sha256 from 'sha256'

import {connect} from 'react-redux'

import { 
    setAdminPassword,
    setView,
    toggleAdminSettings,
    setLotSize
} from "../../redux/actions";

import OptionsPane from '../options-pane'
import Button from '../form/button'
import TextField from '../form/text-field'
import Form from '../form'
import PasswordField from '../form/text-field/password'
import NumberField from '../form/text-field/number'


import {cls} from "../../util"
import {VIEWS, salt} from '../../util/constants'

import './index.less'

const mapDispatchToProps = (dispatch) => {
    return {
        setAdminPassword: (fields) => {
            return setAdminPassword(dispatch, fields);
        },
        setView: (view) => {
            setView(dispatch, view);
        },
        closeAdminSettings: () => {
            toggleAdminSettings(dispatch, false);
        },
        setLotSize: (lotSize) => {
            setLotSize(dispatch, lotSize);
        }
    };
};

const mapStateToProps = (state) => {
    return {
        adminPassword: state.adminPassword,
        lotSize: state.lotSize
    };
};

class AdminOptions extends React.Component {
    displayName: "AdminOptions";
    constructor(props) {
        super(props);

        this.state = {
            currentPassword: null,
            settingPassword: !props.adminPassword,
            validatePassword: "",
            error: false
        }

        this.setAdminPassword = this.setAdminPassword.bind(this);

        this.setViewBoth = this.setViewBoth.bind(this);
        this.setViewEnter = this.setViewEnter.bind(this);
        this.setViewLeave = this.setViewLeave.bind(this);

        this.openChangePassword = this.openChangePassword.bind(this);
        this.closeChangePassword = this.closeChangePassword.bind(this);

        this.onValidatePassword = this.onValidatePassword.bind(this);
        this.onChangeLotSize = this.onChangeLotSize.bind(this);
    }

    setAdminPassword(values) {
        values = Object.assign({}, values);

        if (!values.password || !values.passwordConfirm || (values.currentPassword !== null && values.currentPassword === "")) {
            this.setState({
                error: "You must fill in " + (values.currentPassword === "" ? "all" : "both") + " fields"
            })
            return;
        }

        if (values.passwordConfirm !== values.password) {
            this.setState({
                error: "The passwords entered don't match"
            })
            return;
        }
        
        values.password = sha256(salt + values.password);
        values.passwordConfirm = sha256(salt + values.passwordConfirm);

        if (values.currentPassword !== "") {
            values.currentPassword = sha256(salt + values.currentPassword);
        }

        if (this.props.setAdminPassword(values)) {
            this.setState({
                currentPassword: values.password,
                settingPassword: false,
                error: false
            })
        } else {
            this.setState({
                error: "Old password is incorrect"
            })
        }

        return values.password;//For testing
    }

    onChangeLotSize(values) {
        if (!values.lotSize || values.lotSize === "") {
            return;
        }

        this.props.setLotSize(values.lotSize);
    }

    onValidatePassword(values) {
        console.log(values)
        if (!values.password || values.password === "") {
            this.setState({
                error: "You must enter a password"
            })
            return;
        }

        var currentPassword = sha256(salt + values.password);
        if (currentPassword === this.props.adminPassword) {
            this.setState({currentPassword, error: false})
        } else {
            this.setState({error: "Incorrect password"})
        }

        return currentPassword;//For testing
    }

    openChangePassword() {
        this.setState({
            settingPassword: true
        })
    }

    closeChangePassword() {
        this.setState({
            settingPassword: false
        })
    }

    setViewBoth() {
        this.setView('both')
    }

    setViewEnter() {
        this.setView('enter')
    }

    setViewLeave() {
        this.setView('leave')
    }

    setView(key) {
        this.props.setView(VIEWS[key]);
        this.props.closeAdminSettings();
    }

    render() {

        var settingPassword = !this.props.adminPassword || this.state.settingPassword; 
        var validated = !this.props.adminPassword || this.state.currentPassword === this.props.adminPassword;

        return (
            <OptionsPane hideForGate={false} title="Admin Settings" className={cls(this, 'adminSettingsPane')}>
                <div className={cls(this)}>

                    {!validated &&
                        <Form onSubmit={this.onValidatePassword}>
                            <PasswordField autoFocus
                                label="Admin Password" 
                                name="password"/>

                            <div className={cls(this, 'error')}>
                                {this.state.error && this.state.error}
                            </div>
                            <Button submit text="Submit"/>
                        </Form>
                    }

                    {validated &&
                        <div>
                            {settingPassword && 
                                <Form onSubmit={this.setAdminPassword}>
                                    <PasswordField autoFocus name="password" label="New password"/>

                                    <PasswordField name="passwordConfirm" label="Confirm password"/>

                                    {this.props.adminPassword && 
                                        <PasswordField name="currentPassword" label="Old password"/>
                                    }

                                    <div className={cls(this, 'error')}>
                                        {this.state.error && this.state.error}
                                    </div>

                                    <Button submit text="Set password"/>

                                    {this.props.adminPassword &&
                                        <Button text="Cancel" onClick={this.closeChangePassword}/>
                                    }
                                </Form>
                            }

                            {!settingPassword &&
                                <div>
                                    <div>
                                        <Button text="Enter View" onClick={this.setViewEnter}/>
                                        <Button text="Leave View" onClick={this.setViewLeave}/>
                                        <Button text="Both (testing only)" onClick={this.setViewBoth}/>
                                    </div>

                                    <Form onSubmit={this.onChangeLotSize}>
                                        <NumberField name="lotSize" label={'Lot Size: ' + this.props.lotSize}/> 
                                        <Button submit text="Change lot size"/>
                                    </Form>

                                    <Button text="Change password" onClick={this.openChangePassword}/>
                                    <Button text="Close admin settings (Ctrl + Shift + E)" onClick={this.props.closeAdminSettings} className={cls(this, 'closeButton')}/>
                                </div>
                            }

                        </div>
                    }                        
                </div>
            </OptionsPane>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminOptions)