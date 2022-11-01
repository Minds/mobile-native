Feature: Login flow
    As a user
    I want to be able to login in the app

    Background:
        Given I'm logged out
        And I tap on the login button

    Scenario: Displays error when logging in with empty credentials
        When I try to log in with credentials; username: '' and password: ''
        Then I see an error that the inputs are required

    Scenario Outline: Displays warning message when logging in with invalid credentials
        When I try to log in with credentials; username: '<Username>' and password: '<Password>'
        Then I see an error that the credentials are invalid

        Examples:
            | Username    | Password  |
            | user@123456 | 12346.346 |
            | 3243g@user  | /12346569 |

    Scenario: Shouldn't allow banned users to log in
        When I try to log in with a banned channel
        Then I see an error that the credentials are invalid

    Scenario: Shouldn't allow deleted users to log in
        When I try to log in with a deleted channel
        Then I see an error that the credentials are invalid

    Scenario: Should successfully login with a valid user
        When I try to log in with a valid channel
        Then I will be navigated to the Home screen
