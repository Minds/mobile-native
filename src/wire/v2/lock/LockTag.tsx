import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import MText from '../../../common/components/MText';
import i18n from '../../../common/services/i18n.service';

type PropsType = {
  type: 'members' | 'paywall' | 'plus';
};

const LockTag = ({ type }: PropsType) => {
  const lockIcon = <Icon name="lock" color="#FFFFFF" />;

  const text =
    type !== 'paywall' ? i18n.t(`wire.lock.${type}`).toUpperCase() : false;

  return (
    <View style={styles.wrapper}>
      {type !== 'plus' && lockIcon}
      {text && (
        <MText
          style={[styles.text, type === 'members' ? styles.spacing : null]}>
          {text}
        </MText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#73737C',
    // paddingVertical: 1,
    paddingHorizontal: 7,
    borderRadius: 2,
    marginRight: 5,
    marginTop: 5,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    height: 20,
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.41,

    elevation: 2,
  },
  text: {
    fontSize: 13,
    fontFamily: 'Roboto_900Black',
    color: '#FFFFFF',
  },
  spacing: {
    marginLeft: 2,
  },
});

export default LockTag;
