ionic start IonicBeacon blank
cd IonicBeacon
ionic platform add ios
ionic platform add android


ionic start IonicBeacon blank
cd IonicBeacon
ionic platform add ios
ionic platform add android


    <
    script src = "js/ng-cordova-beacon.min.js" > < /script>


$cordovaBeacon.createBeaconRegion("estimote", "b9407f30-f5f8-466e-aff9-25556b57fe6d")


angular.module('starter', ['ionic', 'ngCordovaBeacon'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.controller("ExampleController", function($scope, $rootScope, $ionicPlatform, $cordovaBeacon) {

    $scope.beacons = {};

    $ionicPlatform.ready(function() {

        $cordovaBeacon.requestWhenInUseAuthorization();

        $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
            var uniqueBeaconKey;
            for (var i = 0; i < pluginResult.beacons.length; i++) {
                uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
            }
            $scope.$apply();
        });

        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "b9407f30-f5f8-466e-aff9-25556b57fe6d"));

    });
});





<
ion - content ng - controller = "ExampleController" >
    <
    div class = "list" >
    <
    div class = "item"
ng - repeat = "(key, value) in beacons" >
    <
    div class = "row" >
    <
    div class = "col truncate" > {
        { value.uuid } } <
    /div> <
    /div> <
    div class = "row" >
    <
    div class = "col" >
    major: {
        { value.major } } <
    /div> <
    div class = "col" >
    minor: {
        { value.minor } } <
    /div> <
    /div> <
    div class = "row" >
    <
    div class = "col" > {
        { value.proximity } } <
    /div> <
    /div> <
    /div> <
    /div> <
    /ion-content>