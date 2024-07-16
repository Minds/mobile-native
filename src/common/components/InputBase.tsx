import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Tooltip } from 'react-native-elements';

import { Column, Icon, Row } from '../ui';
import MPressable from './MPressable';
import MText from './MText';
import sp from '~/services/serviceProvider';

interface InputBaseProps {
  style?: any;
  labelStyle?: StyleProp<TextStyle>;
  label: string;
  valueStyle?: StyleProp<TextStyle>;
  value: string;
  onPress?: () => void;
  info?: string;
  error?: string;
  icon?: React.ReactNode;
  borderless?: boolean;
}

export default function InputBase({
  style,
  labelStyle,
  label,
  valueStyle,
  value,
  onPress,
  info,
  icon,
  error,
  borderless,
}: InputBaseProps) {
  const theme = sp.styles.style;

  return (
    <MPressable
      onPress={onPress}
      style={[
        theme.rowJustifySpaceBetween,
        theme.alignCenter,
        theme.bgSecondaryBackground,
        theme.paddingVertical4x,
        theme.paddingHorizontal4x,
        theme.bcolorPrimaryBorder,
        theme.borderLeft0x,
        theme.borderRight0x,
        !borderless && theme.borderHair,
        style,
      ]}>
      <Column flex>
        <Row flex align="centerBetween">
          <MText style={[theme.colorSecondaryText, theme.fontL, labelStyle]}>
            {label}
          </MText>
          {!!error && (
            <MText style={[theme.colorAlert, theme.fontL, theme.textRight]}>
              {error}
            </MText>
          )}
        </Row>
        {value ? (
          <MText
            style={[
              theme.colorPrimaryText,
              theme.fontL,
              theme.marginBottom,
              valueStyle,
            ]}>
            {value}
          </MText>
        ) : undefined}
      </Column>

      <Column align="centerEnd">
        {info && (
          <Tooltip
            skipAndroidStatusBar={true}
            withOverlay={false}
            containerStyle={theme.borderRadius}
            width={200}
            height={100}
            backgroundColor={sp.styles.getColor('Link')}
            popover={<MText style={theme.colorWhite}>{info}</MText>}>
            <Icon left="S" name="info-outline" bottom="S" />
          </Tooltip>
        )}
        {icon ? icon : null}
      </Column>
    </MPressable>
  );
}
