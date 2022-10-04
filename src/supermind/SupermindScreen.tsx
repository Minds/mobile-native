import { RouteProp, useNavigation } from '@react-navigation/core';
import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView } from 'react-native';
import { showNotification } from '../../AppMessages';
import CenteredLoading from '../common/components/CenteredLoading';
import useApiFetch from '../common/hooks/useApiFetch';
import { Screen, ScreenHeader } from '../common/ui';
import { AppStackParamList } from '../navigation/NavigationTypes';
import SupermindRequest from './SupermindRequest';
import SupermindRequestModel from './SupermindRequestModel';

interface SupermindScreenProps {
  route: RouteProp<AppStackParamList, 'Supermind'>;
}

export default observer(function SupermindScreen({
  route,
}: SupermindScreenProps) {
  const navigation = useNavigation();
  let { supermind, loading, error } = useSupermind(route.params.guid);

  if (!supermind && route.params.supermindRequest) {
    supermind = SupermindRequestModel.checkOrCreate(
      route.params.supermindRequest,
    );
  }

  if (error && !supermind) {
    showNotification('Supermind not found', 'danger');
    navigation.goBack();
  }

  return (
    <Screen safe>
      <ScrollView>
        <ScreenHeader title="Supermind" back />
        {!supermind && loading && <CenteredLoading />}
        {supermind && <SupermindRequest request={supermind} />}
      </ScrollView>
    </Screen>
  );
});

const useSupermind = (guid: string) => {
  const store = useApiFetch<SupermindRequestModel>('/api/v3/supermind/' + guid);

  return {
    ...store,
    supermind: store.result?.[0]
      ? SupermindRequestModel.create(store.result[0])
      : undefined,
  };
};
