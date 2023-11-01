import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';

import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import FitScrollView from '../common/components/FitScrollView';
import Header from './Header';
import createUpgradeStore from './createUpgradeStore';
import { UpgradeScreenNavigationProp, UpgradeScreenRouteProp } from './types';
import { Button, Column, H4 } from '~ui';
import { IS_FROM_STORE, IS_IOS } from '~/config/Config';
import UpgradeStripeTokens from './UpgradeStripeTokens';
import UpgradeInAppPurchasesTokens from './UpgradeInAppPurchasesTokens';
import { withIAPContext } from 'react-native-iap';
import { useIsFeatureOn } from 'ExperimentsProvider';

type PropsType = {
  route: UpgradeScreenRouteProp;
  navigation: UpgradeScreenNavigationProp;
};

const UpgradeScreen = observer(({ navigation, route }: PropsType) => {
  const localStore = useLocalStore(createUpgradeStore);
  const theme = ThemedStyles.style;
  const insets = useSafeAreaInsets();
  const { height } = useDimensions().window;
  const { onComplete, pro } = route.params;
  const IOS_IAP_ENABLED = useIsFeatureOn('mob-4990-iap-subscription-ios');

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
      {!IOS_IAP_ENABLED ? (
        <Column top="XL" align="centerBoth" horizontal="L">
          <H4 align="center">
            Sorry, the update is not available on mobile at the moment.
          </H4>
          <Button
            top="XL2"
            mode="outline"
            type="action"
            onPress={navigation.goBack}>
            {i18n.t('close')}
          </Button>
        </Column>
      ) : (
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
      )}
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
