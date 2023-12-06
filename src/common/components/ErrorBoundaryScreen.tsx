import React, { Component } from 'react';

import { View } from 'react-native';
import logService from '../services/log.service';
import i18n from '../services/i18n.service';
import { showNotification } from '../../../AppMessages';
import Clipboard from '@react-native-clipboard/clipboard';
import ThemedStyles from '../../styles/ThemedStyles';
import { Button } from '../ui/buttons';
import { B2, H1, H4 } from '../ui';

type PropsType = {
  screenName?: string;
  children: React.ReactNode;
  navigation?: any;
};

type StateType = {
  hasError: boolean;
};

export default class ErrorBoundaryScreen extends Component<
  PropsType,
  StateType
> {
  error?: Error;
  info: any;
  state = {
    hasError: false,
  } as StateType;

  constructor(props: PropsType) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info) {
    logService.exception({ screen: this.props.screenName, ...error });
    this.error = error;
    this.info = info;
  }

  copy = () => {
    Clipboard.setString(
      (this.error?.message || this.error) +
        `\nSTACK:\nScreen: ${this.props.screenName}\n` +
        this.info.componentStack,
    );
    showNotification(i18n.t('stacktraceCopied'));
  };

  render() {
    const theme = ThemedStyles.style;
    return this.state.hasError ? (
      <View style={[theme.flexColumnCentered]}>
        <H1 vertical="L">{i18n.t('sorry')}</H1>
        <H4 vertical="M">{i18n.t('errorDisplaying')}</H4>
        <B2 bottom="L" onPress={this.copy} align="center">
          {i18n.t('tapCopyError')}
          {'\n'}
          {i18n.t('and')}
        </B2>
        <Button
          vertical="L"
          mode="solid"
          type="warning"
          onPress={this.props.navigation?.goBack}>
          {i18n.t(this.props.navigation ? 'goback' : 'restart')}
        </Button>
      </View>
    ) : (
      this.props.children
    );
  }
}

/**
 * With error boundary screen HOC
 * @param {Component} WrappedComponent
 * @param {string} screenName
 */
export const withErrorBoundaryScreen =
  (WrappedComponent, screenName = 'unknown screen') =>
  props => {
    return (
      <ErrorBoundaryScreen
        screenName={screenName}
        navigation={props.navigation}>
        <WrappedComponent {...props} />
      </ErrorBoundaryScreen>
    );
  };
