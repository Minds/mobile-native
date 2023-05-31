import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { H3, H4 } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { styles as headerStyles } from '~/topbar/Topbar';

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

const containerStyle = ThemedStyles.combine(
  {
    paddingVertical: 16,
  },
  'paddingHorizontal4x',
  'bgPrimaryBackground',
  'borderBottom1x',
  'rowJustifySpaceBetween',
  'bcolorTertiaryBackground',
);
const containerSmallStyle = ThemedStyles.combine(
  {
    paddingVertical: 12,
  },
  'paddingHorizontal4x',
  'bgPrimaryBackground',
  'borderBottom1x',
  'rowJustifySpaceBetween',
  'bcolorTertiaryBackground',
);

export default NewsfeedHeader;
