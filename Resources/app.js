/*
 * Ionic Educational Scanner App
 * Copyright under GPL v2 License Terms
 * 2013 Hiram J. Perez <worg@linxumail.org>, Jose Antonio Garcia <jgarcia@upmh.edu.mx>
 * Barcodes are in EAN13 standard
 */

(function() {
var scanWin = Titanium.UI.createWindow();

var infoWin = Ti.UI.createWindow({
	title: 'Cationes',
	backgroundColor: '#2D2D2D',
	exitOnClose: false
});

// load the Scandit SDK module
var scanditsdk = require("com.mirasense.scanditsdk"); 

// disable the status bar for the camera view on the iphone and ipad
if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
     Titanium.UI.iPhone.statusBarHidden = true;
}

var webView = Ti.UI.createWebView({
    url:'/html/viewer.html'
});

/***DEBUG***/
//var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'html','sl', 'Zaratustra1.pdf');


// instantiate the Scandit SDK Barcode Picker view
var picker = scanditsdk.createView({
    "width":Ti.Platform.displayCaps.platformWidth,
    "height":Ti.Platform.displayCaps.platformHeight
}); 

infoWin.add(webView);

// Initialize the barcode picker,
picker.init("fjCZtnAvEeKbwJ7Tz2wvUhE6BiI1y5ePzTGJhIf1R8U", 0);
//seteaomoss los mensajes 
picker.setTextForInitialScanScreenState("Alínea el código con el rectángulo");
picker.setTextForBarcodeDecodingInProgress('Escaneando…');

// Set callback functions for when scanning succeeds and for when the
// scanning is canceled.
//var file, blob, buff, stream;
picker.setSuccessCallback(function(e) {
    var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'html', 'sl', e.barcode + '.pdf'); // a partir del codigo obtenemos el archivo
    if(file.exists()){
            var blob = file.read();
            var b64 = Ti.Utils.base64encode(blob);
            infoWin.open({modal:true, loading: true});
            setTimeout(function(e){
                Ti.App.fireEvent('renderPDF', { pdf: b64.text});
            },6000); // lanzamos el renderer del pdf en el navegador            
    }else{
        alert('Código erroneo, intente de nuevo');
        setTimeout(function(e){
        	picker.reset();
        }, 2000);
    }
});

picker.setCancelCallback(function(e) { alert("Cancelado");}); 
// add a tool bar at the bottom of the scan view with a cancel button
// (iphone/ipad only)
picker.showToolBar(true);

 
// Create a window to add the picker to and display it.
scanWin.add(picker);
picker.startScanning();
scanWin.open();
})();

