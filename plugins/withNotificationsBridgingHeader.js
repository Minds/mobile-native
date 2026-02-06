const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withNotificationsBridgingHeader = config => {
  config = withDangerousMod(config, [
    'ios',
    async config => {
      const projectRoot = config.modRequest.projectRoot;
      const projectName = config.modRequest.projectName;

      // Write the bridging header
      const bridgingHeaderPath = path.join(
        projectRoot,
        'ios',
        projectName,
        `${projectName}-Bridging-Header.h`,
      );

      const bridgingHeaderContent = `//
// Use this file to import your target's public headers that you would like to expose to Swift.
//

#import <RNNotifications.h>
`;

      fs.writeFileSync(bridgingHeaderPath, bridgingHeaderContent);

      // Modify AppDelegate.swift to add notification delegate methods
      const appDelegatePath = path.join(
        projectRoot,
        'ios',
        projectName,
        'AppDelegate.swift',
      );

      if (fs.existsSync(appDelegatePath)) {
        let contents = fs.readFileSync(appDelegatePath, 'utf-8');

        // Add startMonitorNotifications in didFinishLaunchingWithOptions
        if (!contents.includes('RNNotifications.startMonitorNotifications')) {
          contents = contents.replace(
            /return super\.application\(application, didFinishLaunchingWithOptions: launchOptions\)/,
            `RNNotifications.startMonitorNotifications()\n    return super.application(application, didFinishLaunchingWithOptions: launchOptions)`,
          );
        }

        // Add push notification delegate methods before the closing brace of AppDelegate class
        if (
          !contents.includes('didRegisterForRemoteNotificationsWithDeviceToken')
        ) {
          const delegateMethods = `
  // Push notification delegates for react-native-notifications
  public override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    RNNotifications.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
  }

  public override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    RNNotifications.didFailToRegisterForRemoteNotificationsWithError(error)
  }

  public override func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    RNNotifications.didReceiveBackgroundNotification(userInfo, withCompletionHandler: completionHandler)
  }
`;

          // Insert before the closing brace of the AppDelegate class
          // Find the pattern: universal links method closing brace, then the class closing brace
          const classEndRegex = /(  \/\/ Universal Links[\s\S]*?^\s*\})\n(\})/m;
          if (classEndRegex.test(contents)) {
            contents = contents.replace(
              classEndRegex,
              `$1\n${delegateMethods}\n$2`,
            );
          } else {
            // Fallback: find the last closing brace that ends the AppDelegate class
            // Look for the pattern where AppDelegate class ends (before ReactNativeDelegate class)
            const delegateClassRegex = /^(\})\n\nclass ReactNativeDelegate/m;
            if (delegateClassRegex.test(contents)) {
              contents = contents.replace(
                delegateClassRegex,
                `${delegateMethods}\n}\n\nclass ReactNativeDelegate`,
              );
            }
          }
        }

        fs.writeFileSync(appDelegatePath, contents);
      }

      return config;
    },
  ]);

  return config;
};

module.exports = withNotificationsBridgingHeader;
