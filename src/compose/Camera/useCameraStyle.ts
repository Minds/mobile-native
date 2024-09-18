import { EdgeInsets } from 'react-native-safe-area-context';
import { portrait, useOrientationStyles } from '~/styles/hooks';

/**
 * Orientation based styling
 */
export default function useCameraStyle(insets: EdgeInsets) {
  return useOrientationStyles(
    {
      buttonContainer: [
        {
          position: 'absolute',
        },
        portrait(
          {
            bottom: 25,
            alignItems: 'center',
            width: '100%',
          },
          {
            right: 25,
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
          },
        ),
      ],
      leftIconContainer: [
        {
          position: 'absolute',
        },
        portrait(
          {
            left: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            height: '100%',
            width: '50%',
            paddingRight: 40,
            alignItems: 'center',
          },
          {
            top: 0,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'space-around',
            width: '100%',
            height: '50%',
            paddingBottom: 40,
          },
        ),
      ],
      rightButtonsContainer: [
        {
          position: 'absolute',
        },
        portrait(
          {
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            height: '100%',
            width: '50%',
            paddingLeft: 40,
            alignItems: 'center',
          },
          {
            bottom: 0,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'space-around',
            width: '100%',
            height: '50%',
            paddingTop: 40,
          },
        ),
      ],
      galleryIcon: [
        'padding3x',
        {
          color: 'white',
          alignSelf: 'center',
          textShadowColor: 'rgba(0, 0, 0, 0.35)',
          textShadowOffset: { width: -1, height: 1 },
          textShadowRadius: 2.22,
        },
        portrait(
          {
            marginLeft: 15,
          },
          { marginBottom: 15 },
        ),
      ],
      lowLight: [
        { position: 'absolute' },
        portrait({ right: 10, top: insets.top + 8 }, { left: 15, bottom: 5 }),
      ],
      clock: {
        position: 'absolute',
        width: '100%',
        top: 20,
        left: 0,
        color: 'white',
        textAlign: 'center',
      },
      zoomIndicator: {
        position: 'absolute',
        alignSelf: 'center',
        top: insets.top + 15,
      },
      icon: {
        padding: 10,
        color: 'white',
        alignSelf: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.35)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2.22,
      },
    },
    [insets.top],
  );
}
