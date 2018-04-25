package com.minds.mobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.bitgo.randombytes.RandomBytesPackage;
import com.peel.react.rnos.RNOSModule;
import com.minds.crypto.CryptoPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnative.photoview.PhotoViewPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.meedan.ShareMenuPackage;
import com.mybigday.rnmediameta.RNMediaMetaPackage;
import com.rnfs.RNFSPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new RandomBytesPackage(),
            new RNOSModule(),
            new CryptoPackage(),
            new ReactVideoPackage(),
            new BlurViewPackage(),
          new FastImageViewPackage(),
          new ReactNativeExceptionHandlerPackage(),
          new ImagePickerPackage(),
          new VectorIconsPackage(),
          new PhotoViewPackage(),
          new RNI18nPackage(),
          new KCKeepAwakePackage(),
          new RNNotificationsPackage(MainApplication.this),
          new RNSharePackage(),
          new ShareMenuPackage(),
          new RNMediaMetaPackage(),
          new RNFSPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
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
