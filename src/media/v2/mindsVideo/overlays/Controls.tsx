import React from 'react';
import { observer } from 'mobx-react';
import type { MindsVideoStoreType } from '../createMindsVideoStore';
import Icon from 'react-native-vector-icons/Ionicons';
import type ActivityModel from '../../../../newsfeed/ActivityModel';
import type CommentModel from '../../../../comments/CommentModel';
import { View, TouchableWithoutFeedback, Text, Platform } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import ProgressBar from '../ProgressBar';
import { styles } from './styles';
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

const iconSize = Platform.select({ ios: 30, android: 26 });
const iconResSize = Platform.select({ ios: 28, android: 24 });
const playSize = Platform.select({ ios: 68, android: 58 });

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
      (localStore.showOverlay ||
        (!localStore.forceHideOverlay && localStore.paused && entity)),
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
            <Icon
              onPress={() =>
                localStore.paused
                  ? localStore.play(Boolean(localStore.volume))
                  : localStore.pause()
              }
              style={[styles.videoIcon, styles.textShadow]}
              name={localStore.paused ? 'md-play-circle' : 'md-pause'}
              size={playSize}
              color={Colors.light}
            />
          </View>
          {localStore.player && entity && (
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
          {localStore.player && (
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

  return null;
});

export default Controls;
