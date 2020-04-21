import React, { Component } from 'react';

import { Text, Clipboard, Alert, View, ViewStyle } from 'react-native';
import { CommonStyle as CS } from '../../styles/Common';
import logService from '../services/log.service';
import i18n from '../services/i18n.service';

type PropsType = {
  message: string;
  containerStyle?: ViewStyle;
  children: React.ReactNode;
  textSmall?: boolean;
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
    logService.exception(error);
    this.error = error;
    this.info = info;
  }

  copy = () => {
    Clipboard.setString(
      (this.error?.message || this.error) +
        '\nSTACK:\n' +
        this.info.componentStack,
    );
    Alert.alert(i18n.t('stacktraceCopied'));
  };

  getErrorMessage() {
    const { containerStyle, textSmall } = this.props;

    return (
      <View style={[CS.columnAlignCenter, containerStyle]}>
        <Text
          style={[
            textSmall ? CS.fontS : CS.fontM,
            CS.textCenter,
            CS.marginTop2x,
            CS.fontHairline,
            CS.colorDanger,
          ]}
          onPress={this.copy}>
          {this.props.message || i18n.t('errorDisplaying')}
        </Text>
        <Text
          style={[
            textSmall ? CS.fontXS : CS.fontS,
            CS.textCenter,
            CS.marginTop2x,
            CS.marginBottom2x,
            CS.fontHairline,
          ]}
          onPress={this.copy}>
          {i18n.t('tapCopyError')}
        </Text>
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
export const withErrorBoundary = (
  WrappedComponent,
  message = '',
  small = false,
) => (props) => {
  if (!message) message = i18n.t('errorDisplaying');
  return (
    <ErrorBoundary message={message} textSmall={small}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
};
