/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
 #import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <SwrveSDK/SwrveSDK.h>
#import "SwrvePlugin.h"
#import <AppTrackingTransparency/AppTrackingTransparency.h>
#import <AdSupport/AdSupport.h>

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <GoogleCast/GoogleCast.h>
#import "ReactNativeConfig.h"
#import <React/RCTLinkingManager.h>

#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif

#if TARGET_OS_IOS
#import "Orientation.h"
#if RELEASE
#import <AppCenterReactNativeShared/AppCenterReactNativeShared.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
#endif
#import "RNSplashScreen.h"
#import <RNHomeIndicator.h>
#endif

#if DEBUG
#if TARGET_OS_IOS
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
#import <flipper-plugin-react-native-performance/FlipperReactPerformancePlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client addPlugin: [FlipperReactPerformancePlugin sharedInstance]];
  [client start];
}
#endif
#endif


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  if ([url.scheme isEqualToString:@"struum"]) {
       [SwrveSDK handleDeeplink:url];
     }
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}
//- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
//  [SwrvePlugin handleDeeplink:url];
//  return [RCTLinkingManager application:app openURL:url options:options];
//}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  #if TARGET_OS_IOS
  #if RELEASE
  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes register];
  #endif
  #endif
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  
  #if RCT_DEV
  [bridge moduleForClass:[RCTDevLoadingView class]];
  #endif
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"TVPass"
                                            initialProperties:nil];

  rootView.backgroundColor = [UIColor colorWithRed: 0.05 green: 0.06 blue: 0.13 alpha: 1.00]; //#0C1021;

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [HomeIndicatorViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // App tracking transparency
  [self requestPermission];
  [self setUpNewRelic];
  [self setupSwrve];
  [self setupChromecast];

  #if TARGET_OS_IOS
  [RNSplashScreen show];
  #endif
  
  #if DEBUG
  #if TARGET_OS_IOS
  InitializeFlipper(application);
  [[FlipperReactPerformancePlugin sharedInstance] setBridge:bridge];
  #endif
  #endif

  // Define UNUserNotificationCenter
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  return YES;
}

- (void)requestPermission {
  if (@available(iOS 14, *)) {
    [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
      switch(status){
        case ATTrackingManagerAuthorizationStatusNotDetermined:
          break;
        case ATTrackingManagerAuthorizationStatusRestricted:
          break;
        case ATTrackingManagerAuthorizationStatusDenied:
          break;
        case ATTrackingManagerAuthorizationStatusAuthorized:
          break;
      }
    }];
  } else {
    // Fallback on earlier versions
  }
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#if TARGET_OS_IOS
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}
#endif

- (void)setUpNewRelic {
  NSString *appToken = [ReactNativeConfig envFor:@"NEWRELIC_API_TOKEN"];
  [NewRelic disableFeatures:NRFeatureFlag_NSURLSessionInstrumentation | NRFeatureFlag_NetworkRequestEvents];
  [NewRelic startWithApplicationToken:appToken];
  [NewRelic setMaxEventBufferTime:300];
}

- (void)setupSwrve {
  NSString *appId = [ReactNativeConfig envFor:@"SWRVE_APP_ID"];
  NSString *apiKey = [ReactNativeConfig envFor:@"SWRVE_API_KEY"];
  
  SwrveConfig* config = [[SwrveConfig alloc] init];
  // To use the EU stack, include this in your config
  // config.stack = SWRVE_STACK_EU;
  config.initMode = SWRVE_INIT_MODE_AUTO;
  config.pushEnabled = YES;
  config.pushNotificationEvents = [NSSet setWithObject:@"tvpass.app.start"];
  config.provisionalPushNotificationEvents = [NSSet setWithObject:@"Swrve.session.start"]; // Ask for provisional push permission on app launch
  [SwrvePlugin initWithAppID:[appId intValue] apiKey:apiKey config:config];
}

- (void)setupChromecast {
  NSString *appId = [ReactNativeConfig envFor:@"CHROMECAST_APP_ID"];
  GCKDiscoveryCriteria *criteria = [[GCKDiscoveryCriteria alloc] initWithApplicationID:appId];
  GCKCastOptions* options = [[GCKCastOptions alloc] initWithDiscoveryCriteria:criteria];
  [GCKCastContext setSharedInstanceWithOptions:options];
  options.physicalVolumeButtonsWillControlDeviceVolume = YES;
  [GCKCastContext sharedInstance].useDefaultExpandedMediaControls = NO; // Disabled expanded controls since it has issues with subtitle selection
  //Cast Dialogs UI Customization
  GCKUIStyle *castStyle = [GCKUIStyle sharedInstance];
  castStyle.castViews.backgroundColor = [UIColor colorWithRed: 0.05 green: 0.06 blue: 0.13 alpha: 1.00];
  castStyle.castViews.headingTextColor = [UIColor whiteColor];
  castStyle.castViews.headingTextFont = [UIFont fontWithName:@"Inter-Medium" size:24.0];
  castStyle.castViews.bodyTextColor = [UIColor whiteColor];
  castStyle.castViews.bodyTextFont = [UIFont fontWithName:@"Inter-Medium" size:14.0];
  castStyle.castViews.iconTintColor = [UIColor whiteColor];
  castStyle.castViews.buttonTextFont = [UIFont fontWithName:@"Inter-Medium" size:14.0];
  
  castStyle.castViews.deviceControl.deviceChooser.backgroundColor = [UIColor colorWithRed: 0.05 green: 0.06 blue: 0.13 alpha: 1.00];
  castStyle.castViews.deviceControl.deviceChooser.headingTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.deviceChooser.headingTextFont = [UIFont fontWithName:@"Inter-Medium" size:16.0];
  castStyle.castViews.deviceControl.deviceChooser.iconTintColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.deviceChooser.sliderTooltipBackgroundColor = [UIColor grayColor];
  castStyle.castViews.deviceControl.deviceChooser.captionTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.deviceChooser.buttonTextColor = [UIColor whiteColor];
  
  castStyle.castViews.deviceControl.headingTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.headingTextFont = [UIFont fontWithName:@"Inter-Medium" size:16.0];
  castStyle.castViews.deviceControl.bodyTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.bodyTextFont = [UIFont fontWithName:@"Inter-Medium" size:16.0];
  castStyle.castViews.deviceControl.headingTextColor = [UIColor whiteColor];
  
  castStyle.castViews.mediaControl.headingTextColor = [UIColor whiteColor];
  castStyle.castViews.mediaControl.headingTextFont = [UIFont fontWithName:@"Inter-Medium" size:16.0];
  castStyle.castViews.mediaControl.bodyTextColor = [UIColor whiteColor];
  castStyle.castViews.mediaControl.bodyTextFont = [UIFont fontWithName:@"Inter-Medium" size:16.0];
  
  castStyle.castViews.deviceControl.connectionController.backgroundColor = [UIColor colorWithRed: 0.05 green: 0.06 blue: 0.13 alpha: 1.00];
  castStyle.castViews.deviceControl.connectionController.buttonTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.connectionController.captionTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.connectionController.headingTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.connectionController.bodyTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.connectionController.toolbar.buttonTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.connectionController.toolbar.headingTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.connectionController.toolbar.captionTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.connectionController.iconTintColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.connectionController.navigation.headingTextFont = [UIFont fontWithName:@"Inter-Medium" size:16.0];
  castStyle.castViews.deviceControl.connectionController.navigation.buttonTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.connectionController.navigation.captionTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.connectionController.navigation.headingTextColor = [UIColor whiteColor];
  castStyle.castViews.deviceControl.connectionController.navigation.backgroundColor =  [UIColor colorWithRed: 0.05 green: 0.06 blue: 0.13 alpha: 1.00]; //#0C1021 -Updated font and color matching UI figma Chromecast screen
  [castStyle applyStyle];
}

/* RN Push Note begin */
//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}
/* RN Push Note end */

@end
