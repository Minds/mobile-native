import sp from '~/services/serviceProvider';
const CONTAINER_MIN_HEIGHT = 150;

const styles = sp.styles.create({
  container: ['alignSelfCenterMaxWidth'],
  bodyContainer: {
    minHeight: CONTAINER_MIN_HEIGHT,
  },
  bodyContainerCentered: {
    minHeight: CONTAINER_MIN_HEIGHT,
    justifyContent: 'center',
  },
  messageContainer: ['paddingHorizontal4x', 'paddingVertical3x'],
  message: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  emptyMessage: ['padding0x'],
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
  yellowBannerText: [
    {
      fontSize: 11,
      color: '#000',
    },
    'paddingLeft',
  ],
  yellowBanner: [{ backgroundColor: '#ffecb3' }, 'padding'], //TODO: move colors to pallette or select others
});

const shortTextStyle = sp.styles.combine(
  styles.message,
  'fontXL',
  'colorPrimaryText',
  'fontMedium',
);

const textStyle = sp.styles.combine(styles.message, 'fontL');

const remindBlockContainerStyle = sp.styles.combine(
  'bgTertiaryBackground',
  'margin2x',
  'borderRadius2x',
  'padding2x',
);

const remindContainerStyle = sp.styles.combine(
  styles.remind,
  'alignSelfCenterMaxWidth',
  'margin3x',
  'marginHorizontal4x',
  'borderRadius3x',
  'border1x',
  'bcolorPrimaryBorder',
);

const containerStyle = sp.styles.combine(
  styles.container,
  'borderBottom6x',
  'bcolorBaseBackground',
  'bgPrimaryBackground',
);

const borderLessContainerStyle = sp.styles.combine(
  styles.container,
  'bgPrimaryBackground',
);

const onlyContentContainerStyle = sp.styles.combine(
  styles.container,
  'borderHair',
  'bcolorBaseBackground',
  'bgPrimaryBackground',
);
const remindedContainerStyle = sp.styles.combine(
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
