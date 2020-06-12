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
  return <LockTag type="plus" />;
});

export default Lock;
