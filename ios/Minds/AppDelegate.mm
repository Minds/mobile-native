#import "AppDelegate.h"

// custom imports minds
#import "RNNotifications.h"
#import "RNBootSplash.h"
#import <RNShareMenu/ShareMenuManager.h>
#import "ReactNativeExceptionHandler.h"
#import <CodePush/CodePush.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTConvert.h>
// end custom imports

#import <React/RCTBundleURLProvider.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Minds";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  [RNNotifications startMonitorNotifications];

  // [ReactNativeExceptionHandler replaceNativeExceptionHandlerBlock:^(NSException *exception, NSString *readeableException){

  //   //We create an alert box
  //   UIAlertController* alert = [UIAlertController
  //                               alertControllerWithTitle:@"An error occurred"
  //                               message: @"Apologies..The app will close now \nPlease restart the app\n"
  //                               preferredStyle:UIAlertControllerStyleAlert];

  //   // We show the alert box using the rootViewController
  //   [rootViewController presentViewController:alert animated:YES completion:nil];

  //   // Hence we set a timer of 4 secs and then call the method releaseExceptionHold to quit the app after
  //   // 4 secs of showing the popup
  //   [NSTimer scheduledTimerWithTimeInterval:4.0
  //                                    target:[ReactNativeExceptionHandler class]
  //                                  selector:@selector(releaseExceptionHold)
  //                                  userInfo:nil
  //                                   repeats:NO];

  //   // or  you can call
  //   // [ReactNativeExceptionHandler releaseExceptionHold]; when you are done to release the UI lock.
  // }];
  // end minds packages init
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (UIView *)createRootViewWithBridge:(RCTBridge *)bridge
                          moduleName:(NSString *)moduleName
                           initProps:(NSDictionary *)initProps {
  UIView *rootView = [super createRootViewWithBridge:bridge
                                          moduleName:moduleName
                                           initProps:initProps];

  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];

  return rootView;
}

// minds added methods
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [ShareMenuManager application:app openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager
           application:application openURL:url
           sourceApplication:sourceApplication
           annotation:annotation
         ];
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [RNNotifications didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  [RNNotifications didFailToRegisterForRemoteNotificationsWithError:error];
}

// end minds added methods

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}


@end
