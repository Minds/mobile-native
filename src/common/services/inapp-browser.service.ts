import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { Alert, Linking } from 'react-native';

import sp from '~/services/serviceProvider';

export async function openLinkInInAppBrowser(url) {
  const themedStyles = sp.styles;
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: themedStyles.getColor('PrimaryBackground'),
        preferredControlTintColor: themedStyles.getColor('PrimaryText'),
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: themedStyles.getColor('PrimaryBackground'),
        secondaryToolbarColor: themedStyles.getColor('SecondaryBackground'),
        navigationBarColor: themedStyles.getColor('PrimaryBackground'),
        navigationBarDividerColor: themedStyles.getColor('SecondaryBackground'),
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        // FIXME: these animations aren't currently working
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
        // headers: {
        //   'my-custom-header': 'my custom header value',
        // },
      });
    } else Linking.openURL(url);
  } catch (error) {
    if (typeof error === 'string') {
      Alert.alert(error);
    } else if (error instanceof Error) {
      Alert.alert(error.message);
    }
  }
}
