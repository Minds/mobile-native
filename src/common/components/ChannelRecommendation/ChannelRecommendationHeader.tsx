import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';
import FeedListInvisibleHeader from '~/common/components/FeedListInvisibleHeader';
import MenuSheet from '~/common/components/bottom-sheet/MenuSheet';
import { useLegacyStores } from '~/common/hooks/use-stores';
import { B2, H4, Icon, Row } from '~/common/ui';

import { styles as headerStyles } from '~/topbar/Topbar';
import { ChannelRecommendationStore } from './hooks/useChannelRecommendation';
import useChannelRecommendationContext from './hooks/useChannelRecommendationContext';
import sp from '~/services/serviceProvider';

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
  const i18n = sp.i18n;
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
        title: i18n.t('removeFromFeed'),
        onPress: () => dismissal.dismiss('channel-recommendation:feed'),
        iconName: 'close',
        iconType: 'material-community',
      },
    ],
    [dismissal],
  );

  const { alignSelfCenterMaxWidth, bgPrimaryBackground } = sp.styles.style;

  return shouldRender ? (
    <View
      style={[
        alignSelfCenterMaxWidth,
        bgPrimaryBackground,
        shadow ? headerStyles.shadow : undefined,
      ]}>
      <Row align="centerBetween" vertical="L" horizontal="L">
        <H4>{i18n.t('recommendedForYou')}</H4>
        <Row align="centerBoth">
          <B2
            color="link"
            onPress={() => navigation.navigate('SuggestedChannel')}>
            {i18n.t('seeMore')}
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
