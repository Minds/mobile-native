import React from 'react';
import { observer } from 'mobx-react';
import type { MindsVideoStoreType } from '../createMindsVideoStore';
import Icon from 'react-native-vector-icons/Ionicons';
import type ActivityModel from '../../../../newsfeed/ActivityModel';
import type CommentModel from '../../../../comments/v2/CommentModel';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import ProgressBar from '../ProgressBar';
import { styles, iconSize, iconResSize, playSize } from './styles';
import Colors from '../../../../styles/Colors';
// workaround to fix tooltips on android
import Tooltip from 'rne-modal-tooltip';

type PropsType = {
  entity?: ActivityModel | CommentModel;
  localStore: MindsVideoStoreType;
  hideOverlay?: boolean;
};

type SourceSelectorPropsType = {
  localStore: MindsVideoStoreType;
};

const SourceSelector = ({ localStore }: SourceSelectorPropsType) => {
  const theme = ThemedStyles.style;
  if (!localStore.sources) {
    return null;
  }
  return (
    <View>
      {localStore.sources.map((s, i) => (
        <Text
          style={[
            theme.colorWhite,
            theme.fontL,
            theme.paddingBottom,
            i === localStore.source ? theme.bold : null,
          ]}
          onPress={() => localStore.setSource(i)}>
          {s.size}p
        </Text>
      ))}
    </View>
  );
};

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

    const sourceSelector = <SourceSelector localStore={localStore} />;

    return (
      <TouchableWithoutFeedback
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
                color={Colors.light}
              />
            </View>
          </View>
          {localStore.duration > 0 && entity && (
            <View style={styles.controlSettingsContainer}>
              <Tooltip
                popover={sourceSelector}
                withOverlay={false}
                height={60}
                onOpen={localStore.openControlOverlay}
                backgroundColor="rgba(48,48,48,0.7)">
                <Icon
                  name="ios-settings-sharp"
                  size={iconResSize}
                  style={[
                    theme.paddingLeft,
                    styles.textShadow,
                    theme.colorWhite,
                  ]}
                />
              </Tooltip>
            </View>
          )}
          {localStore.duration > 0 && (
            <View style={styles.controlBarContainer}>
              <Icon
                onPress={localStore.toggleFullScreen}
                name="ios-expand"
                size={iconSize}
                color={Colors.light}
                style={theme.paddingHorizontal}
              />
              {progressBar}
              <View style={[theme.padding, theme.rowJustifySpaceEvenly]}>
                <Icon
                  onPress={localStore.toggleVolume}
                  name={
                    localStore.volume === 0
                      ? 'ios-volume-mute'
                      : 'ios-volume-high'
                  }
                  size={iconSize}
                  color={Colors.light}
                />
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
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
        name={localStore.volume === 0 ? 'ios-volume-mute' : 'ios-volume-high'}
        size={iconSize}
        color={Colors.light}
      />
    </View>
  ) : null;
});

export default Controls;
