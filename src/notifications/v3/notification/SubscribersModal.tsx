import { RouteProp } from '@react-navigation/core';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import UserModel from '../../../channel/UserModel';
import CenteredLoading from '../../../common/components/CenteredLoading';
import EmptyList from '../../../common/components/EmptyList';
import channelsService from '../../../common/services/channels.service';
import i18nService from '../../../common/services/i18n.service';
import DiscoveryUser from '../../../discovery/DiscoveryUserNew';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import ModalContainer from '../../../onboarding/v2/steps/ModalContainer';
type SubscribersModalRouteProp = RouteProp<
  RootStackParamList,
  'SubscribersModal'
>;

type PropsType = {
  route: SubscribersModalRouteProp;
  navigation: any;
};

const SubscribersModal = ({ route, navigation }: PropsType) => {
  const [subscribers, setSubscribers] = useState<(UserModel | undefined)[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const renderItem = row => {
    if (!row.item) {
      return null;
    }
    return (
      <DiscoveryUser
        navigation={navigation}
        row={row}
        onUserTap={navigation.goBack}
      />
    );
  };

  React.useEffect(() => {
    const getChannels = async () => {
      const channels = await channelsService.getMany(route.params.subscribers);
      setSubscribers(channels);
      setLoading(false);
    };
    getChannels();
  }, [route.params.subscribers]);

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <ModalContainer
      onPressBack={navigation.goBack}
      title={i18nService.t('subscribers')}>
      <FlatList
        data={subscribers}
        renderItem={renderItem}
        keyExtractor={item => item!.guid}
        ListEmptyComponent={<EmptyList />}
      />
    </ModalContainer>
  );
};

export default SubscribersModal;
