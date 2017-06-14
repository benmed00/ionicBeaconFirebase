// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ngCordova', 'ionic', 'firebase', 'starter.configs', 'ngCordovaBeacon'])

.run(['$ionicPlatform', 'CONFIG', function($ionicPlatform, CONFIG) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);


        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        firebase.initializeApp({
            apiKey: CONFIG.FIREBASE_API,
            authDomain: CONFIG.FIREBASE_AUTH_DOMAIN,
            databaseURL: CONFIG.FIREBASE_DB_URL,
            storageBucket: CONFIG.FIREBASE_STORAGE,
            messagingSenderId: CONFIG.FIREBASE_STORAGE
        });


    });
}])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.navBar.alignTitle('center');

    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'appController'
    })

    .state('login', {
        url: '/login',
        templateUrl: "templates/login.html",
        controller: "loginController"
    })

    .state('signup', {
        url: '/signup',
        templateUrl: "templates/signup.html",
        controller: "signupController"
    })

    .state('reset', {
        url: '/reset',
        templateUrl: "templates/resetemail.html",
        controller: "resetController"
    })

    .state('app.intro', {
        url: '/intro',
        views: {
            'menuContent': {
                templateUrl: "templates/intro.html",
                controller: "introController"
            }
        }
    })

    .state('app.dashboard', {
        url: '/app/dashboard',
        views: {
            'menuContent': {
                templateUrl: "templates/dashboard.html",
                controller: "dashboardController"
            }
        }
    })

    $urlRouterProvider.otherwise('/login');

}])

.controller('loginController', ['$scope', '$firebaseArray', 'CONFIG', '$document', '$state', function($scope, $firebaseArray, CONFIG, $document, $state) {



    // Perform the login action when the user submits the login form
    $scope.doLogin = function(userLogin) {

        console.log(userLogin);

        var password = "123123123";
        //&& $document[0].getElementById("user_pass").value != ""
        if ($document[0].getElementById("user_name").value != "") {


            firebase.auth().signInWithEmailAndPassword(userLogin.username, password).then(function() {
                // Sign-In successful.
                //console.log("Login successful");




                var user = firebase.auth().currentUser;

                var name, email, photoUrl, uid;

                if (user.emailVerified) { //check for verification email confirmed by user from the inbox

                    console.log("email verified");
                    $state.go("app.dashboard");

                    name = user.displayName;
                    email = user.email;
                    photoUrl = user.photoURL;
                    uid = user.uid;

                    console.log(name + "<>" + email + "<>" + photoUrl + "<>" + uid);

                    localStorage.setItem("photo", photoUrl);

                } else {

                    alert("Email not verified, please check your inbox or spam messages")
                    return false;

                } // end check verification email


            }, function(error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                if (errorCode === 'auth/invalid-email') {
                    alert('Enter a valid email.');
                    return false;
                } else if (errorCode === 'auth/wrong-password') {
                    alert('Incorrect password.');
                    return false;
                } else if (errorCode === 'auth/argument-error') {
                    alert('Password must be string.');
                    return false;
                } else if (errorCode === 'auth/user-not-found') {
                    alert('No such user found.');
                    return false;
                } else if (errorCode === 'auth/too-many-requests') {
                    alert('Too many failed login attempts, please try after sometime.');
                    return false;
                } else if (errorCode === 'auth/network-request-failed') {
                    alert('Request timed out, please try again.');
                    return false;
                } else {
                    alert(errorMessage);
                    return false;
                }
            });



        } else {

            alert('Please enter email and password');
            return false;

        } //end check client username password


    }; // end $scope.doLogin()

}])

.controller('appController', ['$scope', '$firebaseArray', 'CONFIG', '$document', '$state', function($scope, $firebaseArray, CONFIG, $document, $state) {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            $document[0].getElementById("photo_user").src = localStorage.getItem("photo");


        } else {
            // No user is signed in.
            $state.go("login");
        }
    });


    $scope.doLogout = function() {

            firebase.auth().signOut().then(function() {
                // Sign-out successful.
                //console.log("Logout successful");
                $state.go("login");

            }, function(error) {
                // An error happened.
                console.log(error);
            });

        } // end dologout()



}])

.controller('resetController', ['$scope', '$state', '$document', '$firebaseArray', 'CONFIG', function($scope, $state, $document, $firebaseArray, CONFIG) {

    $scope.doResetemail = function(userReset) {



        //console.log(userReset);

        if ($document[0].getElementById("ruser_name").value != "") {


            firebase.auth().sendPasswordResetEmail(userReset.rusername).then(function() {
                // Sign-In successful.
                //console.log("Reset email sent successful");

                $state.go("login");


            }, function(error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);


                if (errorCode === 'auth/user-not-found') {
                    alert('No user found with provided email.');
                    return false;
                } else if (errorCode === 'auth/invalid-email') {
                    alert('Email you entered is not complete or invalid.');
                    return false;
                }

            });



        } else {

            alert('Please enter registered email to send reset link');
            return false;

        } //end check client username password


    }; // end $scope.doSignup()



}])



.controller('signupController', ['$scope', '$state', '$document', '$firebaseArray', 'CONFIG', function($scope, $state, $document, $firebaseArray, CONFIG) {

    $scope.doSignup = function(userSignup) {



        //console.log(userSignup);

        if ($document[0].getElementById("cuser_name").value != "" && $document[0].getElementById("cuser_pass").value != "") {


            firebase.auth().createUserWithEmailAndPassword(userSignup.cusername, userSignup.cpassword).then(function() {
                // Sign-In successful.
                //console.log("Signup successful");

                var user = firebase.auth().currentUser;

                user.sendEmailVerification().then(function(result) { console.log(result) }, function(error) { console.log(error) });

                user.updateProfile({
                    displayName: userSignup.displayname,
                    photoURL: userSignup.photoprofile
                }).then(function() {
                    // Update successful.
                    $state.go("login");
                }, function(error) {
                    // An error happened.
                    console.log(error);
                });




            }, function(error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);

                if (errorCode === 'auth/weak-password') {
                    alert('Password is weak, choose a strong password.');
                    return false;
                } else if (errorCode === 'auth/email-already-in-use') {
                    alert('Email you entered is already in use.');
                    return false;
                }




            });



        } else {

            alert('Please enter email and password');
            return false;

        } //end check client username password


    }; // end $scope.doSignup()



}])


.controller('dashboardController', ['$scope', 'CONFIG', function($scope, $firebaseObject, CONFIG) {
    // TODO: Show profile data


}])

.controller('introController', ['$scope', '$ionicPlatform', '$cordovaBeacon', '$rootScope', 'CONFIG', function($scope, $ionicPlatform, $cordovaBeacon, $rootScope, CONFIG, ionicPlatform, cordovaBeacon, ngCordova) {

    var logToDom = function(message) {
        var e = document.createElement('label');
        e.innerText = message;

        var br = document.createElement('br');
        var br2 = document.createElement('br');
        document.body.appendChild(e);
        document.body.appendChild(br);
        document.body.appendChild(br2);

        window.scrollTo(0, window.document.height);
    };

    var delegate = new cordova.plugins.locationManager.Delegate();

    delegate.didDetermineStateForRegion = function(pluginResult) {

        logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

        cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: ' +
            JSON.stringify(pluginResult));
    };

    delegate.didStartMonitoringForRegion = function(pluginResult) {
        console.log('didStartMonitoringForRegion:', pluginResult);

        logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
    };

    delegate.didRangeBeaconsInRegion = function(pluginResult) {


        console.log('didRangeBeaconsInRegion:', pluginResult);
        //alert(JSON.stringify(pluginResult));
        $scope.rssi = JSON.stringify(pluginResult.beacons[0].rssi);

        if (JSON.stringify(pluginResult.beacons[0].rssi) > -100) {
            cordova.plugins.notification.local.schedule({
                id: 1,
                title: 'Vous Etes dans la cuisine',
                text: 'tournez à droite pour aller au sallon'
            });

            //update the value
            var db = firebase.database();
            db.ref("Regions/region1/nbr").set("news-value");

            // on recupaire la valuer enterieure
            function recupaire() {
                const ref = firebase.database().ref('Regions/region1/nbr');
                ref.on("value", function(snapshot) {
                    $scope.nbrinit = snapshot.val();
                    console.log($scope.nbr);
                })
            }

            //on incremante par un
            function incremente(params) {
                const refregion1 = firebase.database().ref('Regions/region1/');
                $scope.region1 = $firebaseArray(refregion1);
                $scope.region1.$add({
                    nbr: $scope.nbrinit + 1
                });

            }



        }
        if (JSON.stringify(pluginResult.beacons[0].rssi) < -100) {
            cordova.plugins.notification.local.schedule({
                id: 1,
                title: 'Scan en cours ',
                text: 'vous etes HORS Zone'
            });
        }


        logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
    };

    //var keybeacon :"f7826da6-4fa2-4e98-8024-bc5b71e0893e:22792:14618";
    // "minor":"14618","major":"22792"

    var uuid = 'f7826da6-4fa2-4e98-8024-bc5b71e0893e';
    var identifier = 'Cuisine';
    var minor = 14618;
    var major = 22792;
    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

    cordova.plugins.locationManager.setDelegate(delegate);

    // required in iOS 8+
    cordova.plugins.locationManager.requestWhenInUseAuthorization();
    // or cordova.plugins.locationManager.requestAlwaysAuthorization()

    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
        .fail(function(e) { console.error(e); })
        .done();

}])

.factory('scanIbeacon', [function($scope, $rootScope, $ionicPlatform, $cordovaBeacon) {
    $scope.beacons = {};

    $ionicPlatform.ready(function() {

        $cordovaBeacon.requestWhenInUseAuthorization();

        $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
            var uniqueBeaconKey;
            for (var i = 0; i < pluginResult.beacons.length; i++) {
                uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];


                if (pluginResult.beacons[i].rssi < -90) {

                    if (pluginResult.beacons[i].major == 1600) {
                        var ref = firebase.database().ref("regions/regon1");
                        // get nbr--> region1 and increment it by 1
                        // regions
                        //      |-> region1
                        //              |-> nbr
                    }

                    if (pluginResult.beacons[i].major == 1400) {
                        var ref = firebase.database().ref("regions/regon2");
                        // get nbr--> region2 and increment it by 1
                    }
                }



            }
            $scope.$apply();
        });

        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("kontakt", "f7826da6-4fa2-4e98-8024-bc5b71e0893e"));

    });
}])

.factory('startScan', [function($scope, $firebaseObject, CONFIG, $rootScope, $ionicPlatform, $cordovaBeacon) {

    // Specify your beacon 128bit UUIDs here.
    var regions = [
        // Estimote Beacon factory UUID.
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
    var sendMessage = false;
    var message = "";
    var username = "";

    var delegate = new cordova.plugins.locationManager.Delegate();

    delegate.didEnterRegion = function(pluginResult) {
        getnotification("the user didEntereRegion");
        console.log('didEnterRegion  TRUE : ' + JSON.stringify(pluginResult));
    };

    delegate.didExitRegion = function(pluginResult) {
        getnotification("the user didExitRegio");
        console.log('didExitRegion  TRUE : ' + JSON.stringify(pluginResult));
    };

    // Called continuously when ranging beacons.
    delegate.didRangeBeaconsInRegion = function(pluginResult) {
        console.log('didRangeBeaconsInRegion: beacon minor : ' + JSON.stringify(pluginResult.beacons[0].minor) + " beacon RSSI : " + JSON.stringify(pluginResult.beacons[0].rssi) + " Proximity : " + JSON.stringify(pluginResult.beacons[0].proximity));
        // if (JSON.stringify(pluginResult.beacons[0].rssi) > -80 )
        // 	{
        // 		console.log("notification id : " + notificationID + " added, fired at " + date.toTimeString() );
        // 		console.log("notification 1 added ");
        // 		//notification = true ;
        //getnotification('Beacon detected, tap here to open');
        // 		cordova.plugins.notification.local.schedule(
        // 			{
        // 				//date: Date.now(),
        // 				id: 1,
        // 				title: date.toTimeString() + ' Beacon in range 1 ',
        // 				text: 'iBeacon Scan detected a beacon, tap here to open app.'
        // 			});
        // 		cordova.plugins.notification.local.on("click", function (notification) {
        // 				document.getElementById("found-beacons").style.display = 'none';
        // 				document.getElementById("vue").style.display = 'block';
        // 		});
        // 	}


        //   //if (pluginResult.beacons[0].proximity == "ProximityImmediate")
        //setInterval
        var timeoutID;

        if (JSON.stringify(pluginResult.beacons[0].rssi) > -75) {
            if (notif == false) {

                sendata("Nabil", "Guest-IN");
                console.log("\n the guest is entring ! \n");
                getnotification("Bien venue MR. -Nabil-");
                notif = true;
            }
            if (typeof timeoutID !== "undefined") {
                clearTimeout(timeoutID);
            }

            console.log("\n the guest is IN \n");
            guestout = false;
        }

        if (JSON.stringify(pluginResult.beacons[0].rssi) < -97) {
            if (guestout == false) {
                if (typeof timeoutID !== "undefined") {
                    clearTimeout(timeoutID);
                }
                timeoutID = window.setTimeout(function() {
                    sendata("Nabil", "Guest-OUT");
                    console.log("\n the guest is exiting ! \n");
                    getnotification("au revoir Mr. -Nabil- à bientot");
                }, 30000);
            }
            console.log("\n the Guest is OUT \n");
            guestout = true;
        }


        for (var i in pluginResult.beacons) {
            // Insert beacon into table of found beacons.
            var beacon = pluginResult.beacons[i];
            beacon.timeStamp = Date.now();
            var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
            beacons[key] = beacon;
        }

    };

    // Called when starting to monitor a region.
    // (Not used in this example, included as a reference.)

    delegate.didStartMonitoringForRegion = function(pluginResult) {

        console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
    };

    // Called when monitoring and the state of a region changes.
    // If we are in the background, a notification is shown.
    delegate.didDetermineStateForRegion = function(pluginResult) {
        console.log('pluginResult.state : ' + JSON.stringify(pluginResult.state));
        console.log('didDetermineStateForRegion : ' + JSON.stringify(pluginResult));
        console.log('is the app in the background : ' + inBackground + '\n');
        if (inBackground) {
            // Show notification if a beacon is inside the region.
            // TODO: Add check for specific beacon(s) in your app.
            if (pluginResult.region.typeName == 'BeaconRegion' &&
                pluginResult.state == 'CLRegionStateInside') {
                console.log("notification " + notificationID + " added, fired at " + date.toTimeString());
                console.log("notification added");
                cordova.plugins.notification.local.schedule({
                    id: ++notificationID,
                    title: 'Background Notification',
                    text: 'We are still scanning'
                });
            }
        }
    };

    // Set the delegate object to use.
    locationManager.setDelegate(delegate);

    // Request permission from user to access location info.
    // This is needed on iOS 8.
    locationManager.requestAlwaysAuthorization();

    // Start monitoring and ranging beacons.
    for (var i in regions) {
        var beaconRegion = new locationManager.BeaconRegion(
            i + 1,
            regions[i].uuid);

        // Start ranging.
        locationManager.startRangingBeaconsInRegion(beaconRegion)
            .fail(console.error)
            .done();

        // Start monitoring.
        // (Not used in this example, included as a reference.)
        locationManager.startMonitoringForRegion(beaconRegion)
            .fail(console.error)
            .done();
    }

    if (device.rssi > -95) {
        console.log("notification added");
        cordova.plugins.notification.local.schedule({
            id: ++notificationID,
            title: 'Beacon in range 3',
            text: 'iBeacon Scan detected a beacon, tap here to open app.'
        });
    }
}])

.service('sentofirebase', [function($firebaseArray) {

    function sendata(region) {
        var newnbr = previeusNbr + 1
        var ref = new firebase.database().ref("regions/" + region);
        $scope.series = $firebaseArray(ref);
        $scope.series.$add({
            nbr: newNbr
        })

        console.log("id firebase generated : " + ids);
    }

    function getData() {


    }

    function sendataref(region) {
        var ids = firebase.database().ref().child('messages').push().key;
        firebase.database().ref('messages/' + ids).set({

            username: user.displayName,
            date: date.toTimeString(),
            message: message
        });
    }

    console.log("id firebase generer" + ids);
}])

.service('serviceNotification', [function($document) {

    function getnotification(mes) {
        cordova.plugins.notification.local.schedule({
            id: 1,
            title: date.toTimeString(),
            text: mes
        });

        cordova.plugins.notification.local.on("click", function(notification) {
            $document.getElementById("found-beacons").style.display = 'none';
            $document.getElementById("vue").style.display = 'block';
        });
    }
}]);