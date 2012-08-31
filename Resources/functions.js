var dbg = function(msg) { Ti.API.debug(msg); };

function killChildren(thing) {
    if(thing.children) {
        for(var i=thing.children.length-1; i>=0; i--) {
            dbg('Removing ' + thing.children[i] + ' from ' + thing);
            thing.remove(thing.children[i]);
        }
    }
}

function getJSON(url, callback) {
    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {
        try {
            var json = JSON.parse(this.responseText);
            callback(json);
        } catch(err) {
            dbg(err);
        }
    };

    xhr.open('GET', url);
    xhr.send();
}

function showConfirm(options) {
    var a = Ti.UI.createAlertDialog({
        title: options.title,
        message: options.message
    });

    a.buttonNames = ['OK', 'Cancel'];
    a.cancel = 1;
    a.show();
}

function showAlert(options) {
   var alertDlg = Ti.UI.createAlertDialog({
            title:  options.title,
            message: options.message,
            buttonNames: ['OK']
        });
        alertDlg.show();
 
}

function alrt(message) {
    showAlert({title: 'Alert', message: message});
}

function networkAvailable() {
    return Ti.Network.networkTypeName != 'NONE';
}