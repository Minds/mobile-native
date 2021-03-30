fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## iOS
### ios auth
```
fastlane ios auth
```
Authenticate with App Store Connect
### ios test
```
fastlane ios test
```
Run all the tests
### ios buildrelease
```
fastlane ios buildrelease
```
Build release
### ios testflight
```
fastlane ios testflight
```
Push a new beta build to TestFlight
### ios preparesentry
```
fastlane ios preparesentry
```
Prepare sentry release

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
