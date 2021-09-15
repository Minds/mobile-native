//@ts-nocheck
import React, { Component } from 'react';

import { Text, StyleSheet, View } from 'react-native';

import { observer } from 'mobx-react';

import connectivityService from '../services/connectivity.service';

import Button from './Button';
import i18n from '../services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

// types
type Props = {
  message: any;
  inverted?: boolean;
  tryAgain: Function;
};

/**
 * Error loading component
 */
@observer
export default class ErrorLoading extends Component<Props> {
  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    return (
      <View
        style={[
          theme.padding3x,
          theme.flexColumnCentered,
          theme.marginTop2x,
          this.props.inverted
            ? styles.errorLoadingInverted
            : styles.errorLoading,
        ]}>
        <Text style={[theme.fontSemibold, theme.marginBottom]}>
          {i18n.t('ops')}
        </Text>
        <Text
          style={[theme.fontM, theme.colorSecondaryText, theme.marginBottom2x]}>
          {this.props.message}
          {'. '}
          {!connectivityService.isConnected && (
            <Text style={[theme.fontM, theme.colorSecondaryText]}>
              {i18n.t('noInternet')}
            </Text>
          )}
        </Text>
        <Button onPress={this.props.tryAgain} text={i18n.t('tryAgain')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorLoading: {
    marginBottom: 120,
  },
  errorLoadingInverted: {
    marginTop: 120,
  },
});
