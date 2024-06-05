import { Linking, ScrollView } from 'react-native';
import React from 'react';
import { H4, ModalFullScreen } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import CenteredLoading from '~/common/components/CenteredLoading';
import Markdown from 'react-native-markdown-display';
import { RootStackScreenProps } from '~/navigation/NavigationTypes';
import { CustomPageType } from '../types';
import useCustomPage from '../hooks/useCustomPage';
import { showNotification } from 'AppMessages';

type CustomPageScreenProps = RootStackScreenProps<'CustomPages'>;

export default function CustomPageScreen({
  route: { params },
  navigation: { goBack },
}: CustomPageScreenProps) {
  const config = {
    'privacy-policy': {
      pageType: CustomPageType.PRIVACY_POLICY,
      title: 'Policy',
    },
    'terms-of-service': {
      pageType: CustomPageType.TERMS_OF_SERVICE,
      title: 'Terms',
    },
    'community-guidelines': {
      pageType: CustomPageType.COMMUNITY_GUIDELINES,
      title: 'Community guidelines',
    },
  }[params.page];

  const { customPage, isLoading, error } = useCustomPage(config?.pageType);

  if (!config) {
    console.warn('Unknown custom page type', params.page);
    showNotification('Page not found');
    goBack();
    return null;
  }

  if (customPage?.externalLink) {
    Linking.openURL(customPage.externalLink);
    goBack();
    return null;
  }

  return (
    <ModalFullScreen back title={config.title || params.title || ''}>
      {isLoading ? (
        <CenteredLoading />
      ) : error ? (
        <H4>Loading failed, please try again.</H4>
      ) : (
        <ScrollView style={styles.scrollView}>
          <Markdown style={styles}>{customPage?.content}</Markdown>
        </ScrollView>
      )}
    </ModalFullScreen>
  );
}

const styles = ThemedStyles.create({
  scrollView: ['flexContainer', 'padding3x'],
  body: ['colorPrimaryText', 'fontLM'],
  link: ['link', 'bold'],
});
