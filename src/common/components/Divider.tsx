import { View } from 'react-native';
import sp from '~/services/serviceProvider';

export default function Divider() {
  return <View style={styles.borderBottom} />;
}

const styles = sp.styles.create({
  borderBottom: ['borderBottom6x', 'bcolorBaseBackground'],
});
