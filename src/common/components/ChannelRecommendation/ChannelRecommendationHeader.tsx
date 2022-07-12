import React from 'react';

import { B2, H4, Row, Icon } from '~/common/ui';
import i18nService from '~/common/services/i18n.service';
import { useNavigation } from '@react-navigation/native';
import { useLegacyStores } from '~/common/hooks/use-stores';
import MenuSheet from '../bottom-sheet/MenuSheet';
import ThemedStyles from '~/styles/ThemedStyles';
import { View } from 'react-native';

type PropsType = {
  location: string;
};

export default function ChannelRecommendationHeader({ location }: PropsType) {
  const navigation = useNavigation();
  const { dismissal } = useLegacyStores();
  const dismissible = location !== 'channel';
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
  return (
    <View style={ThemedStyles.style.bgPrimaryBackground}>
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
  );
}
