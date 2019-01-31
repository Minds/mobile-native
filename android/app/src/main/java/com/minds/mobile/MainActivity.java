package com.minds.mobile;

import com.facebook.react.ReactActivity;

// image picker imports
import com.imagepicker.permissions.OnImagePickerPermissionsCallback;
import com.facebook.react.modules.core.PermissionListener;

public class MainActivity extends ReactActivity implements OnImagePickerPermissionsCallback {
    private PermissionListener listener;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Minds";
    }

    @Override
    public void setPermissionListener(PermissionListener listener)
    {
        this.listener = listener;
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        moveTaskToBack(true);
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
    {
        if (listener != null)
        {
        listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
