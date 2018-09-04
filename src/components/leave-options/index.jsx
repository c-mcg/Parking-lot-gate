import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux'

import {openGate, removeTicket, setScannedTicket} from "../../redux/actions";

import OptionsPane from '../options-pane'
import Button from '../form/button'
import SVG from '../svg'

import TicketComponent from '../ticket'

import Form from '../form'
import TextField from '../form/text-field'
import CreditCardField from '../form/text-field/credit-card'
import NumberField from '../form/text-field/number'

import {cls} from "../../util"
import {stopScan, startScanning, scanImage} from '../../util/quagga'

import './index.less'

const mapDispatchToProps = (dispatch) => {
    return {
        openGate: (ticket) => {
            openGate(dispatch, ticket);
            removeTicket(dispatch, ticket);
            setScannedTicket(dispatch, null)
        },
        setScannedTicket: (ticket) => {setScannedTicket(dispatch, ticket)}
    };
};

const mapStateToProps = (state) => {
    return {
        ticket: state.scannedTicket,
        tickets: state.tickets
    };
};

class LeaveOptions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scanning: false,
            scanError: false,
            submittingPayment: false,
            paymentError: "",
        }

        this.onUploadClicked = this.onUploadClicked.bind(this);
        this.onUploadChanged = this.onUploadChanged.bind(this);
        this.onScanClicked = this.onScanClicked.bind(this);

        this.onBarcodeScanned = this.onBarcodeScanned.bind(this)

        this.onSubmitPayment = this.onSubmitPayment.bind(this);

        this.onScanDetected = this.onScanDetected.bind(this);
    }

    onUploadClicked() {
        this.cancelScan(() => {
            //Check here is for tests
            this.refs.upload && this.refs.upload.click();  
        })
    }

    onBarcodeScanned(result) {
        if(result.codeResult) {

            var id = result.codeResult.code;

            var ticket = this.props.tickets[id];

            if (!ticket) {
                this.setState({
                    scanError: true,
                    scanning: false
                })
                return;
            }

            this.setState({
                scanning: false,
                scanError: false
            }, () => {
                this.props.setScannedTicket(ticket);
            })

        } else {
            console.log("not detected");
        }
    }

    onScanDetected(data) {
        if (data.codeResult) {
            this.onBarcodeScanned(data);
        }

        this.cancelScan();
    }

    cancelScan(callback=null, scanning=false) {
        
        if (this.state.scanning) {
            stopScan();
        }

        var scanError = scanning ? this.state.scanError : false;

        this.setState({
            scanning,
            scanError
        }, callback)
    }

    onScanClicked() {
        this.cancelScan(() => {
            if (!this.state.scanning) {
                return;
            }
            startScanning(this.onBarcodeScanned, () => {
                this.cancelScan();
            });
        }, !this.state.scanning);
    }

    onUploadChanged(e) {
        var _this = this;
        var files = e.target.files;

        if (FileReader && files && files.length !== 0) {
            var reader = new FileReader();
            reader.onload = function () {
                scanImage(reader.result, _this.onBarcodeScanned)
            };
            reader.readAsDataURL(files[0]);
        }
    }

    onSubmitPayment(values) {

        if (values.name.length === 0) {
            this.setState({
                paymentError: "You must enter a name"
            })
            return;
        }

        if (values.cardNumber.length < 16) {
            this.setState({
                paymentError: "Invalid card number"
            })
            return;
        }

        if (values.securityCode.length !== 3) {
            this.setState({
                paymentError: "Invalid security code"
            })
            return;
        }

        this.setState({
            submittingPayment: true
        })

        setTimeout(() => {
            this.setState({
                submittingPayment: false,
                paymentError: false,
                scanning: false,
                scanError: false
            }, () => {
                this.props.openGate(this.props.ticket)
            })
        }, 2000);

    }

    render() {
        return (

            <OptionsPane title="Leaving">
                <div className={cls(this)}>

                    {!this.props.ticket &&
                        <div>
                            <Button text="Upload ticket" onClick={this.onUploadClicked}/>
                            <Button text={this.state.scanning ? "Cancel Scan" : "Scan ticket"} onClick={this.onScanClicked}/>
                        </div>
                    }

                    <video id="scan-video" className={cls(this, 'video')}/>

                    {this.state.scanning &&
                        <SVG className={cls(this, 'loading')} name='loading'/>
                    }

                    {this.state.scanError &&
                        <div className={cls(this, 'error')}>
                            Invalid ticket
                        </div>
                    }

                    {this.props.ticket &&

                        <Form onSubmit={this.onSubmitPayment}>
                            <TicketComponent ticket={this.props.ticket}/>

                            <div className={cls(this, 'rate')}>
                                ${this.props.ticket.rate.toFixed(2)}
                            </div>

                            <TextField autoFocus label="Name (as it appears on card)" name="name"/>
                            <CreditCardField label="Card Number" name="cardNumber"/>
                            <NumberField label="Security Code" maxLength={3} name="securityCode"/>

                            {this.state.paymentError !== "" &&
                                <div className={cls(this, 'error')}>
                                    {this.state.paymentError}
                                </div>
                            }

                            {this.state.submittingPayment ?
                                <SVG className={cls(this, 'loading')} name='loading'/>
                            :
                                <Button submit text="Pay ticket"/>   
                            }
                        </Form>
                    }



                    <input ref="upload" type='file' accept="image/*" className={cls(this, 'upload')} onChange={this.onUploadChanged}/>
                </div>
            </OptionsPane>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LeaveOptions)