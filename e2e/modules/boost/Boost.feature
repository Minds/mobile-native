Feature: Boost
  Background:
    Given I'm logged in

  Scenario: I boost my post with cash
    When I navigate to My Channel screen
    And I open the first post
    And I boost the post with 1 USD and 1000 views
    Then the boost should be posted successfully

  Scenario: I boost my post with tokens
    When I navigate to My Channel screen
    And I open the first post
    And I boost the post with 1 token and 1000 views
    Then the boost should be posted successfully

  Scenario: I boost my channel with cash
    When I navigate to My Channel screen
    And I boost the channel with 1 USD and 1000 views
    Then the boost should be posted successfully

  Scenario: I boost my channel with tokens
    When I navigate to My Channel screen
    And I boost the channel with 1 token and 1000 views
    Then the boost should be posted successfully
