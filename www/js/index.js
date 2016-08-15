/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var id, current, options;
var loc1;
var locations = [];
var distances;
var closest;
var grantedNotifications;
var notificationID = 0;
var message1ID = 0;

var app = {
    // Application Constructor
    initialize: function() {

        current = {
          latitude : 0,
          longitude: 0
        };

        // TODO: make timeout every 30 secs or maybe 60 
        options = {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0
        };

        // 2311 Plantation Bend
        loc1 = {
            latitude : 29.592556, 
            longitude : -95.587422
        };

        // add TEST locations
/*        locations.push({latitude: 29.592556, longitude: -95.587422, distance: 0, name: 'Maw-Maws House', address: '2311 Plantation Bend Sugar Land, TX 77478'}); // 2311 Plantation Bend
        locations.push({latitude: 29.591892, longitude: -95.670748, distance: 0, name: 'Home', address: '60 Schubach Dr. Sugar Land, TX 77479'}); // unk
        locations.push({latitude: 29.589000, longitude: -95.675864, distance: 0, name: 'Randalls Grocery Store New Territory', address: '5800 New Territory Blvd, Sugar Land, TX 77479'}); // unk
        locations.push({latitude: 29.591967, longitude: -95.624482, distance: 0, name: 'First Colony Mall', address: '16535 Southwest Fwy Suite 1, Sugar Land, TX 77479'}); // unk
        locations.push({latitude: 29.591840, longitude: -95.665426, distance: 0, name: 'The Club At New Territory - Recreation Centers', address: '1200 Walker School Rd Sugar Land, TX 77479'}); // 
        locations.push({latitude: 29.619679, longitude: -95.634946, distance: 0, name: 'Walker Station Elementary', address: '6200 Homeward Way Blvd. Sugar Land, TX 77479'}); // 
*/        
        // add locations
        // List of Polling Locations for December 12, 2015 Runoff Election
        locations.push({latitude: 29.592444, longitude: -95.492773, distance: 0, name: 'Briarchase Missionary Baptist Church', address: '16000 Blue Ridge Rd Missouri City 77489'}); // 
        locations.push({latitude: 29.608330, longitude: -95.500721, distance: 0, name: 'Chasewood Clubhouse', address: '7622 Chasewood Dr Missouri City 77489'}); // 
        locations.push({latitude: 29.580871, longitude: -95.518973, distance: 0, name: 'Missouri City Baptist Church', address: '16816 Quail Park Dr Missouri City 77489'}); // 
        locations.push({latitude: 29.586727, longitude: -95.499974, distance: 0, name: 'Pinnacle Senior Center', address: '5525 Hobby Rd #C 77489'}); // 
        locations.push({latitude: 29.595971, longitude: -95.474198, distance: 0, name: 'Ridgegate Community Association', address: '5855 W. Ridgecreek Dr 77053'}); // 
        locations.push({latitude: 29.590484, longitude: -95.461537, distance: 0, name: 'Ridgemont Early Childhood Center', address: '5353 Ridge Creek Circle 77053'}); // 
        locations.push({latitude: 29.662758, longitude: -95.609273, distance: 0, name: 'Southwest Calvary Bapt Church', address: '12910 West Belfort Dr 77099'}); // 

        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('diff1').addEventListener("click", nav);
        document.getElementById('diff2').addEventListener("click", nav);
        document.getElementById('diff3').addEventListener("click", nav);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        document.getElementById('banner').addEventListener("click", openURL);

        cordova.plugins.notification.local.hasPermission(function (granted) {
            console.log('Permission has been granted: ' + granted);
            grantedNotifications = granted;

            if(granted==true) {
                scheduleEvents();
            }
            else {
                cordova.plugins.notification.local.registerPermission(function (granted) {
                    console.log('Asked for Permission: ' + granted);
                    grantedNotifications = granted;
                    if(granted==true) {
                        scheduleEvents();
                    }
                });
            }
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        id = navigator.geolocation.watchPosition(this.success, this.error, options);

        // click on notification
        cordova.plugins.notification.local.on("click", function(notification) {
            console.log("clicked: " + notification.id);
        });

        // scheduled
        cordova.plugins.notification.local.on("schedule", function(notification) {
            console.log("scheduled: " + notification.id);
        });

        cordova.plugins.notification.local.on("trigger", function(notification) {
            console.log("triggered: " + notification.id);
        });

        console.log('Received Event: ' + id);
    },
    success: function(pos) {
        var crd = pos.coords;

        console.log('lat: ' + crd.latitude);
        console.log('long: ' + crd.longitude);

        //var latElement = document.getElementById("lat");
        //var longElement = document.getElementById("long");

        document.getElementById('lat').value = crd.latitude;
        document.getElementById('long').value = crd.longitude;

        //var distance = haversine(crd.latitude, loc1.latitude, crd.longitude, loc1.longitude);
        //console.log('distance: ' + distance);

        //var distance2 = haversine(crd.latitude, locations[0].latitude, crd.longitude, locations[0].longitude);
        //console.log('distance2: ' + distance2);

        // TODO: use locations.length
        for(i=0; i < 6; ++i) {
            locations[i].distance = haversine(crd.latitude, locations[i].latitude, crd.longitude, locations[i].longitude);
            //console.log('distance: ' + locations[i].distance);
            //distances[i] = locations[i].distance;
        }

        // find the 3 closest in distance
        locations.sort(function(a, b){return a.distance-b.distance});

       for(i=0; i < 6; ++i) {
        //console.log('sorted distance: ' + i + ' : ' + locations[i].distance);
       }

        // TODO convert meters to miles for display - round to 2 decimals
        // meters / 1609.344 = miles
        //
        document.getElementById('diff1').innerHTML = locations[0].name;
        document.getElementById('diff1-display').innerHTML = locations[0].address;
        temp1 = locations[0].distance / 1609.344;
        //console.log('1- distance in miles: ' + temp1);
        temp1 = temp1.toFixed(2);
        //console.log('1- distance in miles rounded to 2 decimal places: ' + temp1);
        document.getElementById('diff1-dist').innerHTML = temp1 + " miles";

        document.getElementById('diff2').innerHTML = locations[1].name;
        document.getElementById('diff2-display').innerHTML = locations[1].address;
        temp2 = locations[1].distance / 1609.344;
        //console.log('2- distance in miles: ' + temp2);
        temp2 = temp2.toFixed(2);
        //console.log('2- distance in miles rounded to 2 decimal places: ' + temp2);
        document.getElementById('diff2-dist').innerHTML = temp2 + " miles";

        document.getElementById('diff3').innerHTML = locations[2].name;
        document.getElementById('diff3-display').innerHTML = locations[2].address;
        temp3 = locations[2].distance / 1609.344;
        //console.log('3- distance in miles: ' + temp3);
        temp3 = temp3.toFixed(2);
        //console.log('3- distance in miles rounded to 2 decimal places: ' + temp3);
        document.getElementById('diff3-dist').innerHTML = temp3 + " miles";

        document.getElementById('diff1').setAttribute('data-lat', locations[0].latitude);
        document.getElementById('diff1').setAttribute('data-long', locations[0].longitude);

        document.getElementById('diff2').setAttribute('data-lat', locations[1].latitude);
        document.getElementById('diff2').setAttribute('data-long', locations[1].longitude);

        document.getElementById('diff3').setAttribute('data-lat', locations[2].latitude);
        document.getElementById('diff3').setAttribute('data-long', locations[2].longitude);

        // if distance is within X distance then notify user
        if(locations[0].distance < 800) {
            if(grantedNotifications==true) {

                // send notification
                var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
                var date = new Date();

                if(notificationID == 0) {
                    notificationID = date.getTime();
                    console.log('sending notification: ' + notificationID);

                    cordova.plugins.notification.local.schedule({
                        id: notificationID,
                        title: "Voting Vacinity",
                        text: "You are near a voting location. Don't forget to vote!",
                        at: date
                    });
                }
            }
        }
        else {
            if(grantedNotifications==true) {
                if(notificationID != 0) {
                    console.log('clearing notification');
                    // remove/clear any notification
                    cordova.plugins.notification.local.cancel(notificationID, function () {
                        // Notification was cancelled
                    });
                    notificationID = 0;
                }
            }
        }
    
        cordova.plugins.notification.local.isScheduled(100, function (present) {
            console.log('Refer 100 isScheduled: ' + present);
            if(present == false) {
                scheduleEvents();
            }
        });
    },
    error: function(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }
};

app.initialize();

function haversine(lat1,lat2,lng1,lng2){
    rad = 6371000; // meters
    deltaLat = toRad(lat2-lat1);
    deltaLng = toRad(lng2-lng1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);
    a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) + Math.sin(deltaLng/2) * Math.sin(deltaLng/2) * Math.cos(lat1) * Math.cos(lat2); 
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return  rad * c;
}

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}

/*

Number.prototype.round = function(places) {
  return +(Math.round(this + "e+" + places)  + "e-" + places);
}

*/


function nav(event) {
    console.log('id: ' + event.target.id);
    var destination;
    //destination = [locations[0].latitude, locations[0].longitude];
    //destination = [loc1.latitude, loc1.longitude];

    var destination_lat = document.getElementById(event.target.id).getAttribute('data-lat');
    var destination_long = document.getElementById(event.target.id).getAttribute('data-long');

    //console.log('lat: ' + destination_lat);
    //console.log('long: ' + destination_long);

    destination = [destination_lat, destination_long];

    var lat = document.getElementById('lat').value;
    var longi = document.getElementById('long').value;

    //console.log('start lat: ' + lat);
    //console.log('start long: ' + longi);

    var start = [lat, longi];

    launchnavigator.navigate(
      destination,
      start,
      function(){
          console.log("Plugin success");
      },
      function(error){
          console.warn("Plugin error: "+ error);
      });
}

function handleExternalURLs() {
    // Handle click events for all external URLs
    if (device.platform.toUpperCase() === 'ANDROID') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            navigator.app.loadUrl(url, { openExternal: true });
            e.preventDefault();
        });
    }
    else if (device.platform.toUpperCase() === 'IOS') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            window.open(url, '_system');
            e.preventDefault();
        });
    }
    else {
        // Leave standard behaviour
    }
}


function openURL(e) {
    // Handle click events for all external URLs
    if (device.platform.toUpperCase() === 'ANDROID') {
        openURLAndroid(e);
    }
    else if (device.platform.toUpperCase() === 'IOS') {
        openURLiOS(e);
    }
    else {
        // Leave standard behaviour
    }
}

function openURLiOS(e) {
    var url = document.getElementById('banner').getAttribute('href');
    console.log('url: ' + url);
    window.open(url, '_system');
    e.preventDefault();
}

function openURLAndroid(e) {
    var url = document.getElementById('banner').getAttribute('href');
    console.log('url: ' + url);
    navigator.app.loadUrl(url, { openExternal: true });
    e.preventDefault();
}


function scheduleEvents() {
    //             Date(year, month, day, hours, minutes, seconds, milliseconds);
    // Date object - month is 0 based, so 0=jan, 1=feb, ... 11=dec
    //var date = new Date(2015, 11, 21, 14, 30, 0, 0);
    var now = new Date().getTime();
    var date = new Date(now + 120*1000);
    //var date = new Date();

    //message1ID = date.getTime();

    console.log('Scheduling Event: Refer: ' + date);

    cordova.plugins.notification.local.schedule({
        id: 100,
        title: "Refer",
        text: "Asking users to send it to everyone on their phone contact list",
        at: date
    });
}
