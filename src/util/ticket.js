
import uniqid from 'uniqid'
import JsBarcode from 'jsbarcode'

import {formatDate, formatTime} from './index'

import {ONE_HOUR_IN_MS} from './constants'

const RATE_TIME_LENGTHS = [
    ONE_HOUR_IN_MS,
    ONE_HOUR_IN_MS * 3,
    ONE_HOUR_IN_MS * 6
]
const STARTING_RATE = 3.00;

//Don't need to hide because of absolute app
function createImage(width, height, createFunc) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');

    createFunc(ctx);

    return canvas.toDataURL();
}

//Don't need to hide because of absoltute app
function generateBarcode() {
    var id = uniqid();

    var body = document.body || document.querySelector('body');
    var img = document.createElement('img');

    img.id = 'temp-barcode-img-' + id;
    body.appendChild(img);

    var error = true;
    try {
        JsBarcode('#' + img.id, id, {
            format: "CODE39",
            valid: () => {
                error = false;
            }
        });
    } catch (e) {
        error = true;
    }

    if (error) {
        return false;
    }

    body.removeChild(img);

    return new Barcode(id, img.src);
}

class Barcode {

    constructor(id, image) {
        this._id = id.toUpperCase();
        this._image = image;
    }

    get id() {
        return this._id;
    }

    get image() {
        return this._image;
    }

}


export default class Ticket {

    constructor() {
        this._barcode = null;

        this._ticketImg = null;

        this._startTime = new Date();
        this._endTime = null;

        this._rate = 0;
    }

    get id() {
        return this.barcode.id;
    }

    get barcode() {
        return this._barcode;
    }

    get image() {
        return this._ticketImg;
    }

    get startTime() {
        return this._startTime;
    }

    get endTime() {
        return this._endTime;
    }

    get rate() {
        
        if (this._rate) {
            return this._rate;
        }

        if (!this.endTime) {
            this._endTime = new Date();
        }

        var visitLength = (this.endTime.getTime() - this.startTime.getTime()) + ONE_HOUR_IN_MS * 4;

        var rateIndex = 0;
        var rate = STARTING_RATE;

        while (visitLength > RATE_TIME_LENGTHS[rateIndex]) {
            rate *= 1.5;
            rateIndex++;
        }

        this._rate = rate;
        return rate;
    }

    generateImage(onSuccess, onError) {
        var barcode = generateBarcode();
        if (!barcode) {
            onError && onError();
            return;
        }

        this._barcode = barcode; 

        var barcodeImg = new Image();
        barcodeImg.addEventListener('load', (() => {

            const width = 600;
            const height = 200;

            const fontSize = 32;
            const lineHeight = 48;

            var ticketImg = createImage(width, height, (ctx) =>  {

                ctx.fillStyle = "#FFFFFF";

                ctx.fillRect(0, 0, width, height);

                ctx.fillStyle = "#000000"
                ctx.font = fontSize + "px Palanquin Dark"

                var x = height / 2 - (lineHeight / 2);
                ctx.fillText(formatDate(this.startTime), 50, x);

                x += lineHeight
                ctx.fillText(formatTime(this.startTime), 50, x);

                ctx.drawImage(barcodeImg, width - barcodeImg.width - 32, height / 2 - barcodeImg.height / 2);

            })

            this._ticketImg = ticketImg;
            onSuccess && onSuccess();
        }).bind(this))
        barcodeImg.addEventListener('error', () => {
            onError && onError();
        })
        barcodeImg.src = barcode.image;

    }

}


