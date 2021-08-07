package com.ontvpass.tvpass;

import android.content.Context;
import android.os.Bundle;
import android.content.Intent;
import android.content.res.Configuration;
import android.view.WindowManager;

import com.google.android.gms.cast.framework.CastContext;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.newrelic.agent.android.NewRelic;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
//        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
        // lazy load Google Cast context
        try {
            if(((MainApplication) this.getApplication()).isCastAvailable()) {
                CastContext.getSharedInstance(this);
            }
        } catch (Exception e) {

        }
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        NewRelic.withApplicationToken(BuildConfig.NEWRELIC_API_TOKEN).start(this);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "TVPass";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
