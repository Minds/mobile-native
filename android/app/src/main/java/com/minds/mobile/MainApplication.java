package com.minds.mobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import be.skyzohlabs.rnapk.ReactNativeAPKPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.peel.react.TcpSocketsModule;
import com.bitgo.randombytes.RandomBytesPackage;
import com.peel.react.rnos.RNOSModule;
import com.minds.crypto.CryptoPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnative.photoview.PhotoViewPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.meedan.ShareMenuPackage;
import com.mybigday.rnmediameta.RNMediaMetaPackage;
import com.rnfs.RNFSPackage;
import com.centaurwarchief.smslistener.SmsListenerPackage;
import com.microsoft.codepush.react.CodePush;
import com.reactnativejitsimeet.JitsiMeetPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import org.pgsqlite.SQLitePluginPackage;
import java.util.Arrays;
import java.util.List;
import javax.annotation.Nullable;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getBundleUrl("app.bundle");
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new NetInfoPackage(),
            new RNScreensPackage(),
            new ReactNativeAPKPackage(),
            new RNLocalizePackage(),
            new RNCWebViewPackage(),
            new AsyncStoragePackage(),
            new RNGestureHandlerPackage(),
            new CookieManagerPackage(),
            new RNExitAppPackage(),
            new TcpSocketsModule(),
            new RandomBytesPackage(),
            new RNOSModule(),
            new CryptoPackage(),
            new ReactVideoPackage(),
          new FastImageViewPackage(),
          new ReactNativeExceptionHandlerPackage(),
          new ImagePickerPackage(),
          new VectorIconsPackage(),
          new PhotoViewPackage(),
          new KCKeepAwakePackage(),
          new RNNotificationsPackage(MainApplication.this),
          new RNSharePackage(),
          new ShareMenuPackage(),
          new RNMediaMetaPackage(),
          new RNFSPackage(),
          new SmsListenerPackage(),
          new CodePush("_C083_CqL7CmKwASrv6Xrj1wqH7erJMhIBnRQ", MainApplication.this, BuildConfig.DEBUG),
          new JitsiMeetPackage(),
          new SQLitePluginPackage(),
          new BackgroundTimerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    protected @Nullable String getBundleAssetName() {
      return "app.bundle";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

  @Override
  public String getFileProviderAuthority() {
    return "com.minds.mobile.provider";
  }
}
