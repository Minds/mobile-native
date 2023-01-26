import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import WebView, { WebViewNavigation, WebViewProps } from 'react-native-webview';
import { MoreStackParamList } from '../../navigation/NavigationTypes';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../services/i18n.service';
import { B1, Screen } from '../ui';
import CenteredLoading from '../components/CenteredLoading';

type WebViewScreenRouteProp = RouteProp<MoreStackParamList, 'WebView'>;
type WebViewScreenNavigationProp = StackNavigationProp<
  MoreStackParamList,
  'WebView'
>;

type WebViewScreenProps = {
  route: WebViewScreenRouteProp;
  navigation: WebViewScreenNavigationProp;
};

export default function WebViewScreen({
  route,
  navigation,
}: WebViewScreenProps) {
  if (!route.params) return;

  /**
   * Looks for a path matching redirectUrl, calls onRedirect, and navigates back
   */
  const handleNavigationStateChange = route.params.redirectUrl
    ? (event: WebViewNavigation) => {
        if (event.url === route.params.redirectUrl) {
          route.params.onRedirect?.();
          navigation.goBack();
          return false;
        }

        return true;
      }
    : undefined;

  const source: WebViewProps['source'] = { uri: route.params.url };
  if (route.params.headers) {
    source.headers = route.params.headers;
  }

  return (
    <Screen name="WebViewScreen">
      <WebView
        source={source}
        scrollEnabled={true}
        mixedContentMode="compatibility"
        style={ThemedStyles.style.bgSecondaryBackground}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => <CenteredLoading />}
        renderError={() => <B1>{i18n.t('failedTryAgain')}</B1>}
      />
    </Screen>
  );
}
