import React from 'react';

import {connect} from 'react-redux'

import { setGeneratedTicket, openGate, addTicket } from "../../redux/actions";

import OptionsPane from '../options-pane'
import Button from '../form/button'
import TicketComponent from '../ticket'

import {cls} from "../../util"
import Ticket from '../../util/ticket'

import './index.less'

const mapDispatchToProps = (dispatch) => {
    return {
        openGate: (ticket) => {
            addTicket(dispatch, ticket)
            openGate(dispatch, ticket);
            setGeneratedTicket(dispatch, null)
        },
        setGeneratedTicket: (ticket) => {
 setGeneratedTicket(dispatch, ticket);
},
    };
};

const mapStateToProps = (state) => {
    return {
        ticket: state.generatedTicket,
        lotFull: Object.keys(state.tickets).length >= state.lotSize
    };
};

class EnterOptions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            error: false
        }

        this.printTicket = this.printTicket.bind(this);
        this.downloadTicket = this.downloadTicket.bind(this);
        this.createTicket = this.createTicket.bind(this)
    }

    //param ticket for testing
    createTicket() {

        if (this.props.lotFull) {
            return;
        }

        const ticket = new Ticket();

        ticket.generateImage(
            () =>  {
                this.setState({
                    error: false
                }, () => {
                    this.props.setGeneratedTicket(ticket)
                })
            },
            () => this.setState({error: 'Could not generate ticket'})
        );

    }

    downloadTicket() {

        if (!this.props.ticket) {
            return;
        }

        const downloadLink = document.createElement("a");

        downloadLink.href = this.props.ticket.image;
        downloadLink.download = "ticket.png";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        this.props.openGate(this.props.ticket);
    }

    printTicket() {

        if (!this.props.ticket) {
            return;
        }

        const popup = window.open();

        popup.document.write("<img src='" + this.props.ticket.image + "'/>");
        popup.focus(); //required for IE
        popup.print()
        popup.close();

        this.props.openGate(this.props.ticket);
    }


    render() {

        return (
            <OptionsPane title="Entering">
                <div className={cls(this)}>

                <div>
                    {!this.props.ticket && !this.props.lotFull &&
                        <Button onClick={this.createTicket} text="Create ticket"/>
                    }

                    <div className={cls(this, 'error')}>
                        {this.state.error && this.state.error}
                        {this.props.lotFull && 'Lot full'}
                    </div>

                    {this.props.ticket &&
                        <div>
                            <TicketComponent ticket={this.props.ticket}/>

                            <Button text="Print" onClick={this.printTicket}/>
                            <Button text="Download" onClick={this.downloadTicket}/>
                        </div>
                    }
                </div>

                </div>
            </OptionsPane>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EnterOptions)