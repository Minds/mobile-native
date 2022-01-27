import React from 'react';
import { B3, B2, Row } from '~ui';

type PropsType = {
  labelText: string;
  linkText: string;
  linkStyle?: any;
  containerStyle?: any;
  onLinkPress: () => void;
};

const MenuSubtitleWithButton = ({
  labelText,
  linkText,
  containerStyle,
  onLinkPress,
}: PropsType) => {
  return (
    <Row
      align="centerBetween"
      top="M"
      horizontal="L"
      containerStyle={containerStyle}>
      <B3 color="secondary">{labelText}</B3>
      <B2 color="link" onPress={onLinkPress}>
        {linkText}
      </B2>
    </Row>
  );
};

export default MenuSubtitleWithButton;
