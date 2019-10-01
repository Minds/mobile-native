package com.minds.mobile;

import android.app.Application;

import android.content.Context;
import com.facebook.react.PackageList;

import com.facebook.react.ReactApplication;
import com.gettipsi.stripe.StripeReactPackage;
import com.reactnativejitsimeet.JitsiMeetPackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import be.skyzohlabs.rnapk.ReactNativeAPKPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.peel.react.TcpSocketsModule;
import com.bitgo.randombytes.RandomBytesPackage;
import com.peel.react.rnos.RNOSModule;
import com.minds.crypto.CryptoPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnative.photoview.PhotoViewPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import cl.json.ShareApplication;
import com.meedan.ShareMenuPackage;
import com.mybigday.rnmediameta.RNMediaMetaPackage;
import com.rnfs.RNFSPackage;
import com.reactnativejitsimeet.JitsiMeetPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import org.pgsqlite.SQLitePluginPackage;
import java.util.List;
import javax.annotation.Nullable;

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
        packages.add(new CookieManagerPackage());
        packages.add(new RNExitAppPackage());
        packages.add(new TcpSocketsModule());
        packages.add(new RandomBytesPackage());
        packages.add(new RNOSModule());
        packages.add(new BackgroundTimerPackage());
        packages.add(new CryptoPackage());
        packages.add(new RNFSPackage());
        packages.add(new SQLitePluginPackage());
        packages.add(new RNMediaMetaPackage()); //TOOD: search alternative to get video length
        packages.add(new PhotoViewPackage()); //TOOD: update to new package or remove it completelly
        packages.add(new KCKeepAwakePackage()); //TOOD: update to new expo keep awake
        packages.add(new ShareMenuPackage()); //TOOD: migrate to new https://github.com/ajith-ab/react-native-file-share-intent

        packages.add(new RNNotificationsPackage(MainApplication.this)); //TOOD: update to new expo keep awake

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

    // @Override
    // protected List<ReactPackage> getPackages() {
    //   return Arrays.<ReactPackage>asList(
    //       new MainReactPackage(),
    //         new RNSentryPackage(),
    //         new StripeReactPackage(),
    //         new SvgPackage(),
    //         new RNDeviceInfo(),
    //         new JitsiMeetPackage(),
    //         new NetInfoPackage(),
    //         new RNScreensPackage(),
    //         new ReactNativeAPKPackage(),
    //         new RNLocalizePackage(),
    //         new RNCWebViewPackage(),
    //         new AsyncStoragePackage(),
    //         new RNGestureHandlerPackage(),
    //         new CookieManagerPackage(),
    //         new RNExitAppPackage(),
    //         new TcpSocketsModule(),
    //         new RandomBytesPackage(),
    //         new RNOSModule(),
    //         new CryptoPackage(),
    //         new ReactVideoPackage(),
    //       new FastImageViewPackage(),
    //       new ReactNativeExceptionHandlerPackage(),
    //       new ImagePickerPackage(),
    //       new VectorIconsPackage(),
    //       new PhotoViewPackage(),
    //       new KCKeepAwakePackage(),
    //       new RNNotificationsPackage(MainApplication.this),
    //       new RNSharePackage(),
    //       new ShareMenuPackage(),
    //       new RNMediaMetaPackage(),
    //       new RNFSPackage(),
    //       new SQLitePluginPackage(),
    //       new BackgroundTimerPackage()
    //   );
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
