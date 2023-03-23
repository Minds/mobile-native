import { View } from 'react-native';
import { B2, Icon, IconButton, Row } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';

export default function BoostRotatorHeader() {
  return (
    <View style={styles.container}>
      <Row align="centerBoth">
        <Icon name="boost" color="Link" right="S" size={18} />
        <B2 color="link">Boosted Post</B2>
      </Row>

      <IconButton name="cog" color="PrimaryText" size={20} />
    </View>
  );
}

const styles = ThemedStyles.create({
  container: [
    'paddingHorizontal4x',
    'rowJustifySpaceBetween',
    'alignCenter',
    'paddingVertical3x',
    'bgMutedBackground',
  ],
});
