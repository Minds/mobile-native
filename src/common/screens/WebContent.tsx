import { RouteProp } from '@react-navigation/core';
import React from 'react';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import ThemedStyles from '../../styles/ThemedStyles';
import { ModalFullScreen } from '../ui';
import { withErrorBoundaryScreen } from '../components/ErrorBoundaryScreen';
import Markdown from 'react-native-markdown-display';
import { ScrollView, StyleSheet } from 'react-native';
import { useAuxPagesQuery } from '~/graphql/strapi';
import { MINDS_URI } from '~/config/Config';

type WebContentScreenRouteProp = RouteProp<RootStackParamList, 'WebContent'>;

type WebContentScreenProps = {
  route: WebContentScreenRouteProp;
};

const MINDS_URI_P = MINDS_URI + 'p/';

function WebContentScreen({ route }: WebContentScreenProps) {
  const path = route.params.path?.replace(MINDS_URI_P, '');
  const { data, isLoading } = useAuxPagesQuery({ path });

  const {
    body = 'Resource could not be retrieved. If the problem persists please contact us.',
    h1 = 'Resource not found',
  } = data?.auxPages?.data?.[0]?.attributes ?? {};

  if (!route.params || isLoading) {
    return;
  }

  return (
    <ModalFullScreen back title={h1}>
      <ScrollView style={styles.scrollView}>
        <Markdown style={styles}>{fixDeepLinks(body)}</Markdown>
      </ScrollView>
    </ModalFullScreen>
  );
}

const fixDeepLinks = (url: string) => url.replace(/\]\(\//g, '](mindsapp://');

const styles = ThemedStyles.create({
  scrollView: ['flexContainer', 'padding3x'],
  body: ['colorPrimaryText', 'fontLM'],
  link: ['link', 'bold'],
}) as StyleSheet.NamedStyles<any>;

export default withErrorBoundaryScreen(WebContentScreen, 'WebContentScreen');
