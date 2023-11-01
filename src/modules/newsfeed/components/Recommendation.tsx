import { observer } from 'mobx-react';
import React, { FC, useState } from 'react';
import { View } from 'react-native';
import UserModel from '~/channel/UserModel';
import { B2, H4, Row, Icon, Spacer } from '~/common/ui';
import GroupsListItem from '~/groups/GroupsListItem';
import ThemedStyles from '~/styles/ThemedStyles';

import ChannelRecommendationItem from '~/modules/recommendation/Recommendation/components/ChannelRecommendationItem';
import GroupModel from '~/groups/GroupModel';
import { styles as headerStyles } from '~/topbar/Topbar';
import {
  RecommendationLocation,
  RecommendationType,
} from '~/modules/recommendation';
import useDismissible from '~/services/hooks/useDismissable';
import i18n from '~/common/services/i18n.service';
import { useNavigation } from '@react-navigation/native';
import MenuSheet from '~/common/components/bottom-sheet/MenuSheet';

export interface RecommendationProps {
  type: RecommendationType;
  location: RecommendationLocation;

  entities: Array<UserModel | GroupModel>;
  shadow?: boolean;
  size?: number;
}

const Recommendation: FC<RecommendationProps> = ({
  type,
  location,
  size = 4,
  shadow,
  entities,
}) => {
  const [listSize, setListSize] = useState(size);

  const { isDismissed, dismiss } = useDismissible(
    `recommendation:${type}:${location}`,
  );

  if (isDismissed && entities.length) {
    return null;
  }

  const onSubscribed = () => {
    if (listSize === size) {
      setListSize(size + 2);
    }
  };

  const dismissible = location !== 'channel';

  const list =
    entities.length > listSize
      ? entities
          .slice(0, listSize)
          .filter(reco =>
            reco instanceof UserModel ? !reco.subscribed : !reco['is:member'],
          )
      : entities;

  return (
    <>
      <Header
        shadow={shadow}
        type={type}
        dismiss={dismiss}
        dismissible={dismissible}
      />
      <Spacer bottom="XL">
        {list.map((entity, index) =>
          entity instanceof UserModel ? (
            <ChannelRecommendationItem
              key={entity.guid}
              channel={entity}
              onSubscribed={onSubscribed}
            />
          ) : (
            <GroupsListItem
              key={entity.guid}
              group={entity}
              index={index}
              onPress={onSubscribed}
            />
          ),
        )}
      </Spacer>
      <View style={styles.borderBottom} />
    </>
  );
};

const Header = observer(
  ({
    shadow,
    type,
    dismissible,
    dismiss,
  }: {
    shadow?: boolean;
    dismissible?: boolean;
    type: RecommendationType;
    dismiss?: () => void;
  }) => {
    const navigation = useNavigation();
    const sheetOptions = React.useMemo(
      () => [
        {
          title: i18n.t('removeFromFeed'),
          onPress: dismiss,
          iconName: 'close',
          iconType: 'material-community',
        },
      ],
      [dismiss],
    );
    return (
      <View
        style={
          shadow
            ? [ThemedStyles.style.bgPrimaryBackground, headerStyles.shadow]
            : ThemedStyles.style.bgPrimaryBackground
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
    );
  },
);

const styles = ThemedStyles.create({
  borderBottom: ['borderBottom6x', 'bcolorBaseBackground'],
});

export default observer(Recommendation);
