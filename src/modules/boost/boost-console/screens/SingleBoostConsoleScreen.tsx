import React from 'react';
import { observer, useLocalStore } from 'mobx-react-lite';

import { Screen, ScreenHeader } from '~/common/ui';
import { useTranslation } from '../../locales';
import { AppStackScreenProps } from '~/navigation/NavigationTypes';
import CenteredLoading from '~/common/components/CenteredLoading';
import BoostV3 from '../components/v3/Boost';
import { getSingleBoost } from '../boost-console.api';
import BoostModelV3 from '../../models/BoostModelV3';
import sp from '~/services/serviceProvider';

type PropsType = AppStackScreenProps<'SingleBoostConsole'>;

const SingleBoostConsoleScreen = observer(
  ({ navigation, route }: PropsType) => {
    const { t } = useTranslation();
    const store = useLocalStore(localStore);

    const guid = route.params?.guid;

    React.useEffect(() => {
      guid ? store.load(guid) : navigation.goBack();
    }, [guid, navigation, store]);

    return (
      <Screen safe onlyTopEdge scroll>
        <ScreenHeader title={t('Boost')} back />
        {store.loading && <CenteredLoading />}
        {store.boost && <BoostV3 boost={store.boost} />}
      </Screen>
    );
  },
);

export default SingleBoostConsoleScreen;

function localStore() {
  return {
    loading: false,
    boost: null as null | BoostModelV3,
    async load(guid: string) {
      this.loading = true;
      try {
        this.boost = (await getSingleBoost(guid)) || null;
      } catch (error) {
        sp.log.exception(error);
      } finally {
        this.loading = false;
      }
    },
  };
}
