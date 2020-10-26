//@ts-nocheck
import React, { Component } from 'react';

import { Text, StyleSheet, View } from 'react-native';

import { observer } from 'mobx-react';

import connectivityService from '../services/connectivity.service';

import Button from './Button';
import i18n from '../services/i18n.service';
import { CommonStyle as CS } from '../../styles/Common';

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
    return (
      <View
        style={[
          CS.padding3x,
          CS.flexColumnCentered,
          CS.marginTop2x,
          this.props.inverted
            ? styles.errorLoadingInverted
            : styles.errorLoading,
        ]}>
        <Text style={[CS.fontM, CS.colorDarkGreyed, CS.marginBottom]}>
          <Text style={CS.fontSemibold}>{i18n.t('ops')}</Text>{' '}
          {this.props.message}
        </Text>
        {!connectivityService.isConnected && (
          <Text style={[CS.fontM, CS.colorDarkGreyed, CS.marginBottom]}>
            {' '}
            {i18n.t('noInternet')}
          </Text>
        )}
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
