import { StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingLeft: 8,
    paddingBottom: 16,
    paddingRight: 8,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  body: {
    marginLeft: 8,
    flex: 1,
  },
  bodyContents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
  },
});

export default styles;
