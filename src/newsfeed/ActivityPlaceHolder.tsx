import React from 'react';
import { Column, Row, Spacer } from '~/common/ui';
import Placeholder from '~/common/components/Placeholder';

export default function ActivityPlaceHolder({
  showText = false,
}: {
  showText?: boolean;
}) {
  return (
    <Spacer vertical="S">
      <Row horizontal="M" align="centerStart" bottom="M">
        <Placeholder radius="round" height={38} width={38} />
        <Column left="M">
          <Spacer bottom="XS">
            <Placeholder width={140} height={17} />
          </Spacer>
          <Placeholder width={90} height={15} />
        </Column>
      </Row>
      <Placeholder radius="square" height={290} width="100%" />
      {showText && (
        <Column left="M" top="XL">
          <Spacer bottom="S">
            <Placeholder width={280} height={17} />
          </Spacer>
          <Placeholder width={240} height={15} />
        </Column>
      )}
    </Spacer>
  );
}
