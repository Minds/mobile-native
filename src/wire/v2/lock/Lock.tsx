import React from 'react';
import { observer } from 'mobx-react';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedStyles from '../../../styles/ThemedStyles';
import LockTag from './LockTag';

type PropsType = {
  entity: ActivityModel;
  navigation: any;
};

const Lock = observer(({ entity, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  return (
    <View
      style={[
        styles.mask,
        theme.backgroundSeparator,
        theme.alignJustifyCenter,
        theme.padding2x,
      ]}>
      <LockTag type="plus" />
    </View>
  );
});

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    bottom: 0,
    height: '100%',
    width: '100%',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Lock;
