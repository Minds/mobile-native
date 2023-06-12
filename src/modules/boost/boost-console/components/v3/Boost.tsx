import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';

import ChannelBadges from '~/channel/badges/ChannelBadges';
import UserModel from '~/channel/UserModel';
import Link from '~/common/components/Link';
import MPressable from '~/common/components/MPressable';
import { Avatar, B1, Column, Row } from '~/common/ui';
import Activity from '~/newsfeed/activity/Activity';
import ActivityModel from '~/newsfeed/ActivityModel';
import ThemedStyles from '~/styles/ThemedStyles';
import { useTranslation } from '../../../locales';
import BoostModel from '../../../models/BoostModelV3';
import {
  BoostRejectionReason,
  BoostStatus,
  BoostTargetLocation,
} from '../../types/BoostConsoleBoost';
import BoostActionBar from './BoostActionBar';
import BoostHeader from './BoostHeader';

interface BoostProps {
  boost: BoostModel;
}

/**
 * Boost console item
 */
function Boost({ boost }: BoostProps) {
  return (
    <View style={styles.container}>
      <BoostHeader boost={boost} />
      <BoostEntity boost={boost} />
      {boost.boost_status === BoostStatus.REJECTED ? (
        <Rejection boost={boost} />
      ) : (
        <BoostActionBar boost={boost} />
      )}
    </View>
  );
}

const BoostEntity = ({ boost }: BoostProps) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { boost_status, entity } = boost ?? {};

  if (!entity) {
    return null;
  }

  const renderEntityByType = {
    activity: () => {
      const activity = ActivityModel.create(entity);
      activity.goal_button_text = boost.goal_button_text;
      activity.goal_button_url = boost.goal_button_url;

      return (
        <Activity
          entity={activity}
          hideTabs={true}
          navigation={navigation}
          borderless
          hideMetrics={
            boost_status === BoostStatus.APPROVED ||
            boost_status === BoostStatus.COMPLETED
          }
        />
      );
    },
    user: () => {
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
    },
    default: () => (
      <B1 horizontal="L" vertical="L" color="secondary">
        {t('Entity {{type}} {{subtype}} not supported', {
          type: entity.type,
          subtype: entity.subtype,
        })}
      </B1>
    ),
  };

  const renderEntityByTypeFn = renderEntityByType[entity.type ?? 'default'];
  return renderEntityByTypeFn?.() ?? renderEntityByType.default();
};

const Rejection = ({ boost }: BoostProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const wasWrongAudience =
    boost.rejection_reason === BoostRejectionReason.WRONG_AUDIENCE;

  return (
    <Column horizontal="L" bottom="L">
      <B1 font="bold">{t('Reason for rejection')}</B1>
      <B1>
        {t('Did not meet the acceptance criteria for the selected audience. ')}
        {wasWrongAudience ? (
          <Link
            onPress={() =>
              navigation?.navigate('BoostScreenV2', {
                entity: boost.entity,
                boostType:
                  boost.target_location === BoostTargetLocation.newsfeed
                    ? 'post'
                    : 'channel',
              })
            }>
            {t('Boost again.')}
          </Link>
        ) : (
          <Link url="https://support.minds.com/hc/en-us/articles/11723536774292-Boost-Content-Policy">
            {t('Learn more')}
          </Link>
        )}
      </B1>
    </Column>
  );
};

const styles = ThemedStyles.create({
  container: ['flexContainer', 'borderHair', 'bcolorPrimaryBorder'],
});

export default observer(Boost);
