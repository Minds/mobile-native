import React from 'react';
import Placeholder from '~/common/components/Placeholder';

import { Column, Row } from '~/common/ui';
const NotificationPlaceHolder = () => {
  return (
    <Row horizontal="M" align="centerStart" vertical="M">
      <Placeholder radius="round" height={40} width={40} />
      <Column left="M">
        <Placeholder width="70%" height={15} bottom="XS" />
        <Placeholder width="50%" height={13} />
      </Column>
      <Placeholder width={50} height={13} />
    </Row>
  );
};
export default NotificationPlaceHolder;
