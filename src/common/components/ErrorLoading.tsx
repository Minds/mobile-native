import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';

import MText from './MText';
import { B1, ButtonComponent } from '../ui';
import sp from '~/services/serviceProvider';

// types
type Props = {
  message: any;
  inverted?: boolean;
  tryAgain: () => any;
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
    const theme = sp.styles.style;
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
          {!sp.resolve('connectivity').isConnected && (
            <MText style={[theme.fontM, theme.colorSecondaryText]}>
              {sp.i18n.t('noInternet')}
            </MText>
          )}
        </B1>
        <ButtonComponent onPress={this.props.tryAgain} align="center">
          {sp.i18n.t('tryAgain')}
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
