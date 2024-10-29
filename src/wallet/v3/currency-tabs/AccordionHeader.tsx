import React from 'react';
import { Tooltip } from 'react-native-elements';

import { Icon, B1, Row, Spacer, B2 } from '~ui';
import sp from '~/services/serviceProvider';

type PropsType = {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  tooltip: any;
  isActive: boolean;
};

const AccordionHeader = ({ title, subtitle, tooltip, isActive }: PropsType) => {
  const theme = sp.styles.style;

  const SubTitle = subtitle ? (
    typeof subtitle === 'string' ? (
      <B1>{subtitle}</B1>
    ) : (
      subtitle
    )
  ) : null;
  return (
    <Row horizontal="L" vertical="S" align="centerStart">
      <Row flex align="centerStart">
        {typeof title === 'string' && <B1 font="medium">{title}</B1>}
        {typeof title !== 'string' && title}
        {tooltip && (
          <Spacer left="S">
            <Tooltip
              skipAndroidStatusBar={true}
              withOverlay={false}
              containerStyle={theme.borderRadius}
              width={tooltip.width}
              height={tooltip.height}
              backgroundColor={sp.styles.getColor('Link')}
              popover={<B2 color="white">{tooltip.title}</B2>}>
              <Icon name="info" size="tiny" />
            </Tooltip>
          </Spacer>
        )}
      </Row>
      <Spacer horizontal="M">{SubTitle}</Spacer>
      <Icon name={`chevron-${isActive ? 'up' : 'down'}`} size="small" />
    </Row>
  );
};

export default AccordionHeader;
