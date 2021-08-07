package com.ontvpass.tvpass;

import android.app.Application;
import android.app.UiModeManager;
import android.content.Context;
import android.content.res.Configuration;
import android.os.Build;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.reactnative.googlecast.GoogleCastPackage;
import com.swrve.reactnative.SwrvePlugin;
import com.swrve.sdk.config.SwrveConfig;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      if(isCastAvailable()) {
        packages.add(new GoogleCastPackage());
      }
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  protected boolean isCastAvailable() {
    return this.isGooglePlayServicesAvailable() && !this.isTV();
  }
  public boolean isTV() {
    UiModeManager uiModeManager = (UiModeManager) getSystemService(UI_MODE_SERVICE);
    if (uiModeManager.getCurrentModeType() == Configuration.UI_MODE_TYPE_TELEVISION) {
      return true;
    } else {
      return false;
    }
  }
  public boolean isGooglePlayServicesAvailable(){
    if(isFireOS()){
      return false;
    }
    GoogleApiAvailability googleApiAvailability = GoogleApiAvailability.getInstance();
    int resultCode = googleApiAvailability.isGooglePlayServicesAvailable(this.getApplicationContext());
    return resultCode == ConnectionResult.SUCCESS;
  }

  private boolean isFireOS() {
    return Build.MODEL.contains("AFT");
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    try {
        SwrveConfig swrveConfig = new SwrveConfig();
        SwrvePlugin.createInstance(this, Integer.parseInt(BuildConfig.SWRVE_APP_ID), BuildConfig.SWRVE_API_KEY, swrveConfig);
    } catch (IllegalArgumentException exp) {

    }
  }
  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.ontvpass.tvpass.ReactNativeFlipper");
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
}
