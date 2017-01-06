
Feature('Login');

Scenario('test redirect to /login when not logged in and then pointing to host name', (I) => {
    I.amOnPage("/");
    I.seeInCurrentUrl("/login");
});


Scenario('test logging in using the correct username and password and test always redirected to home', (I:any) => {
    I.login("irwan@bagubagu.com", "abcd1234");

    I.wait(1);

    I.amOnPage("/");
    I.wait(1);
    I.seeInCurrentUrl("/home");
});


Scenario('test using incorrect username and password', (I:any) => {
    I.login("irwan21212@bagubagu.com", "abcd1234sdasdad");
    
    I.waitForText("Error: There is no user record corresponding to this identifier.", 1, null);
    
});

