import React, { Component } from 'react';

import { View } from 'react-native';
import { showNotification } from '../../../AppMessages';
import * as Clipboard from 'expo-clipboard';
import { Button } from '../ui/buttons';
import { B2, H1, H4 } from '../ui';
import sp from '~/services/serviceProvider';

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
    sp.log.exception({ screen: this.props.screenName, ...error });
    this.error = error;
    this.info = info;
  }

  copy = () => {
    Clipboard.setStringAsync(
      (this.error?.message || this.error) +
        `\nSTACK:\nScreen: ${this.props.screenName}\n` +
        this.info.componentStack,
    );
    showNotification(sp.i18n.t('stacktraceCopied'));
  };

  render() {
    const theme = sp.styles.style;
    return this.state.hasError ? (
      <View style={[theme.flexColumnCentered]}>
        <H1 vertical="L">{sp.i18n.t('sorry')}</H1>
        <H4 vertical="M">{sp.i18n.t('errorDisplaying')}</H4>
        <B2 bottom="L" onPress={this.copy} align="center">
          {sp.i18n.t('tapCopyError')}
          {'\n'}
          {sp.i18n.t('and')}
        </B2>
        <Button
          vertical="L"
          mode="solid"
          type="warning"
          onPress={this.props.navigation?.goBack}>
          {sp.i18n.t(this.props.navigation ? 'goback' : 'restart')}
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
