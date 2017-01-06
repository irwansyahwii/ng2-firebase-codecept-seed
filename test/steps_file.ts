// in this file you can append custom step methods to 'I' object
// declare let require:any;
import "reflect-metadata";
// import "zone.js";

var FirebaseService = require('../src/services').FirebaseService;
var HOTEL_DATA_BUCKET = require('../src/services').HOTEL_DATA_BUCKET;

var ReflectiveInjector = require('@angular/core').ReflectiveInjector;
var FirebaseService = require('../src/services').FirebaseService;
var AngularFire = require('angularfire2').AngularFire;
var COMMON_PROVIDERS = require('angularfire2').COMMON_PROVIDERS;
var FIREBASE_PROVIDERS = require('angularfire2').FIREBASE_PROVIDERS;
var WindowLocation = require('angularfire2').WindowLocation;

var co = require('co');



var ServerSideFirebase = require('./ServerSideFirebase').ServerSideFirebase;


ServerSideFirebase.initFirebaseService();

// let customProviders = [
//     {provide: WindowLocation, useValue: 'http://localhost'}
// ]

// var resolvedProviders = ReflectiveInjector.resolve(FirebaseService.initialize().providers.concat(COMMON_PROVIDERS).concat(FIREBASE_PROVIDERS).concat(customProviders))
// var injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);

// var FirebaseUserConfig = injector.get(FirebaseUserConfig);

// console.log(FirebaseUserConfig);

// var af = (injector.get(AngularFire));

// FirebaseService.initInstance(af);


// var emptyHotelsBucket = require('../src/services').emptyHotelsBucket;

// console.log(emptyHotelsBucket().toPromise());

module.exports = function() {
  return actor({

    login(email, password){      
      let I = this;
      I.amOnPage("/");
      I.seeInCurrentUrl("/login");
      // I.fillField("#email", "irwan@bagubagu.com");
      // I.fillField("#password", "abcd1234");
      I.fillField("#email", email);
      I.fillField("#password", password);
      I.click("#submit", null);
    },

    // clearHotelsBucket(){
    //   return ServerSideFirebase.clearBucket(HOTEL_DATA_BUCKET);

    //   // return co.wrap(this._clearHotelsBucket).call(this);

    //   // return co(this._clearHotelsBucket()).then(()=>{
    //   //   console.log('bucket cleared')
    //   //   return Promise.resolve();
    //   // })
    // }
    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.

  });
}
