import React from 'react';
import { View } from 'react-native';
import { styles as headerStyles } from '~/topbar/Topbar';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';

import { B2, H4, Row, Icon } from '~/common/ui';
import i18nService from '~/common/services/i18n.service';
import { useLegacyStores } from '~/common/hooks/use-stores';
import MenuSheet from '../bottom-sheet/MenuSheet';
import ThemedStyles from '~/styles/ThemedStyles';
import useChannelRecommendationContext from './hooks/useChannelRecommendationContext';
import FeedListInvisibleHeader from '../FeedListInvisibleHeader';
import { ChannelRecommendationStore } from './hooks/useChannelRecommendation';

type PropsType = {
  location: string;
  shadow?: boolean;
  recommendationStore?: ChannelRecommendationStore;
};

function ChannelRecommendationHeader({
  location,
  shadow,
  recommendationStore,
}: PropsType) {
  const navigation = useNavigation();
  const { dismissal } = useLegacyStores();
  const dismissible = location !== 'channel';
  const recommendation =
    useChannelRecommendationContext() || recommendationStore;

  const shouldRender =
    Boolean(recommendation?.result?.entities.length) &&
    (dismissible
      ? !dismissal.isDismissed('channel-recommendation:feed')
      : true);

  const sheetOptions = React.useMemo(
    () => [
      {
        title: i18nService.t('removeFromFeed'),
        onPress: () => dismissal.dismiss('channel-recommendation:feed'),
        iconName: 'close',
        iconType: 'material-community',
      },
    ],
    [dismissal],
  );

  const { alignSelfCenterMaxWidth, bgPrimaryBackground } = ThemedStyles.style;

  return shouldRender ? (
    <View
      style={[
        alignSelfCenterMaxWidth,
        bgPrimaryBackground,
        shadow ? headerStyles.shadow : undefined,
      ]}>
      <Row align="centerBetween" vertical="L" horizontal="L">
        <H4>{i18nService.t('recommendedChannels')}</H4>
        <Row align="centerBoth">
          <B2
            color="link"
            onPress={() => navigation.navigate('SuggestedChannel')}>
            {i18nService.t('seeMore')}
          </B2>

          {dismissible && (
            <MenuSheet items={sheetOptions}>
              <Icon name="more" size="large" left="M" />
            </MenuSheet>
          )}
        </Row>
      </Row>
    </View>
  ) : (
    <FeedListInvisibleHeader />
  );
}

export default observer(ChannelRecommendationHeader);
