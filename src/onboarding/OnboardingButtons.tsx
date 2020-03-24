import React, {Component} from 'react';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ComponentsStyle} from '../styles/Components';
import Button from '../common/components/Button';
import i18n from '../common/services/i18n.service';

export default class OnboardingButtons extends Component {
  render() {
    return (
      <View style={styles.bottom}>
        <Button
          onPress={this.props.onNext}
          borderRadius={2}
          containerStyle={ComponentsStyle.loginButtonNew}
          testID="wizardNext"
          loading={this.props.saving}>
          <Text style={ComponentsStyle.loginButtonTextNew}>
            {i18n.t('continue')}
          </Text>
        </Button>
        <TouchableOpacity style={styles.skip} onPress={this.props.onNext}>
          <Text style={styles.skipText}>{i18n.t('onboarding.skipStep')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
  },
  skip: {
    backgroundColor: 'transparent',
    borderRadius: 2,
    paddingHorizontal: 30,
    paddingVertical: 5,
    marginTop: 5,
  },
  skipText: {
    color: '#AEB0B8',
    fontSize: 16,
    lineHeight: 21,
    alignSelf: 'center',
  },
});
