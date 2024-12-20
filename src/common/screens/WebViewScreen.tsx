import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import type { WebViewNavigation, WebViewProps } from 'react-native-webview';
import { MoreStackParamList } from '../../navigation/NavigationTypes';

import { B1, Screen } from '../ui';
import CenteredLoading from '../components/CenteredLoading';
import { withErrorBoundaryScreen } from '../components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

type WebViewScreenRouteProp = RouteProp<MoreStackParamList, 'WebView'>;
type WebViewScreenNavigationProp = StackNavigationProp<
  MoreStackParamList,
  'WebView'
>;

type WebViewScreenProps = {
  route: WebViewScreenRouteProp;
  navigation: WebViewScreenNavigationProp;
};

function WebViewScreen({ route, navigation }: WebViewScreenProps) {
  if (!route.params) {
    return;
  }

  /**
   * Looks for a path matching redirectUrl, calls onRedirect, and navigates back
   */
  const handleNavigationStateChange = route.params.redirectUrl
    ? (event: WebViewNavigation) => {
        if (event.url?.startsWith(route.params.redirectUrl!)) {
          route.params.onRedirect?.(event);
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

  // lazy load
  const WebView = require('react-native-webview').WebView;

  return (
    <Screen hasMaxWidth={false}>
      <WebView
        source={source}
        scrollEnabled={true}
        mixedContentMode="compatibility"
        style={sp.styles.style.bgSecondaryBackground}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => <CenteredLoading />}
        renderError={() => <B1>{sp.i18n.t('failedTryAgain')}</B1>}
      />
    </Screen>
  );
}

export default withErrorBoundaryScreen(WebViewScreen, 'WebViewScreen');
