if (Meteor.isClient) {

  var MAP_ZOOM = 15;

  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.body.helpers({
    geolocationError: function() {
      var error = Geolocation.error();
      return error && error.message;
    },

    exampleMapOptions: function() {
      var latLng = Geolocation.latLng();
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded() && latLng) {
        // Map initialization options
        return {
          center: new google.maps.LatLng(latLng.lat, latLng.lng),
          zoom: MAP_ZOOM
        };
      }
    }
  });

  Template.body.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {
      var latLng = Geolocation.latLng();
      console.log(latLng.lat);
      console.log(latLng.lng);
      // Add a marker to the map once it's ready
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latLng.lat, latLng.lng),
        map: map.instance,
        title: "Your Location"
      });
    });
  });

//  Template.body.events({
//    'click': function(){
//     var marker = new google.mapsMarker({
//        position:(-51,0),
//        map: map.instance,
//        title: "Chosen Location"
//      });
//      console.log('You just clicked')
//    }
//  });

  angular.module('uberShare-app', ['angular-meteor', 'ui.router']);

  angular.module("uberShare-app").config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/");

      $stateProvider
          .state('userLogin', {
              url: "/",
              template: UiRouter.template('userLogin.html')
          })
          .state('userSignUp', {
              url: "/",
              template: UiRouter.template('userSignUp.html')
          })
          .state('landingPage', {
            url: "/",
            template: UiRouter.template('uberShare_frontEnd.html')
          })
          .state('profile', {
            url: "/",
            template: UiRouter.template('userProfile.html')
          })
      }
  ]);

  angular.module('uberShare-app').controller('UserAccess', function($http, $state){
    var self = this;

    self.userSignUp = function(email, password, passwordconf) {
    var postData = { 'email': email, 'password': password, 'password_confirmation': passwordconf};
      $http.post('https://stormy-falls-9947.herokuapp.com/users', postData, 'POST').then(function() {
        $state.go('profile');
      });
    };

    self.userLogin = function(email, password) {
      var postData = { 'email':email, 'password': password};
      $http.post('https://stormy-falls-9947.herokuapp.com/sessions', postData, 'POST').then(function() {
        $state.go('profile');
      });
    }

  });

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
