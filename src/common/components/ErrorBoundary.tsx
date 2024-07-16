import React, { Component } from 'react';

import { View, ViewStyle } from 'react-native';
import { showNotification } from '../../../AppMessages';
import * as Clipboard from 'expo-clipboard';

import MText from './MText';
import sp from '~/services/serviceProvider';

type PropsType = {
  message?: string;
  containerStyle?: ViewStyle | Array<ViewStyle>;
  children: React.ReactNode;
  textSmall?: boolean;
  fallback?: any;
};

type StateType = {
  hasError: boolean;
};

/**
 * Error boundary
 */
export default class ErrorBoundary extends Component<PropsType, StateType> {
  error?: Error;
  info: any;
  state = {
    hasError: false,
  } as StateType;

  /**
   * Constructors
   * @param props
   */
  constructor(props: PropsType) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   *
   * @param error
   */
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info) {
    sp.log.exception(error);
    this.error = error;
    this.info = info;
  }

  copy = () => {
    Clipboard.setStringAsync(
      (this.error?.message || this.error) +
        '\nSTACK:\n' +
        this.info.componentStack,
    );
    showNotification(sp.i18n.t('stacktraceCopied'));
  };

  getErrorMessage() {
    const { containerStyle, textSmall, fallback } = this.props;
    const theme = sp.styles.style;
    const i18n = sp.i18n;
    if (fallback) {
      return fallback;
    }

    return (
      <View style={[theme.columnAlignCenter, containerStyle]}>
        <MText
          style={[
            textSmall ? theme.fontM : theme.fontM,
            theme.textCenter,
            theme.marginTop2x,
            theme.colorSecondaryText,
          ]}
          onPress={this.copy}>
          {this.props.message || i18n.t('errorDisplaying')}
        </MText>
        <MText
          style={[
            textSmall ? theme.fontXS : theme.fontS,
            theme.textCenter,
            theme.marginTop2x,
            theme.marginBottom2x,
            theme.fontHairline,
          ]}
          onPress={this.copy}>
          {i18n.t('tapCopyError')}
        </MText>
      </View>
    );
  }

  /**
   * Render
   */
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.getErrorMessage();
    }

    return this.props.children;
  }
}

/**
 * With error boundary HOC
 * @param {Component} WrappedComponent
 * @param {string} message
 * @param {boolean} small
 */
export const withErrorBoundary =
  (WrappedComponent, message = '', small = false) =>
  props => {
    if (!message) {
      message = sp.i18n.t('errorDisplaying');
    }
    return (
      <ErrorBoundary message={message} textSmall={small}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
