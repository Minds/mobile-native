# Minds Mobile Apps

## Install

Clone mobile\
`git clone git@gitlab.com:minds/mobile-native.git`

Clone locale\
`cd ..`

`git clone git@gitlab.com:minds/l10n.git`

`cd -`

## Branch Structure

| Branch    |                                                                                                                                    |
|-----------|------------------------------------------------------------------------------------------------------------------------------------|
| master    | Approved code ready to merged into the next stable release. All tests should pass and be in a 'ready' state                        |
| stable/*  | Stable builds, inherited from `release/*` branches. Fastlane automatically deploys these builds.                                   |
| test/*    | Release candidate builds, inherited from `release/*` branches. Fastlane automatically deploys these builds.                        |
| release/* | WIP builds. Run `fastlane run increment_version_number` upon creating the branch.                                                  |
| feat/*    | New branches should be made for each Gitlab issue. Merge requests should be opened pointing towards the respective release branch. |

## Increasing the version number

### Patch

`fastlane run increment_version_number bump_type:patch`

### Minor

`fastlane run increment_version_number bump_type:minor`

### Major

`fastlane run increment_version_number bump_type:major`

## Platforms

- iOS
- Android

## Install dependencies

- `yarn install`
- `cd ios && pod install` (iOS only)

## Building

- `yarn android` or `yarn ios`

## Testing

- `yarn test`

## Testing e2e (macOS)

Install the detox cli
- `brew tap wix/brew`
- `brew install applesimutils`
- `yarn global add detox-cli`

Run the tests
- `detox build -c ios.sim.debug`
- `detox test -c ios.sim.debug`

You can use -c ios.sim.release for e2e test a production build

### Building Android releases

#### Setup your environment variables

`export ANDROID_KEYSTORE=`

`export KEYSTORE_PASSWORD=`

`export SENTRY_ANDROID_PROPERTIES=`

#### Build

1) Build the app

`cd android && fastlane assemble_build && cd ..`

2) Push to s3

`aws s3 cp android/app/build/outputs/apk/release/app-release.apk s3://minds-repo/android/Minds-stable-4-8-2.apk`

3) Update the releases.json

`yarn release-json android/app/build/outputs/apk/release/app-release.apk`

4) Verify the release name is correct in ./releases.json

6) Upload the releases.json changes

`aws s3 cp releases.json s3://minds-repo/android/releases/releases.json`

#### Custom Release

Once the file is generated in the CI download the apk and run:

`yarn release-json path/file.apk`

This will update the release.json with this version data

Note: You have to update the change-log for the version!

Upload the file to s3 and that is it.


### _Copyright Minds 2018_
