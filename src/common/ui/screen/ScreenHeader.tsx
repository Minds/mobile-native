import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { Row, SpacerPropType } from '~ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { IconButton } from '..';
import { useNavigation } from '@react-navigation/native';
import { IconMapNameType } from '../icons/map';
import { Typography, TypographyPropsType } from '../typography/Typography';

export type ScreenHeaderType = {
  title?: string;
  extra?: ReactNode;
  back?: boolean;
  leftComponent?: ReactNode;
  backIcon?: IconMapNameType;
  border?: boolean;
  shadow?: boolean;
  titleType?: TypographyPropsType['type'];
  centerTitle?: boolean;
  onBack?: () => void;
  onTitlePress?: () => void;
};

export const ScreenHeader = ({
  title,
  extra,
  shadow,
  back,
  leftComponent,
  backIcon = 'chevron-left',
  onBack,
  onTitlePress,
  border,
  titleType = 'H2',
  centerTitle,
  ...more
}: ScreenHeaderType & SpacerPropType) => {
  const navigation = useNavigation();
  return (
    <View
      style={
        border ? styles.border : shadow ? styles.shadow : styles.container
      }>
      {Boolean(title) && centerTitle && (
        <View style={styles.titleCenteredContainer}>
          <Typography type={titleType} font="bold" onPress={onTitlePress} flat>
            {title}
          </Typography>
        </View>
      )}
      <Row align="centerBetween" space="L" {...more}>
        <View style={styles.row}>
          {leftComponent ? leftComponent : null}
          {back && (
            <IconButton
              name={backIcon}
              size={33}
              right="S"
              onPress={onBack || (() => navigation.goBack())}
            />
          )}
          {Boolean(title) && !centerTitle && (
            <Typography type={titleType} font="bold" onPress={onTitlePress}>
              {title}
            </Typography>
          )}
        </View>
        <View>{extra}</View>
      </Row>
    </View>
  );
};

const styles = ThemedStyles.create({
  container: {
    zIndex: 1,
  },
  titleCenteredContainer: [
    'paddingHorizontal11x',
    'absoluteFill',
    'centered',
    { minHeight: 55 },
  ],
  border: [
    'bcolorPrimaryBorder',
    'borderBottom1x',
    { minHeight: 55, zIndex: 1 },
  ],
  row: ['rowJustifyStart'],
  shadow: [
    'bgPrimaryBackground',
    {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 1,
      elevation: 2,
      zIndex: 1000,
    },
  ],
});
