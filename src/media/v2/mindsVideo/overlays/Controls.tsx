import React from 'react';
import { observer } from 'mobx-react';
import type { MindsVideoStoreType } from '../createMindsVideoStore';
import Icon from '@expo/vector-icons/Ionicons';
import type ActivityModel from '../../../../newsfeed/ActivityModel';
import type CommentModel from '../../../../comments/v2/CommentModel';
import { View, TouchableWithoutFeedback } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import withPreventDoubleTap from '../../../../common/components/PreventDoubleTap';
import ProgressBar from '../ProgressBar';
import { styles, iconSize, playSize } from './styles';

type PropsType = {
  entity?: ActivityModel | CommentModel;
  localStore: MindsVideoStoreType;
  hideOverlay?: boolean;
};

const DebouncedTouchableWithoutFeedback = withPreventDoubleTap(
  TouchableWithoutFeedback,
);

const hitSlop = { top: 20, bottom: 20, right: 20, left: 20 };
const controlColor = '#F7F7F7';

const Controls = observer(({ localStore, entity, hideOverlay }: PropsType) => {
  const theme = ThemedStyles.style;

  const mustShow = Boolean(
    !hideOverlay &&
      !localStore.forceHideOverlay &&
      (localStore.showOverlay || (localStore.paused && entity)),
  );

  if (mustShow) {
    const progressBar = (
      <View style={[theme.flexContainer, theme.columnAlignCenter]}>
        <ProgressBar store={localStore} />
      </View>
    );

    // remove source selector (we have only one source)
    // const sourceSelector = <SourceSelector localStore={localStore} />;

    return (
      <DebouncedTouchableWithoutFeedback
        hitSlop={hitSlop}
        style={styles.overlayContainer}
        onPress={localStore.openControlOverlay}>
        <View style={styles.overlayContainer}>
          <View
            style={[theme.positionAbsolute, theme.centered, theme.marginTop2x]}>
            <View style={[theme.centered, styles.playContainer]}>
              <Icon
                onPress={() =>
                  localStore.paused
                    ? localStore.play(Boolean(localStore.volume))
                    : localStore.pause()
                }
                style={[styles.videoIcon, styles.textShadow]}
                name={localStore.paused ? 'play' : 'pause'}
                size={playSize - 25}
                color={controlColor}
              />
            </View>
          </View>
          {localStore.duration > 0 && localStore.showFullControls && (
            <View style={styles.controlBarContainer}>
              <Icon
                onPress={() => localStore.toggleFullScreen()}
                name="expand"
                size={iconSize}
                color={controlColor}
                style={theme.paddingHorizontal}
              />
              {progressBar}
              <View style={[theme.padding, theme.rowJustifySpaceEvenly]}>
                <DebouncedTouchableWithoutFeedback
                  hitSlop={hitSlop}
                  onPress={() => localStore.toggleVolume()}>
                  <Icon
                    name={
                      localStore.volume === 0 ? 'volume-mute' : 'volume-high'
                    }
                    size={iconSize}
                    color={controlColor}
                  />
                </DebouncedTouchableWithoutFeedback>
              </View>
            </View>
          )}
        </View>
      </DebouncedTouchableWithoutFeedback>
    );
  }

  return !localStore.paused && !hideOverlay ? (
    <View
      style={[
        theme.positionAbsoluteBottomRight,
        theme.padding2x,
        styles.floatingVolume,
      ]}>
      <Icon
        onPress={localStore.toggleVolume}
        name={localStore.volume === 0 ? 'volume-mute' : 'volume-high'}
        size={iconSize}
        color={controlColor}
      />
    </View>
  ) : null;
});

export default Controls;
