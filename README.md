# Minds Mobile Apps

## Branch Structure

| Branch    |                                                                                                                                    |
|-----------|------------------------------------------------------------------------------------------------------------------------------------|
| master    | Approved code ready to merged into the next stable release. All tests should pass and be in a 'ready' state                        |
| stable/*  | Stable builds, inherited from `release/*` branches. Fastlane automatically deploys these builds.                                   |
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

## Building

- `yarn install`
- `react-native run-ios` or `react-native run-android`

## Testing

- `yarn test`


### _Copyright Minds 2018_
