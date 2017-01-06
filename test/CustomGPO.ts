

let I;

module.exports = {

  _init() {
    I = require('./steps_file.js')();
  },
  login2(){
    console.log('login called')
    I.amOnPage("/");
    I.seeInCurrentUrl("/login");
    I.fillField("#email", "irwan@bagubagu.com");
    I.fillField("#password", "abcd1234");
    I.click("#submit", null);
    I.waitForText("Hotels", 1, null);    
  }
  

  // insert your locators and methods here
}
