require("reflect-metadata");

declare let codecept_helper:FunctionConstructor;

let Helper = codecept_helper;



var HOTEL_DATA_BUCKET = require('../src/services').HOTEL_DATA_BUCKET;

var ServerSideFirebase = require('./ServerSideFirebase').ServerSideFirebase;


ServerSideFirebase.initFirebaseService();


class CustomHelper extends Helper {

  constructor(config) {
    super(config);
  }
  

  // before/after hooks
  _before() {
    // remove if not used
  }

  _after() {
    // remove if not used
  }

  // add custom methods here
  // If you need to access other helpers
  // use: this.helpers['helperName']

  clearTable(bucketName){
      return ServerSideFirebase.clearBucket(HOTEL_DATA_BUCKET);
  }

}

module.exports = CustomHelper;