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
    borderBottomColor: ThemedStyles.getColor('primary_border'),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ThemedStyles.getColor('primary_border'),
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
    color: ThemedStyles.getColor('secondary_text'),
  },
});

export default styles;
