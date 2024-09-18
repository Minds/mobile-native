import { StyleSheet } from 'react-native';
import sp from '~/services/serviceProvider';

const DEFAULT_DOT_SIZE = 12;
const DEFAULT_DOT_COLOR = sp.styles.getColor('PrimaryText');

export default StyleSheet.create({
  sliderPagination: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  sliderPaginationDotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  sliderPaginationDot: {
    width: DEFAULT_DOT_SIZE,
    height: DEFAULT_DOT_SIZE,
    borderRadius: DEFAULT_DOT_SIZE / 2,
    backgroundColor: DEFAULT_DOT_COLOR,
  },
});
