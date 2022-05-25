import React from 'react';
import { View } from 'react-native';

import Placeholder from '~/common/components/Placeholder';
import { Item, Spacer } from '~/common/ui';

/**
 * Trend list placeholder
 */
export default function DiscoveryTrendPlaceHolder() {
  return (
    <View>
      <Placeholder width="100%" height={280} radius={0} />
      <Spacer horizontal="M" vertical="M">
        <Placeholder width="70%" height={16} radius={2} bottom="XS" />
        <Placeholder width="30%" height={16} radius={2} />
      </Spacer>
      <Item noPadding />
      <Item>
        <Spacer vertical="M">
          <Placeholder width="70%" height={16} radius={2} bottom="XS" />
          <Placeholder width="30%" height={16} radius={2} />
        </Spacer>
        <Placeholder height={100} width={100} radius={0} />
      </Item>
      <Item>
        <Spacer vertical="M">
          <Placeholder width="70%" height={16} radius={2} bottom="XS" />
          <Placeholder width="30%" height={16} radius={2} />
        </Spacer>
        <Placeholder height={100} width={100} radius={0} />
      </Item>
      <Item>
        <Spacer vertical="M">
          <Placeholder width="70%" height={16} radius={2} bottom="XS" />
          <Placeholder width="30%" height={16} radius={2} />
        </Spacer>
        <Placeholder height={100} width={100} radius={0} />
      </Item>
    </View>
  );
}
