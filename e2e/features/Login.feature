Feature: Login
  As a customer
  I want to be able to interact with login screen so users can successfully login

  Scenario Outline: login invalid credentials errors
    Given I am logged out
    And I am on Login screen
    When I pass credentials; username: '<username>' and password: '<password>'
    Then I am still on Login screen
    And I see incorrect credentials error

    Examples:
      | username          | password          |
      | incorrectuser     | incorrectpassword |
      | test_deleted_user | Minds@12345       |

  Scenario: login empty credentials errors
    Given I am logged out
    And I am on Login screen
    When I pass credentials; username: '' and password: ''
    Then I am still on Login screen
    And I see empty credentials error

  Scenario: login banned credentials errors
    Given I am logged out
    And I am on Login screen
    When I pass banned credentials
    Then I am still on Login screen

  Scenario: login successfully
    Given I am logged out
    And I am on Login screen
    When I pass valid credentials
    Then I am taken to Home screen

  Scenario: logout successfully
    Given I navigate to Drawer screen
    And I tap on Settings
    And I tap on Logout
    Then I can see Login

  Scenario: switch user successfully
    Given I am logged in
    And I navigate to Switch Account screen
    And I tap on Add existing account
    And I pass another valid credentials
    Then I am taken to Home screen
    And I navigate to Drawer screen
    Then I can see $E2E_USERNAME2
