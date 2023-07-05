Feature: Boost
  Background:
    Given I'm logged in

  Scenario: I boost my post with cash
    When I navigate to My Channel screen
    And I open the first post
    And I boost the post
    And I do a simple boost without actually submitting
    Then the boost should be posted successfully
