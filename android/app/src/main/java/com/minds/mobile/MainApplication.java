package com.minds.mobile;

import android.content.res.Configuration;
import expo.modules.ApplicationLifecycleDispatcher;
import expo.modules.ReactNativeHostWrapper;

import android.app.Application;

import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import cl.json.ShareApplication;
import com.rnfs.RNFSPackage;
import java.util.List;
import java.util.Arrays;

import javax.annotation.Nullable;
import java.lang.reflect.InvocationTargetException;
import com.minds.mobile.CustomErrorScreen;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerModule;

import com.facebook.react.bridge.JSIModulePackage;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;
import com.minds.mobile.CustomMMKVJSIModulePackage;
import com.facebook.react.bridge.JSIModulePackage;
import com.microsoft.codepush.react.CodePush;

import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;


public class MainApplication extends Application implements ShareApplication, ReactApplication {
  
 private final ReactNativeHost mReactNativeHost =
    new ReactNativeHostWrapper(this, new DefaultReactNativeHost(this) {
      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }

      @Override
      protected boolean isNewArchEnabled() {
        return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
      }
      @Override
      protected Boolean isHermesEnabled() {
        return BuildConfig.IS_HERMES_ENABLED;
      }

      @Override
      protected JSIModulePackage getJSIModulePackage() {
        return new CustomMMKVJSIModulePackage();
      }

      @Override
      protected List<ReactPackage> getPackages() {
        @SuppressWarnings("UnnecessaryLocalVariable")
        List<ReactPackage> packages = new PackageList(this).getPackages();
        packages.add(new RNNotificationsPackage(this.getApplication()));

        return packages;
      }

      @Override
      public String getJSBundleFile() {
          return CodePush.getJSBundleFile();
      }

      @Override
      protected String getJSMainModuleName() {
        return "index";
      }
  });

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    ReactNativeExceptionHandlerModule.replaceErrorScreenActivityClass(CustomErrorScreen.class);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    ApplicationLifecycleDispatcher.onApplicationCreate(this);
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig);
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.minds.mobile.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }

  @Override
  public String getFileProviderAuthority() {
    return "com.minds.mobile.provider";
  }
}
