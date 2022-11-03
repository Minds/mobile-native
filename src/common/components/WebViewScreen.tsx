import { RouteProp, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { MoreStackParamList } from '../../navigation/NavigationTypes';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../services/i18n.service';
import { B1, Screen } from '../ui';
import CenteredLoading from './CenteredLoading';

type WebViewScreenRouteProp = RouteProp<MoreStackParamList, 'WebView'>;
type WebViewScreenNavigationProp = StackNavigationProp<
  MoreStackParamList,
  'WebView'
>;

type WebViewScreenProps = {
  route: WebViewScreenRouteProp;
};

export default function WebViewScreen({ route }: WebViewScreenProps) {
  const navigation = useNavigation<WebViewScreenNavigationProp>();
  if (!route.params) return;

  return (
    <Screen>
      <WebView
        source={{
          uri: route.params.url,
        }}
        scrollEnabled={true}
        mixedContentMode="compatibility"
        style={[ThemedStyles.style.bgSecondaryBackground]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        onNavigationStateChange={
          !route.params.redirectUrl
            ? undefined
            : (event: WebViewNavigation) => {
                if (event.url === route.params.redirectUrl) {
                  route.params.onRedirect?.();
                  navigation.goBack();
                  return false;
                }

                return true;
              }
        }
        startInLoadingState={true}
        renderLoading={() => <CenteredLoading />}
        renderError={() => <B1>{i18n.t('failedTryAgain')}</B1>}
      />
    </Screen>
  );
}
