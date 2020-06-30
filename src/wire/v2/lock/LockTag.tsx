import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../../common/services/i18n.service';

type PropsType = {
  type: 'members' | 'paywall' | 'plus';
};

const LockTag = ({ type }: PropsType) => {
  const theme = ThemedStyles.style;
  const lockIcon = <Icon name="lock" color="#FFFFFF" />;

  const text = type !== 'paywall' ? i18n.t(`wire.lock.${type}`) : false;

  return (
    <View
      style={[
        styles.wraper,
        theme.alignCenter,
        type === 'plus' ? styles.bgRed : styles.bgGray,
      ]}>
      {type !== 'plus' && lockIcon}
      {text && (
        <Text style={[styles.text, type === 'members' ? styles.spacing : null]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wraper: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 9,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 2,
    marginRight: 5,
    marginTop: 5,
    flexDirection: 'row',
  },
  bgGray: {
    backgroundColor: '#7D7D82',
  },
  bgRed: {
    backgroundColor: '#E03C20',
  },
  text: {
    fontSize: 12,
    fontFamily: 'Roboto-Black',
    color: '#FFFFFF',
  },
  spacing: {
    marginLeft: 2,
  },
});

export default LockTag;
