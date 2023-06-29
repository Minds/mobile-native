import { View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

export default function Divider() {
  return <View style={styles.borderBottom} />;
}

const styles = ThemedStyles.create({
  borderBottom: ['borderBottom6x', 'bcolorBaseBackground'],
});
