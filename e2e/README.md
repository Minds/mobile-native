# End-to-End Testing Documentation for React Native Application Using Appium, WebDriverIO, and Cucumber

## Introduction

This documentation provides guidelines and instructions for setting up and writing end-to-end (E2E) tests for a React Native application using Appium, WebDriverIO, and Cucumber. E2E tests are crucial for ensuring the reliability and functionality of your application across different platforms and devices. This documentation is intended for internal developers who want to get started with writing E2E tests for our React Native application.

## Prerequisites

Before you begin writing E2E tests, make sure you have the following prerequisites in place:

1. Node.js: Ensure that you have Node.js installed on your development machine.

2. Appium: Install Appium globally using npm:

   ```
   npm install -g appium
   ```

3. Appium Inspector (optional): Install Appium Inspector, which will help you inspect elements within the app for test automation.

4. Set the proper values in .env at the root of the project

5. You can run the test by running the command `yarn e2e:android:local --spec e2e/features/Login.feature` or similar

## Getting the App

Certainly, here's an updated paragraph within the documentation explaining why WebDriverIO requires the `.apk` (Android) and `.app` (iOS) files to run tests:

---

## Getting the Application

You need to have a Minds.apk and Minds.app in the /apps folder in order to test the app locally. These apps can be "debug" apps so they can use the packager.

### Android (.apk)

To obtain the Android application (.apk) for testing, follow these steps:

1. In development mode, you can generate the debug .apk by running the following command:

   ```
   npx react-native run-android --variant=debug
   ```

2. This command will build and install the debug version of your app on the connected Android emulator or device. The .apk file can be found in the `android/app/build/outputs/apk/debug` directory.

### iOS (.app)

For iOS testing, you can obtain the .app file directly from Xcode during development. Build and run your React Native application on an iOS simulator or physical device, and Xcode will generate the .app file in the build directory.

## Writing E2E Tests

When writing E2E tests for the React Native application, consider the following guidelines:

1. **Specific Steps**: Instead of using testID exclusively to select elements, prioritize the use of elements' text content, and employ general Cucumber steps such as 'I see' and 'I tap on' (see when.ts) to interact with and assert them. While testID can be useful for uniquely identifying elements, relying solely on it can lead to test brittleness and increased maintenance effort when UI changes occur. By focusing on text content and employing more abstract Cucumber steps, your tests become more resilient to UI modifications and remain understandable.

2. **Debugging**: Utilize the `await driver.debug();` command when debugging the test code. This command allows you to interactively run Appium commands and inspect the application's state during test execution.

3. **Element Inspection**: Use Appium Inspector to inspect and identify elements within your React Native application. This tool helps you obtain element locators (e.g., XPath, ID, class name) required for test automation. Example capability for connecting to an iOS simulator:

```json
{
  "platformName": "iOS",
  "appium:platformVersion": "16.4",
  "appium:deviceName": "iPhone 14 Pro Max",
  "appium:automationName": "XCUITest",
  "appium:udid": "929861AD-C02E-4165-A4A1-CDEA2989F3CC",
  "appium:settings[snapshotMaxDepth]": 80,
  "appium:autoAcceptAlerts": "true"
}
```

4. **React Native Development**: When testing development versions of your React Native application, make sure to run the Metro Bundler using `yarn start`. This ensures that the app picks up the JavaScript bundle from Metro.

## Project Structure

### Modules

The "modules" directory is where we organize the core components of our E2E tests:

- **ScreenObject**: Each screen or component of the app should have its corresponding "ScreenObject." This object contains specific screen selectors and general interactions that are unique to that screen.

- **Screen-Specific Steps**: Within each module, we define screen-specific steps. These steps describe how to interact with the elements on that screen and how to verify their states. By encapsulating these behaviors in the modules, we keep our tests organized and maintainable.

### Features

- **Feature Files**: Each feature file represents a specific aspect or functionality of the app that we want to test. These files are written in Gherkin syntax and describe the behavior of our application from a user's perspective.

- **Scenarios and Steps**: Feature files contain scenarios, which define the steps that need to be executed during testing. These steps are implemented by referencing the methods and actions defined in the corresponding "ScreenObject" modules.

By adhering to this project structure, we gain several advantages:

- **Modularity**: Organizing our tests into modules promotes code reusability and maintainability. Each module focuses on a specific screen or component, simplifying updates when the UI changes.

- **Clarity**: Keeping screen-specific steps within the modules enhances code readability. Test scenarios in the feature files become concise and easy to understand, primarily referencing methods and actions defined in the "ScreenObject."

- **Scalability**: As the app evolves, we can easily add new modules and feature files to accommodate additional screens and functionalities. This modular approach simplifies expanding our test suite.

This project structure aligns with best practices for E2E testing, fostering clean, maintainable, and scalable test automation for the app.
