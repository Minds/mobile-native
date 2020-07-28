import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ComponentsStyle } from '../styles/Components';
import Button from '../common/components/Button';
import i18n from '../common/services/i18n.service';

type PropsType = {
  onNext?: () => void;
  saving: boolean;
};

export default function OnboardingButtons(props: PropsType) {
  return (
    <View style={styles.bottom}>
      <Button
        onPress={props.onNext}
        //@ts-ignore
        borderRadius={2}
        containerStyle={ComponentsStyle.loginButtonNew}
        testID="wizardNext"
        loading={props.saving}>
        <Text style={ComponentsStyle.loginButtonTextNew}>
          {i18n.t('continue')}
        </Text>
      </Button>
      <TouchableOpacity style={styles.skip} onPress={props.onNext}>
        <Text style={styles.skipText}>{i18n.t('onboarding.skipStep')}</Text>
      </TouchableOpacity>
    </View>
  );
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
