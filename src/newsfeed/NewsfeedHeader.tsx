import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { H3, H4 } from '~/common/ui';

import { styles as headerStyles } from '~/topbar/Topbar';
import sp from '~/services/serviceProvider';

interface NewsfeedHeaderProps {
  title?: string;
  withoutIcon?: any;
  small?: boolean;
  shadow?: boolean;
  endIcon?: ReactNode;
  borderless?: boolean;
}

const NewsfeedHeader = ({
  title,
  small,
  shadow,
  endIcon,
  borderless,
}: NewsfeedHeaderProps) => {
  const Typo = small ? H4 : H3;

  const style = shadow
    ? [
        headerStyles.shadow,
        small ? containerSmallStyle : containerStyle,
        { borderBottomWidth: 0 },
      ]
    : [
        small ? containerSmallStyle : containerStyle,
        borderless ? { borderBottomWidth: 0 } : null,
      ];

  return (
    <View style={style}>
      <Typo>{title}</Typo>
      {endIcon}
    </View>
  );
};

const containerStyle = sp.styles.combine(
  {
    paddingVertical: 16,
  },
  'paddingHorizontal4x',
  'bgPrimaryBackground',
  'borderBottom1x',
  'rowJustifySpaceBetween',
  'bcolorTertiaryBackground',
  'alignSelfCenterMaxWidth',
);
const containerSmallStyle = sp.styles.combine(
  {
    paddingVertical: 12,
  },
  'paddingHorizontal4x',
  'bgPrimaryBackground',
  'borderBottom1x',
  'rowJustifySpaceBetween',
  'bcolorTertiaryBackground',
  'alignSelfCenterMaxWidth',
);

export default NewsfeedHeader;
