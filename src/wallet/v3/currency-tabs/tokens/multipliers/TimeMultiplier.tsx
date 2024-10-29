import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Tooltip } from 'react-native-elements';

import MText from '~/common/components/MText';
import { format } from '../../MindsTokens';
import sp from '~/services/serviceProvider';

const ToolTipText = () => (
  <MText style={styles.tooltipTitle}>
    The longer you stake tokens, the more the time multiplier will increase. The
    maximum time multiplier is 3.0 (52 weeks)
  </MText>
);

/**
 * Returns the number of days from the current multiplier provided
 * NOTE: this is only using tokenomicsV2.. changes the tokenomics manifest will need to be reflected here
 * @param multiplier
 */
const calculateDaysFromMultiplier = (multiplier: number): number => {
  const maxDays = 365;
  const maxMultiplier = 3;
  const minMultiplier = 1;
  const multiplierRange = maxMultiplier - minMultiplier;
  const dailyIncrement = multiplierRange / maxDays; // 0.0054794520

  return (multiplier - minMultiplier) / dailyIncrement;
};

type PropsType = {
  multiplier: number;
};

const TimeMultiplier = ({ multiplier }: PropsType) => {
  const tooltipRef = useRef<any>();
  const theme = sp.styles.style;
  const progressBar: any = {
    flex: 1,
    width: `${(multiplier / 3) * 100}%`,
    backgroundColor: '#A3C000',
  };

  return (
    <TouchableOpacity
      style={styles.mainContainer}
      onPress={() => tooltipRef.current.toggleTooltip()}>
      <View style={[styles.multiplierContainer, theme.bgPrimaryBackground]}>
        <View style={[styles.multiplierRow]}>
          <MText style={theme.fontS}>{format(multiplier)}</MText>
          <View
            style={[
              theme.flexContainer,
              theme.bgSecondaryBackground,
              theme.marginHorizontal,
            ]}>
            <View style={progressBar} />
          </View>
          <MText style={theme.fontS}>3.0</MText>
        </View>
      </View>
      <Tooltip
        ref={tooltipRef}
        skipAndroidStatusBar={true}
        withOverlay={false}
        containerStyle={theme.borderRadius}
        width={225}
        height={100}
        backgroundColor={sp.styles.getColor('Link')}
        popover={<ToolTipText />}>
        <View />
      </Tooltip>
      <View style={[styles.infoContainer, theme.bgTertiaryBackground]}>
        <MText style={styles.infoText}>
          {format(calculateDaysFromMultiplier(multiplier))} / 365 days
        </MText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  multiplierContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 5,
  },
  multiplierRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 2,
    flexDirection: 'row',
  },
  multiplierLevel: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    borderBottomRightRadius: 6,
    borderTopRightRadius: 6,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto_500Medium',
    alignSelf: 'center',
  },
  tooltipTitle: {
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Roboto_500Medium',
  },
  tooltipText: {
    color: 'white',
    marginBottom: 10,
  },
});

export default TimeMultiplier;
