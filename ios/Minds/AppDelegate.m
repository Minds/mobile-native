/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNNotifications.h"
#import "AppDelegate.h"
#import "RNBootSplash.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTConvert.h>

#import <RNShareMenu/ShareMenuManager.h>
#import "ReactNativeExceptionHandler.h"
#import "Orientation.h"

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [Orientation setOrientation:UIInterfaceOrientationMaskPortrait];
  #ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
  #endif
  NSDictionary *initialProperties = arguments();
  RCTBridge *bridge = [self.reactDelegate createBridgeWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [self.reactDelegate createRootViewWithBridge:bridge
                                                   moduleName:@"Minds"
                                            initialProperties:initialProperties];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [self.reactDelegate createRootViewController];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];

  [RNNotifications startMonitorNotifications];

  [ReactNativeExceptionHandler replaceNativeExceptionHandlerBlock:^(NSException *exception, NSString *readeableException){

    //We create an alert box
    UIAlertController* alert = [UIAlertController
                                alertControllerWithTitle:@"An error occurred"
                                message: @"Apologies..The app will close now \nPlease restart the app\n"
                                preferredStyle:UIAlertControllerStyleAlert];

    // We show the alert box using the rootViewController
    [rootViewController presentViewController:alert animated:YES completion:nil];

    // Hence we set a timer of 4 secs and then call the method releaseExceptionHold to quit the app after
    // 4 secs of showing the popup
    [NSTimer scheduledTimerWithTimeInterval:4.0
                                     target:[ReactNativeExceptionHandler class]
                                   selector:@selector(releaseExceptionHold)
                                   userInfo:nil
                                    repeats:NO];

    // or  you can call
    // [ReactNativeExceptionHandler releaseExceptionHold]; when you are done to release the UI lock.
  }];

  [super application:application didFinishLaunchingWithOptions:launchOptions];

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#ifdef FB_SONARKIT_ENABLED
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  // return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

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


static NSDictionary *arguments()
{
    NSArray *arguments = [[NSProcessInfo processInfo] arguments];

    if(arguments.count < 2)
        return nil;

    NSMutableDictionary *argsDict = [[NSMutableDictionary alloc] init];

    NSMutableArray *args = [arguments mutableCopy];
    [args removeObjectAtIndex:0];

    NSInteger skip = 0;
    for(NSString *arg in args)
    {
        if(skip > 0 && ((NSInteger)[arguments indexOfObject:arg]) == skip)
        {
            continue;
        }
        else
        {
            if([arg rangeOfString:@"="].location != NSNotFound && [arg rangeOfString:@"--"].location != NSNotFound)
            {
                NSArray *components = [arg componentsSeparatedByString:@"="];
                NSString *key       = [[components objectAtIndex:0] stringByReplacingOccurrencesOfString:@"--" withString:@""];
                NSString *value     = [components objectAtIndex:1];

                [argsDict setObject:value forKey:key];
            }
            else if([arg rangeOfString:@"-"].location != NSNotFound)
            {
                NSInteger index = [arguments indexOfObject:arg];
                NSInteger next  = index + 1;
                NSString *key   = [arg stringByReplacingOccurrencesOfString:@"-" withString:@""];
                NSString *value = [arguments objectAtIndex:next];

                [argsDict setObject:value forKey:key];
            }
        }
    }

    NSLog(@"ARGS: %@", argsDict);

    return [argsDict copy];
}

@end
