import { NavigationProp } from '@react-navigation/core';
import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import ChannelBadges from '~/channel/badges/ChannelBadges';
import UserModel from '~/channel/UserModel';
import MPressable from '~/common/components/MPressable';
import { Avatar, B1, Column, Row } from '~/common/ui';
import Activity from '~/newsfeed/activity/Activity';
import ActivityModel from '~/newsfeed/ActivityModel';
import ThemedStyles from '~/styles/ThemedStyles';
import { useTranslation } from '../../../locales';
import BoostModel from '../../../models/BoostModelV3';
import { BoostStatus } from '../../types/BoostConsoleBoost';
import BoostActionBar from './BoostActionBar';
import BoostHeader from './BoostHeader';

interface BoostProps {
  boost: BoostModel;
  navigation: NavigationProp<any>;
}

/**
 * Boost console item
 */
function Boost({ boost, navigation }: BoostProps) {
  return (
    <View style={styles.container}>
      <BoostHeader boost={boost} />
      <BoostEntity boost={boost} navigation={navigation} />
      {boost.boost_status === BoostStatus.REJECTED ? (
        <Rejection />
      ) : (
        <BoostActionBar boost={boost} />
      )}
    </View>
  );
}

const BoostEntity = ({ boost, navigation }: BoostProps) => {
  const { t } = useTranslation();
  const entity = boost.entity;

  if (!entity) {
    return null;
  }

  const renderActivity = () => (
    <Activity
      entity={ActivityModel.create(entity)}
      hideTabs={true}
      navigation={navigation}
      borderless
    />
  );

  const renderUser = () => {
    const user = UserModel.create(entity);
    return (
      <Column>
        <MPressable
          onPress={() =>
            navigation.navigate('Channel', {
              guid: user.guid,
              entity: user,
            })
          }>
          <Row vertical="M" horizontal="L" align="centerBoth">
            <Avatar source={user.getAvatarSource()} size={'small'} />
            <Column align="centerStart" left="M" flex>
              <B1 font="bold">{user.name}</B1>
              <B1>@{user.username}</B1>
            </Column>
            <ChannelBadges channel={user} />
          </Row>
        </MPressable>

        <Row horizontal="L" bottom="M">
          <B1 color="secondary">{user.briefdescription}</B1>
        </Row>
      </Column>
    );
  };

  switch (entity.type) {
    case 'activity':
      return renderActivity();
    case 'user':
      return renderUser();
    default:
      return (
        <B1 horizontal="L" vertical="L" color="secondary">
          {t('Entity {{type}} {{subtype}} not supported', {
            type: entity.type,
            subtype: entity.subtype,
          })}
        </B1>
      );
  }
};

const Rejection = () => {
  const { t } = useTranslation();

  return (
    <Column horizontal="L" bottom="L">
      <B1 font="bold">{t('Reason for rejection')}</B1>
      <B1>
        {t('Did not meet the acceptance criteria for the selected audience')}
      </B1>
    </Column>
  );
};

const styles = ThemedStyles.create({
  container: ['flexContainer', 'borderHair', 'bcolorPrimaryBorder'],
});

export default observer(Boost);
