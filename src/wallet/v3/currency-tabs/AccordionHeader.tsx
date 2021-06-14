import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  tooltip: any;
  isActive: boolean;
};

const AccordionHeader = ({ title, subtitle, tooltip, isActive }: PropsType) => {
  const theme = ThemedStyles.style;

  const SubTitle = subtitle ? (
    typeof subtitle === 'string' ? (
      <Text style={[theme.fontLM, theme.flexContainer]}>{subtitle}</Text>
    ) : (
      subtitle
    )
  ) : null;
  return (
    <View
      style={[
        theme.rowJustifyStart,
        theme.paddingVertical2x,
        theme.paddingRight6x,
        theme.paddingLeft5x,
      ]}>
      <View style={[theme.flexContainer, theme.rowJustifyStart]}>
        {typeof title === 'string' && (
          <Text style={[theme.fontLM, theme.fontMedium]}>{title}</Text>
        )}
        {typeof title !== 'string' && title}
        {tooltip && (
          <View style={styles.tooltipContainer}>
            <Tooltip
              skipAndroidStatusBar={true}
              withOverlay={false}
              containerStyle={theme.borderRadius}
              width={tooltip.width}
              height={tooltip.height}
              backgroundColor={ThemedStyles.getColor('Link')}
              popover={<Text style={theme.colorWhite}>{tooltip.title}</Text>}>
              <Icon name="information-variant" size={15} color="#AEB0B8" />
            </Tooltip>
          </View>
        )}
      </View>
      <View style={theme.paddingRight2x}>{SubTitle}</View>
      <Icon
        name={`chevron-${isActive ? 'up' : 'down'}`}
        size={21}
        color={ThemedStyles.getColor('SecondaryText')}
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
