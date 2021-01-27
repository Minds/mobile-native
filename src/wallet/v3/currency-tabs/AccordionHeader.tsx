import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  title: string;
  subtitle?: string;
  tooltip: any;
  isActive: boolean;
};

const AccordionHeader = ({ title, subtitle, tooltip, isActive }: PropsType) => {
  const theme = ThemedStyles.style;
  return (
    <View
      style={[
        theme.rowJustifySpaceBetween,
        theme.paddingVertical2x,
        theme.paddingRight3x,
        theme.paddingLeft4x,
      ]}>
      <View style={[theme.flexContainer, theme.rowJustifyStart]}>
        <Text style={theme.fontLM}>{title}</Text>
        {tooltip && (
          <View style={styles.tooltipContainer}>
            <Tooltip
              withOverlay={false}
              containerStyle={theme.borderRadius}
              width={tooltip.width}
              height={tooltip.height}
              backgroundColor={ThemedStyles.getColor('link')}
              popover={<Text style={theme.colorWhite}>{tooltip.title}</Text>}>
              <Icon name="information-variant" size={15} color="#AEB0B8" />
            </Tooltip>
          </View>
        )}
      </View>
      <Text style={[theme.fontLM, theme.flexContainer]}>{subtitle}</Text>
      <Icon
        name={`chevron-${isActive ? 'up' : 'down'}`}
        size={21}
        color={ThemedStyles.getColor('secondary_text')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    paddingLeft: 10,
    paddingBottom: 2,
    alignSelf: 'flex-end',
  },
});

export default AccordionHeader;
