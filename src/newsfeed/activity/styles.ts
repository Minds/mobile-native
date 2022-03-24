import { StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
  bodyContainer: {
    minHeight: 150,
    justifyContent: 'center',
  },
  onlyContentbodyContainer: {
    justifyContent: 'center',
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  message: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
  },
  emptyMessage: {
    padding: 0,
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
  },
  remind: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  boostTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boostTagLabel: {
    fontWeight: '400',
    marginLeft: 2,
    fontSize: 14,
    letterSpacing: 0.75,
  },
  blockedNoticeDesc: {
    opacity: 0.7,
    textAlign: 'center',
  },
  yellowBannerText: {
    fontSize: 11,
    color: '#000',
    ...ThemedStyles.style.paddingLeft,
  },
  yellowBanner: {
    backgroundColor: '#ffecb3',
    ...ThemedStyles.style.padding,
  },
});

const shortTextStyle = ThemedStyles.combine(
  styles.message,
  'fontXL',
  'colorPrimaryText',
  'fontMedium',
);

const textStyle = ThemedStyles.combine(styles.message, 'fontL');

const remindBlockContainerStyle = ThemedStyles.combine(
  'bgTertiaryBackground',
  'margin2x',
  'borderRadius2x',
  'padding2x',
);

const remindContainerStyle = ThemedStyles.combine(
  styles.remind,
  'margin2x',
  'borderHair',
  'bcolorPrimaryBorder',
);

const containerStyle = ThemedStyles.combine(
  styles.container,
  'borderBottom6x',
  'bcolorBaseBackground',
  'bgPrimaryBackground',
);

const borderLessContainerStyle = ThemedStyles.combine(
  styles.container,
  'bgPrimaryBackground',
);

const onlyContentContainerStyle = ThemedStyles.combine(
  styles.container,
  'borderHair',
  'bcolorBaseBackground',
  'bgPrimaryBackground',
);
const remindedContainerStyle = ThemedStyles.combine(
  styles.container,
  'bgPrimaryBackground',
);

export {
  styles,
  shortTextStyle,
  textStyle,
  remindBlockContainerStyle,
  remindContainerStyle,
  containerStyle,
  borderLessContainerStyle,
  onlyContentContainerStyle,
  remindedContainerStyle,
};
