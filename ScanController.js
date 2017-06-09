var regions = [
    //kontakt Beacon factory UUID.
    { uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e' }
    // Sample UUIDs for beacons in our lab.

    // Dialog Semiconductor.
];
//var keybeacon :"f7826da6-4fa2-4e98-8024-bc5b71e0893e:22792:14618";
// "minor":"14618","major":"22792"

// Background detection.
var notificationID = 0;
var inBackground = false;
var date = new Date();
document.addEventListener('pause', function() { inBackground = true });
document.addEventListener('resume', function() { inBackground = false });

// Dictionary of beacons.
var beacons = {};

// Timer that displays list of beacons.
var updateTimer = null;
var notification = false;
var guestout = true;
var message = "";
var username = "";
var notif = false;
// Specify a shortcut for the location manager holding the iBeacon functions.
window.locationManager = cordova.plugins.locationManager;

// Start tracking beacons!
startScan();

// Display refresh timer.
updateTimer = setInterval(displayBeaconList, 500);