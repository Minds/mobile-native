import { View } from 'react-native';
import { observer } from 'mobx-react';

import isObject from 'lodash/isObject';

import type ActivityModel from '~/newsfeed/ActivityModel';
import abbrev from '~/common/helpers/abbrev';
import LockTag from '~/wire/v2/lock/LockTag';
import type { SupportTiersType } from '~/wire/WireTypes';
import { getLockType } from '~/wire/v2/lock/Lock';
import MText from '~/common/components/MText';
import SupermindLabel from '~/common/components/supermind/SupermindLabel';
import { IS_TENANT } from '~/config/Config';
import { LockNetworkTag } from './LockNetwordkTag';
import sp from '~/services/serviceProvider';

type ActivityMetricsProps = {
  entity: ActivityModel;
  fullDate?: boolean;
  hideSupermindLabel?: boolean;
};

/**
 * Activity metrics component
 */
const ActivityMetrics = observer(
  ({ entity, fullDate, hideSupermindLabel }: ActivityMetricsProps) => {
    const i18n = sp.i18n;
    const support_tier: SupportTiersType | null =
      entity.wire_threshold &&
      isObject(entity.wire_threshold) &&
      'support_tier' in entity.wire_threshold
        ? entity.wire_threshold.support_tier
        : null;

    const lockType = support_tier ? getLockType(support_tier) : null;

    const date = i18n.date(
      parseInt(entity.time_created, 10) * 1000,
      fullDate ? 'datetime' : 'friendly',
    );

    return (
      <View style={containerStyle}>
        <MText style={textStyle}>
          {entity.impressions > 0
            ? abbrev(entity.impressions, 1) +
              ` ${i18n.t('views').toLowerCase()} · `
            : ''}
          {date}
        </MText>
        {IS_TENANT ? (
          <LockNetworkTag entity={entity} />
        ) : (
          <>
            {lockType !== null && <LockTag type={lockType} />}
            {Boolean(entity.supermind) && !hideSupermindLabel && (
              <SupermindLabel />
            )}
          </>
        )}
      </View>
    );
  },
);

const containerStyle = sp.styles.combine(
  'rowJustifySpaceBetween',
  'padding2x',
  'paddingHorizontal4x',
);

const textStyle = sp.styles.combine(
  'colorSecondaryText',
  'fontM',
  'paddingVertical',
);

export default ActivityMetrics;
