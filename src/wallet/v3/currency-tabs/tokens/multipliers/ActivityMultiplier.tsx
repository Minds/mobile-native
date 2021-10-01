import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Tooltip } from 'react-native-elements';
import MText from '../../../../../common/components/MText';
import ThemedStyles from '../../../../../styles/ThemedStyles';

const ToolTipText = () => (
  <View>
    <MText style={styles.tooltipTitle}>Casual · 1x</MText>
    <MText style={styles.tooltipText}>
      Active one day over the past seven days
    </MText>
    <MText style={styles.tooltipTitle}>Core · 2x</MText>
    <MText style={styles.tooltipText}>
      Active three days over the past seven days
    </MText>
    <MText style={styles.tooltipTitle}>Hardcore · 3x</MText>
    <MText style={styles.tooltipText}>
      Active six days over the past six days
    </MText>
  </View>
);

type PropsType = {
  multiplier: any;
};

const ActivityMultiplier = ({ multiplier }: PropsType) => {
  const activityLevel =
    typeof multiplier === 'string' ? parseInt(multiplier) : multiplier;
  const tooltipRef = useRef<any>();
  const theme = ThemedStyles.style;
  const getLevelStyle = (level: number) => {
    const backgroundLevels = {
      level1: { backgroundColor: '#69A617' },
      level2: { backgroundColor: '#69A617' },
      level3: { backgroundColor: '#69A617' },
    };
    switch (level) {
      case 1:
        return backgroundLevels[`level${activityLevel}`];
      case 2:
        if (activityLevel === 1) {
          return theme.bgSecondaryBackground;
        } else {
          return backgroundLevels[`level${activityLevel}`];
        }
      case 3:
        if (activityLevel !== 3) {
          return theme.bgSecondaryBackground;
        } else {
          return backgroundLevels[`level${activityLevel}`];
        }
    }
  };

  let activityLevelText = '';
  switch (activityLevel) {
    case 1:
      activityLevelText = 'Casual';
      break;
    case 2:
      activityLevelText = 'Core';
      break;
    case 3:
      activityLevelText = 'Hardcore';
      break;
  }
  return (
    <TouchableOpacity
      style={styles.mainContainer}
      onPress={() => tooltipRef.current.toggleTooltip()}>
      <View style={[styles.multiplierContainer, theme.bgPrimaryBackground]}>
        <MText style={theme.fontS}>{activityLevel}.0</MText>
        <View style={[styles.multiplierRow]}>
          <View style={[styles.multiplierLevel, getLevelStyle(1)]} />
          <View
            style={[
              styles.multiplierLevel,
              theme.borderLeftHair,
              theme.borderRightHair,
              theme.bcolorPrimaryBorder,
              getLevelStyle(2),
            ]}
          />
          <View style={[styles.multiplierLevel, getLevelStyle(3)]} />
        </View>
        <MText style={theme.fontS}>3.0</MText>
      </View>
      <Tooltip
        ref={tooltipRef}
        skipAndroidStatusBar={true}
        withOverlay={false}
        containerStyle={theme.borderRadius}
        width={250}
        height={200}
        backgroundColor={ThemedStyles.getColor('Link')}
        popover={<ToolTipText />}>
        <View />
      </Tooltip>
      <View style={[styles.infoContainer, theme.bgTertiaryBackground]}>
        <MText style={styles.infoText}>{activityLevelText}</MText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 10,
  },
  multiplierContainer: {
    flex: 5,
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 5,
  },
  multiplierRow: {
    flex: 1,
    borderRadius: 2,
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  multiplierLevel: {
    flex: 1,
  },
  infoContainer: {
    flex: 3,
    paddingVertical: 5,
    borderBottomRightRadius: 6,
    borderTopRightRadius: 6,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    alignSelf: 'center',
  },
  tooltipTitle: {
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
  tooltipText: {
    color: 'white',
    marginBottom: 10,
  },
});

export default ActivityMultiplier;
