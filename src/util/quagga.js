/*global
    exports
*/

import Quagga from 'quagga'

var callbacks = [];//To clear on stopScan

exports.stopScan = () => {
    callbacks.forEach((callback) => {
        Quagga.offDetected(callback);
    })
    callbacks.length = 0;
    Quagga.stop();
}

exports.scanImage = (src, callback=null) => {
    Quagga.decodeSingle({
        decoder: {
            readers: ['code_39_reader']
        },
        locate: true,
        src
    }, callback);
}

exports.startScanning = (onResult=null, onError=null) => {

    var callback = (data) => {
        onResult && onResult(data);

        if (callbacks.includes(callback)) {
            Quagga.offDetected(callback);
        }
    }

    Quagga.onDetected(callback);
    callbacks.push(callback);

    Quagga.init({
        inputStream : {
            name : "Live",
            type : "LiveStream",
            target: "#scan-video",
            constraints: {
                width: {min: 640},
                height: {min: 480},
                aspectRatio: {min: 1, max: 100},
                facingMode: "user" // or user
            }
        },
        decoder : {
            readers : [
                'code_39_reader'
            ]
        }
    }, function(err) {
        if (err) {
            onError && onError();
            return;
        }
        Quagga.start();
    });
}