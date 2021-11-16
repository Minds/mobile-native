import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import ThemedStyles from '../../styles/ThemedStyles';
import React from 'react';

const ChannelListItemPlaceholder = () => {
  const theme = ThemedStyles.style;
  const color = ThemedStyles.getColor('TertiaryBackground');

  const animation = props => (
    <Fade {...props} style={theme.bgPrimaryBackground} />
  );

  return (
    <Placeholder
      Left={() => (
        <PlaceholderMedia isRound color={color} style={theme.marginRight2x} />
      )}
      Animation={animation}
      style={styles.container}>
      <PlaceholderLine
        width={30}
        color={color}
        height={16}
        style={styles.namePlaceholder}
      />
      <PlaceholderLine
        width={20}
        color={color}
        style={styles.usernamePlaceholder}
      />
    </Placeholder>
  );
};

export default ChannelListItemPlaceholder;

const styles = ThemedStyles.create({
  container: [
    {
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingTop: 10,
      paddingBottom: 10,
    },
    'paddingHorizontal2x',
    'bcolorPrimaryBorder',
    'borderBottomHair',
    'bgPrimaryBackground',
  ],
  namePlaceholder: { marginBottom: 8 },
  usernamePlaceholder: { marginBottom: 0 },
});
