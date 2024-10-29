import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';
import FeedListInvisibleHeader from '~/common/components/FeedListInvisibleHeader';
import MenuSheet from '~/common/components/bottom-sheet/MenuSheet';
import { B2, H4, Icon, Row } from '~/common/ui';

import { styles as headerStyles } from '~/topbar/Topbar';
import useDismissibility from './hooks/useDismissibility';
import { RecommendationType } from './types';
import sp from '~/services/serviceProvider';

type PropsType = {
  type: RecommendationType;
  location: 'feed' | 'channel';
  shadow?: boolean;
};

function RecommendationHeader({ type, location, shadow }: PropsType) {
  const navigation = useNavigation();
  const { dismiss, shouldRender, dismissible } = useDismissibility(
    type,
    location,
  );
  const i18n = sp.i18n;

  const sheetOptions = React.useMemo(
    () => [
      {
        title: i18n.t('removeFromFeed'),
        onPress: dismiss,
        iconName: 'close',
        iconType: 'material-community',
      },
    ],
    [dismiss, i18n],
  );

  return shouldRender ? (
    <View
      style={
        shadow
          ? [sp.styles.style.bgPrimaryBackground, headerStyles.shadow]
          : sp.styles.style.bgPrimaryBackground
      }>
      <Row align="centerBetween" vertical="L" horizontal="L">
        <H4>{i18n.t('recommendedForYou')}</H4>
        <Row align="centerBoth">
          <B2
            color="link"
            onPress={() => {
              type === 'channel'
                ? navigation.navigate('SuggestedChannel')
                : navigation.navigate('GroupsDiscovery');
            }}>
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

export default observer(RecommendationHeader);
