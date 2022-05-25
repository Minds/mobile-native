import React from 'react';

import { Column, Row } from '~/common/ui';
import Placeholder from './Placeholder';

const ChannelListItemPlaceholder = () => {
  return (
    <Row horizontal="M" align="centerStart" vertical="M">
      <Placeholder radius="round" height={40} width={40} />
      <Column left="M">
        <Placeholder width={140} height={15} bottom="XS" />
        <Placeholder width={90} height={13} />
      </Column>
    </Row>
  );
};

export default ChannelListItemPlaceholder;
