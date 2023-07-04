import { RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import DismissKeyboard from '~/common/components/DismissKeyboard';
import ModalScreen from '~/common/components/ModalScreen';
import TopbarTabbar, {
  TabType,
} from '~/common/components/topbar-tabbar/TopbarTabbar';
import { useStores } from '~/common/hooks/use-stores';
import i18n from '~/common/services/i18n.service';
import { IS_IOS } from '../../config/Config';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import ThemedStyles from '../../styles/ThemedStyles';

import Link from '~/common/components/Link';
import { Typography } from '~/common/ui/typography/Typography';
import openUrlService from '~/common/services/open-url.service';
import { Icon, Row } from '~/common/ui';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

type BoostTabType = 'cash' | 'tokens';

type BoostScreenRouteProp = RouteProp<RootStackParamList, 'BoostScreen'>;

type BoostScreenProps = {
  route: BoostScreenRouteProp;
};

const BoostScreen = withErrorBoundaryScreen(
  observer(({ route }: BoostScreenProps) => {
    const { boostType } = route.params || {};
    const theme = ThemedStyles.style;
    const wallet = useStores().wallet;

    const tabs: Array<TabType<BoostTabType>> = [
      { id: 'cash', title: i18n.t('wallet.cash') },
      { id: 'tokens', title: i18n.t('tokens') },
    ];

    const titleMapping = {
      channel: i18n.t('boosts.boostChannel'),
      post: i18n.t('boosts.boostPost'),
      offer: i18n.t('boosts.boostOffer'),
    };

    useEffect(() => {
      wallet.loadOffchainAndReceiver();
    }, [wallet]);

    return (
      <ModalScreen
        title={titleMapping[boostType]}
        source={require('../../assets/boostBG.png')}
        testID="BoostScreen">
        <BoostNote />
        <DismissKeyboard>
          {!IS_IOS && (
            <View style={theme.marginTop2x}>
              <TopbarTabbar tabs={tabs} onChange={() => null} />
            </View>
          )}
        </DismissKeyboard>
      </ModalScreen>
    );
  }),
  'BoostScreen',
);

export default BoostScreen;

function BoostNote() {
  return (
    <View style={styles.container}>
      <Row vertical="M">
        <Icon
          name="info-circle"
          color="PrimaryText"
          style={styles.icon}
          size={32}
        />
        <Typography type="H3" font="bold">
          {i18n.t('boosts.boostChangingTitle')}
        </Typography>
      </Row>
      <Typography type="B1">
        {i18n.t('boosts.boostChangingText')}
        <Link
          onPress={() =>
            openUrlService.openLinkInInAppBrowser(
              'https://www.minds.com/info/blog/bid-farewell-the-boost-backlog-1445548466339057665',
            )
          }>
          {i18n.t('boosts.boostChangingLink')}
        </Link>
      </Typography>
    </View>
  );
}

const styles = ThemedStyles.create({
  container: ['marginTop8x', 'marginHorizontal4x'],
  icon: ['marginRight4x'],
});
