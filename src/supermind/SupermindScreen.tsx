import { RouteProp } from '@react-navigation/core';
import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView } from 'react-native';
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
  let { supermind, loading } = useSupermind(route.params.guid);

  if (!supermind && route.params.supermindRequest) {
    supermind = route.params.supermindRequest;
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
  const store = useApiFetch<SupermindRequestModel>(
    '/api/v3/supermind/' + guid,
    {
      map: data => SupermindRequestModel.create(data),
    },
  );

  return {
    ...store,
    supermind: store.result,
  };
};
