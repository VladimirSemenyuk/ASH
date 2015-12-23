var page = require('webpage').create(),
    fs = require('fs-extra'),
    system = require('system'),
    addresses, output, size;

addresses = system.args[1].split(',');

page.paperSize = {
    format: 'A4',
    orientation: 'portrait',
    margin: {
        top: '1.9cm'
    }
};

function proc(address) {
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit(1);
        } else {
            window.setTimeout(function () {
                var arr = address.split('/');

                page.render('print/' + (arr[arr.length-1]).replace('.html', '.pdf'));

                if (addresses.length) {
                    proc(addresses.pop());
                } else {
                    phantom.exit();
                }
            }, 200);
        }
    });
}

proc(addresses.pop());



