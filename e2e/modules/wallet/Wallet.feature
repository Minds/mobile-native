Feature: Wallet screen
    As a user
    I want to use my wallet

    Background:
        Given I'm logged in
        And I navigate to Wallet screen

    @android
    Scenario: I can see a button to connect my stripe cash account
        When I switch to the cash option
        And I switch to the Settings tab
        Then I should see the stripe connect button
