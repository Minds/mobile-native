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
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

interface SupermindScreenProps {
  route: RouteProp<AppStackParamList, 'Supermind'>;
}

export default withErrorBoundaryScreen(
  observer(function SupermindScreen({ route }: SupermindScreenProps) {
    const navigation = useNavigation();
    const { supermindRequest, guid } = route.params ?? {};
    let { supermind, loading, error } = useSupermind(guid);

    if (!supermind && supermindRequest) {
      supermind = SupermindRequestModel.checkOrCreate(supermindRequest);
    }

    if (error && !supermind) {
      showNotification('Supermind not found', 'danger');
      navigation.goBack();
    }

    return (
      <Screen safe>
        <ScrollView>
          <ScreenHeader title="Supermind" back />
          {supermind ? (
            <SupermindRequest request={supermind} />
          ) : (
            loading && <CenteredLoading />
          )}
        </ScrollView>
      </Screen>
    );
  }),
  'SupermindScreen',
);

const useSupermind = (guid: string) => {
  const store = useApiFetch<SupermindRequestModel>('/api/v3/supermind/' + guid);

  return {
    ...store,
    supermind: store.result?.[0]
      ? SupermindRequestModel.create(store.result[0])
      : undefined,
  };
};
