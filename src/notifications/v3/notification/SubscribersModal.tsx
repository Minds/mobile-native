import { RouteProp } from '@react-navigation/core';
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import UserModel from '../../../channel/UserModel';
import i18n from '../../../common/services/i18n.service';
import DiscoveryUser from '../../../discovery/DiscoveryUserNew';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import ThemedStyles from '../../../styles/ThemedStyles';

type SubscribersModalRouteProp = RouteProp<
  RootStackParamList,
  'SubscribersModal'
>;

type PropsType = {
  route: SubscribersModalRouteProp;
  navigation: any;
};

const SubscribersModal = ({ route, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const subscribers = route.params.subscribers;
  const renderItem = row => {
    return <DiscoveryUser navigation={navigation} row={row} />;
  };
  return (
    <FlatList
      data={subscribers}
      renderItem={renderItem}
      keyExtractor={item => item.guid}
      style={theme.flexContainer}
    />
  );
};

export default SubscribersModal;
