package com.minds.mobile;

import android.app.Application;

import android.content.Context;
import com.facebook.react.PackageList;

import com.facebook.react.ReactApplication;
import com.bitgo.randombytes.RandomBytesPackage;
// import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.minds.crypto.CryptoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.corbt.keepawake.KCKeepAwakePackage;
import cl.json.ShareApplication;
import com.meedan.ShareMenuPackage;
import com.rnfs.RNFSPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import java.util.List;
import javax.annotation.Nullable;
import java.lang.reflect.InvocationTargetException;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

 private final ReactNativeHost mReactNativeHost =
    new ReactNativeHost(this) {
      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }

      @Override
      protected List<ReactPackage> getPackages() {
        @SuppressWarnings("UnnecessaryLocalVariable")
        List<ReactPackage> packages = new PackageList(this).getPackages();
        // Packages that cannot be autolinked yet can be added manually here, for example:
        // packages.add(new MyReactNativePackage());
        // packages.add(new BackgroundTimerPackage());
        // packages.add(new CryptoPackage());
        // packages.add(new RNFSPackage());
        // packages.add(new KCKeepAwakePackage()); //TOOD: update to new expo keep awake
        // packages.add(new ShareMenuPackage()); //TOOD: migrate to new https://github.com/ajith-ab/react-native-file-share-intent

        // packages.add(new RNNotificationsPackage()); //TOOD: update to new expo keep awake

        return packages;
      }

      // @Override
      // protected String getJSMainModuleName() {
      //   return "index";
      // }

      // @Override
      // protected @Nullable String getBundleAssetName() {
      //   return "app.bundle";
      // }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
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
