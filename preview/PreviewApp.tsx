import { Linking, StatusBar, Image } from 'react-native';

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FontsLoader } from 'FontsLoader';
import PreviewUpdateService from './PreviewUpdateService';

import { Button, H4, Screen } from '~/common/ui';
import AppMessageProvider from 'AppMessageProvider';
import { View } from 'react-native';
import { QRScanner } from './QRScanner';
import CenteredLoading from '~/common/components/CenteredLoading';
import ThemedStyles from '~/styles/ThemedStyles';

/**
 * Minds Networks Preview App
 */
export default function PreviewApp() {
  return (
    <FontsLoader>
      <SafeAreaProvider>
        <AppMessageProvider>
          <Preview />
        </AppMessageProvider>
      </SafeAreaProvider>
    </FontsLoader>
  );
}

const Preview = () => {
  const [scan, setScan] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleOpenURL = (url: string | { url: string } | null) => {
    url = url && typeof url === 'object' ? url.url : url;

    if (url && PreviewUpdateService.isPreviewURL(url)) {
      const channel = PreviewUpdateService.getPreviewChannel(url);
      setLoading(true);
      PreviewUpdateService.updatePreview(channel).finally(() => {
        setLoading(false);
      });
    }
  };

  React.useEffect(() => {
    Linking.getInitialURL().then(handleOpenURL);

    const subscription = Linking.addEventListener('url', handleOpenURL);
    return () => {
      subscription.remove();
    };
  }, []);

  const statusBarStyle =
    ThemedStyles.theme === 0 ? 'dark-content' : 'light-content';

  return (
    <Screen safe>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={ThemedStyles.getColor('PrimaryBackground')}
      />
      {loading ? (
        <CenteredLoading />
      ) : scan ? (
        <QRScanner setScan={setScan} />
      ) : (
        <>
          <Image
            source={require('../assets/images/splash.png')}
            resizeMode="contain"
            style={{ height: '60%', width: '100%' }}
          />
          <View
            style={{
              paddingTop: 20,
              paddingBottom: 50,
              paddingHorizontal: 10,
              justifyContent: 'space-between',
              flexDirection: 'column',
              flex: 1,
            }}>
            <View style={ThemedStyles.style.rowJustifyCenter}>
              <Button type="action" size="large" onPress={() => setScan(true)}>
                Scan QR code
              </Button>
            </View>

            <H4 font="medium" align="center" horizontal="XXL">
              Tap the button above to scan the network preview QR code. You can
              find the QR code in your email when your update build is ready.
            </H4>
          </View>
        </>
      )}
    </Screen>
  );
};
