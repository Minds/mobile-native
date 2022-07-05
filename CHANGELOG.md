# Changelog

Minds Mobile

## 4.26.0 - 2022-06-22

### Changed

- Video pre-load to improve UX in the feeds
- Dismissible channel recommendations
- Fix push notifications restart and navigation issues
- Fix share to minds error (when sharing text/URL from other apps)
- Fix bottom sheet opening randomly
- Fix deeplink for unread notifications email
- APK size reduced
- Video pause when changing screen
- Fix the inconsistent capitalization on Push Notifications settings
- Fix NSFW warnings

## 4.25.0 - 2022-06-08

### Changed

- React native updated to the latest version (0.68)
- Placeholders refactored using a more performant animation library
- Better error message when an upload fails
- Updated fast images package
- Wire amount validation added
- Track unmute events
- Fix email confirmation screen layout
- Fix play store automated releases when the changelog is to long
- Dark splash screen and splash package updated
- Fix iOS email invite encoding
- Fix share to minds error on iOS
- Improves the channel edit UX and keyboard handling
- Updates the video player, the linear gradient and image manipulator packages
- Update expo package
- Fix back button not working in some bottom sheets

## 4.24.0 - 2022-05-19

### Changed

- Regenerative Recommendations
- Latest posts prompt
- Friendly Captcha
- Channel contextual recommendations
- Save videos locally before uploading
- Video pause/resume functionality added to the composer
- Camera package updated
- Added android split-screen support
- Added CodePush support for faster updates
- Fix share videos to minds app (iOS)
- Fix the portrait feed showing scheduled posts
- Fix deep links and chat app detection on Android
- General bug fixing and improvements

## 4.23.0 - 2022-04-04

### Changed

- Fix hashtag navigation error
- Cleans up feature flag logic
- New toaster notifications
- Unverified email toaster added
- Improved transitions when opening multiple bottom sheets
- Fix Minds+ screen errors
- Fix some navigation issues with the interactions bottom sheets
- Fix onboarding tag selector visual an functional issues
- Fix posts visibility option when creating a post
- Fix groups posts visible on the main newsfeed
- Added custom API URL to dev tools
- Makes dev tools accessible on production mode by tapping multiple times hidden parts of the app
- Fix the auto login password reset flow is completed
- Fix group's search issues
- Adds a password show option to all the password fields of the app
- Standardize the user lists components
- Update the local storage package
- Fix the delete post error for admins when deleting a remind
- Improves the UX on feeds by loading next page before we reach the end
- Fix notification count issues
- Enable react-freeze, that improves the performance by freezing screens that are not visible
- Fix loading state indicators in comments
- Fix password confirmation when changing email
- Improved UX for onboarding channel setup
- Better rate limit message for the user when resetting the password
- Allow to verify email only once
- Fix trending analytics screen errors
- Remove full screen view for NSFW images when forbidden
- Improve validation/error messages on the change password screen

## 4.22.3 - 2022-03-18

### Changed

- Fix crash when translating post
- Fix issues switching users
- Fix some onboarding layout problems
- Fix symbols not allowed in username input

## 4.22.2 - 2022-03-15

### Changed

- Fix push notification not opening app on Android 12
- Fix cache issues

## 4.22.1 - 2022-03-11

### Changed

- Fix a crash on some Android 12 devices when receiving a push notification
- Fix missing NSFW settings on Android
- Fix blurred NSFW images after open them

## 4.22.0 - 2022-03-09

### Changed

- Twitter sync added
- Channel recommendations added to the feed
- Top/Latest feed
- Login/Register creative/UX
- Adds support for Blurhash in SmartImage (blurred placeholder while loading images)
- Add top discovery tab and add collapsible header to the discovery screen
- Bottom sheets can now be closed with the back button on Android devices
- Updates the camera package, disable frame processors (improve performance), and bump android target SDK
- Use growthbook react and use new event for experiments
- Development tools implemented: Analog to the growthbook chrome extension and to manage canary/staging options in dev mode
- Fix comments count propagation (replies)
- Standardize the keyboard handling
- Update reanimated library to 2.4.1
- Fix group deep linking and in-app linking
- Fix Billing settings
- Fix devices sleeps recording a video
- Fix portrait bar initial load
- Fix CI for play store deployment and update Fastlane
- Fix tokens transactions list date localization
- Fix notifications blurred thumbnail error
- Fix share post option (Android)
- Fix missing translations
- Fix growthbook attribute on logout
- Fix the feed pagination and update safe area package
- Fix make admin options in groups
- Fix notifications settings fail to load
- Removes legacy storage and code cleanup
- Fix remove pin option in main newsfeed
- Fix Activity indicator position and topbar border
- Fix android build error (due to photo editor package)
- Refactor and remove old composer code
- Fix comment report navigation
- Fix phone verification textbox reachability
- Adds support for spec tests in components folder
- Fix share to minds image preview on android
- Fix share to minds on iOS
- Fix social compass sliders on iOS

## 4.21.1 - 2022-02-03

### Changed

- Fix snowplow analytics information

## 4.21.0 - 2022-01-25

### Changed

- New navigation structure
- User and hashtag autocomplete
- Fix post scheduler
- Refresh in comments
- React native updated
- Level 2 replies auto tag
- Channel edit city autocomplete fixed
- Fix tags manager and tags selector scroll issues
- Fix notifications refresh
- General fixes and improvements

## 4.20.1 - 2022-01-17

### Changed

- Bug fixing

## 4.20.0 - 2021-12-10

### Changed

- New post composer screen
- New photo filters
- New date picker
- Social compass
- Comments improvements
- Improved UI consistency
- Withdrawal console added to wallet
- Post button added to user's profile screen
- Browser selector (in-app or default)
- Improved search UX
- Improved blog view screen
- Allow group owners and moderators to delete posts/comments
- Bug fixing

## 4.19.1 - 2021-11-04

### Changed

- Fix unresponsive UI in some Android devices
- Fix discovery visual errors

## 4.19.0 - 2021-10-25

### Changed

- Improved multi-user transitions
- New welcome, login, and register screens
- Improves error handling on the login screen
- New camera with zoom, HDR, and low light modes
- Help & support added.
- Improved UI consistency
- Improved 2FA settings screen
- Fix camera issues
- Fix push notification navigation and un-registering
- Fix link navigation in the blog viewer
- Fix issues with the android back button
- Fix data saver crash
- Compress the images to improve the upload speed
- General bug fixing

## 4.18.0 - 2021-09-20

### Changed

- Multi-user support
- New camera with zoom, HDR, and low light modes.
- Improved channel screen design
- 2FA modals
- Bug fixing

## 4.17.0 - 2021-08-27

### Changed

- Performance improvements
- New and faster storage system
- Keeps awake device while playing a video
- Improved UI/UX in discovery
- New interaction modals design
- Bug fixing

## 4.16.0 - 2021-07-26

### Changed

- Fix comments scroll problems
- Date format
- Detect chat app installed on iOS
- Improves UX on comments
- Bug fixing

## 4.15.0 - 2021-07-10

### Changed

- New bottom sheets
- New password reset screens
- Keyboard dark theme support on iOS
- Snowplow analytics
- Search filter added to discovery
- Bug fixing

## 4.14.3 - 2021-07-01

### Changed

- Fix notifications navigation

## 4.14.2 - 2021-06-25

### Changed

- Fix push notification settings

## 4.14.1 - 2021-06-22

### Changed

- Fix 2FA

## 4.14.0 - 2021-06-21

### Changed

- New notifications
- Interaction details
- Translation support added to comments
- Bug fixing

## 4.13.0 - 2021-05-21

### Changed

- Performance improvements
- Media attachment can now be edited on comments
- Allow exporting legacy wallets more than once
- Scroll added to the main menu for small screens
- Bug fixing

## 4.12.0 - 2021-05-05

### Changed

- Images pre-load on feeds
- New chat integration
- Improved deeplink support
- New sessions screen
- Bug fixing

## 4.11.1 - 2021-04-23

### Changed

- Bug fixing

## 4.11.0 - 2021-03-25

### Changed

- Channel screen styling improvements
- Updated react-native to 0.64
- Bug fixing

## 4.10.0 - 2021-03-20

### Changed

- Two-Factor Auth
- Bug fixing
