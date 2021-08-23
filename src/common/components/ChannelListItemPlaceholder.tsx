import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import UserModel from '../../channel/UserModel';
import { View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useDimensions } from '@react-native-community/hooks';
import React from 'react';

const ChannelListItemPlaceholder = () => {
  const theme = ThemedStyles.style;
  const color = ThemedStyles.getColor('TertiaryBackground');
  const { width } = useDimensions().screen;

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
        height={14}
        style={{ marginBottom: 5 }}
      />
      <PlaceholderLine width={20} color={color} height={8} />
    </Placeholder>
  );
};

export default ChannelListItemPlaceholder;

const styles = ThemedStyles.create({
  container: [
    {
      flexDirection: 'row',
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
  nameContainer: ['flexContainerCenter', 'paddingLeft', 'justifyCenter'],
  avatar: [
    {
      height: 40,
      width: 40,
      borderRadius: 20,
    },
    'bgTertiaryBackground',
  ],
});
