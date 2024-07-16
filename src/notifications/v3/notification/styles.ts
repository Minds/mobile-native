import { StyleSheet } from 'react-native';
import sp from '~/services/serviceProvider';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  avatarContainer: {
    flexDirection: 'column',
    marginRight: 28,
  },
  bodyContainer: {
    flex: 9,
    alignSelf: 'center',
  },
  timeContainer: {
    flex: 2,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  avatar: {
    height: 37,
    width: 37,
    borderRadius: 18.5,
  },
  notificationIconStyle: {
    position: 'absolute',
    bottom: -15,
    left: 15,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 18,
  },
  readIndicator: {
    width: 10,
    height: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginLeft: 8,
  },
  contentPreviewContainer: {
    marginTop: 24,
    paddingLeft: 0,
  },
  buttonMargin: {
    marginTop: 16,
  },
});

export const contentPreviewContainerBorder = sp.styles.combine(
  'marginTop6x',
  'borderRadius3x',
  'bcolorPrimaryBorder',
  'borderHair',
);

export const readIndicatorStyle = sp.styles.combine(
  styles.readIndicator,
  'bgLink',
);

export const containerStyle = sp.styles.combine(
  styles.container,
  'borderBottomHair',
  'bcolorPrimaryBorder',
);

export const bodyTextStyle = sp.styles.combine(
  styles.bodyText,
  'fontNormal',
  'colorSecondaryText',
);

export const bodyTextImportantStyle = sp.styles.combine(
  styles.bodyText,
  'fontMedium',
  'colorPrimaryText',
);

export const spacedCommentPreview = sp.styles.combine(
  styles.bodyText,
  'fontNormal',
  'colorSecondaryText',
  'marginBottom4x',
);
