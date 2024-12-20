import React from 'react';
import { StyleSheet } from 'react-native';
import { Tooltip } from 'react-native-elements';
import IconMC from '@expo/vector-icons/MaterialCommunityIcons';

import MText from './MText';

const InfoPopup = ({ info }: { info: string }) => {
  const ref = React.useRef<Tooltip>(null);
  const showPopup = () => {
    ref.current?.toggleTooltip();
  };
  return (
    <Tooltip
      ref={ref}
      width={350}
      height={100}
      pointerColor={'#4A90E2'}
      popover={<MText style={styles.textTooltip}>{info}</MText>}
      containerStyle={styles.tooltip}>
      <IconMC
        name="information-variant"
        size={16}
        onPress={showPopup}
        color="#AEB0B8"
      />
    </Tooltip>
  );
};

export default InfoPopup;

const styles = StyleSheet.create({
  tooltip: {
    backgroundColor: '#4A90E2',
  },
  textTooltip: {
    color: '#FFF',
  },
});
