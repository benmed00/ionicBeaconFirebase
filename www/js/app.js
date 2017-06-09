// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'starter.configs', 'ngCordovaBeacon'])

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

.controller('introController', ['$scope', 'CONFIG', '$rootScope', '$ionicPlatform', '$cordovaBeacon', function($scope, $firebaseObject, CONFIG, $rootScope, $ionicPlatform, $cordovaBeacon) {
    // TODO: Show profile data

    // Specify a shortcut for the location manager holding the iBeacon functions.
    window.locationManager = cordova.plugins.locationManager;

    // Start tracking beacons!
    startScan();

    // Display refresh timer.
    updateTimer = setInterval(displayBeaconList, 500);


}])

.factory('startScan', [function($scope, $firebaseObject, CONFIG, $rootScope, $ionicPlatform, $cordovaBeacon) {
    var delegate = new locationManager.Delegate();

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

    function sendata() {

        var ref = new firebase("regions/")

        $scope.series = $firebaseArray(ref);


        console.log("id firebase generated : " + ids);
    }
}])


service('serviceNotification', [function($document) {

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