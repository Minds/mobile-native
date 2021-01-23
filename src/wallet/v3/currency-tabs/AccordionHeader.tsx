import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AccordionDataType } from '../../../common/components/AccordionSet';
import Tooltip from '../../../common/components/Tooltip';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  content: AccordionDataType;
  isActive: boolean;
};

const AccordionHeader = ({ content, isActive }: PropsType) => {
  const theme = ThemedStyles.style;
  const [showTooltip, setShowTooltip] = useState(false);
  const toggleTooltip = () => setShowTooltip(!showTooltip);
  return (
    <View
      style={[
        theme.rowJustifySpaceBetween,
        theme.paddingVertical2x,
        theme.paddingRight3x,
      ]}>
      <View style={[theme.flexContainer, theme.rowJustifyStart]}>
        <Text style={theme.fontLM}>{content.title}</Text>
        {content.tooltip && (
          <View style={styles.tooltipContainer}>
            <Icon
              name="information-variant"
              size={15}
              color="#AEB0B8"
              onPress={toggleTooltip}
            />
            {showTooltip && (
              <Tooltip
                backgroundColor={ThemedStyles.getColor('link')}
                containerStyle={[
                  theme.paddingVertical3x,
                  theme.paddingHorizontal4x,
                ]}>
                <View>
                  <Text style={theme.colorPrimaryText}>{content.tooltip}</Text>
                </View>
              </Tooltip>
            )}
          </View>
        )}
      </View>
      <Text style={[theme.fontLM, theme.flexContainer]}>
        {content.subtitle}
      </Text>
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
