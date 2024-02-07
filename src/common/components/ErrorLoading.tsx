//@ts-nocheck
import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';

import { observer } from 'mobx-react';

import connectivityService from '../services/connectivity.service';

import i18n from '../services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from './MText';
import { B1, ButtonComponent } from '../ui';

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
        <B1 font="bold" bottom="XL" align="center">
          {this.props.message}
          {'. '}
          {!connectivityService.isConnected && (
            <MText style={[theme.fontM, theme.colorSecondaryText]}>
              {i18n.t('noInternet')}
            </MText>
          )}
        </B1>
        <ButtonComponent onPress={this.props.tryAgain} align="center">
          {i18n.t('tryAgain')}
        </ButtonComponent>
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
