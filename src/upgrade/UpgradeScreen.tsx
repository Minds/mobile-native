import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FitScrollView from '../common/components/FitScrollView';
import Header from './Header';
import createUpgradeStore from './createUpgradeStore';
import { UpgradeScreenNavigationProp, UpgradeScreenRouteProp } from './types';
import { IS_FROM_STORE, IS_IOS } from '~/config/Config';
import UpgradeStripeTokens from './UpgradeStripeTokens';
import UpgradeInAppPurchasesTokens from './UpgradeInAppPurchasesTokens';
import { withIAPContext } from 'react-native-iap';
import sp from '~/services/serviceProvider';
import { useWindowDimensions } from 'react-native';

type PropsType = {
  route: UpgradeScreenRouteProp;
  navigation: UpgradeScreenNavigationProp;
};

const UpgradeScreen = observer(({ route }: PropsType) => {
  const localStore = useLocalStore(createUpgradeStore);
  const theme = sp.styles.style;
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { onComplete, pro } = route.params;

  useEffect(() => {
    localStore.init(pro);
  }, [localStore, pro]);

  const topMargin = height / 18;
  const cleanTop = {
    marginTop: insets.top + (IS_IOS ? topMargin : topMargin + 10),
  };

  return (
    <View style={[cleanTop, styles.container, theme.bgSecondaryBackground]}>
      <Header pro={pro} />
      <>
        <FitScrollView>
          {!IS_FROM_STORE ? (
            <UpgradeStripeTokens
              store={localStore}
              pro={!!pro}
              onComplete={onComplete}
            />
          ) : (
            <UpgradeInAppPurchasesTokens
              store={localStore}
              pro={!!pro}
              onComplete={onComplete}
            />
          )}
        </FitScrollView>
      </>
    </View>
  );
});

export default withIAPContext(UpgradeScreen);

export const upgradeToPlus = navigation => {
  return new Promise(resolve =>
    navigation.push('UpgradeScreen', {
      onComplete: (success: boolean) => {
        resolve(!!success);
      },
      pro: false,
    }),
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    overflow: 'hidden',
  },
  buttonRight: {
    alignSelf: 'flex-end',
  },
});
