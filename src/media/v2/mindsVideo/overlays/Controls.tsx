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

const isIOS = Platform.OS === 'ios';

type PropsType = {
  entity?: ActivityModel | CommentModel;
  localStore: MindsVideoStoreType;
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

const Controls = observer(({ localStore, entity }: PropsType) => {
  const theme = ThemedStyles.style;

  if (localStore.fullScreen) {
    return null;
  }

  const mustShow = localStore.showOverlay || (localStore.paused && entity);

  const size = 56;

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
                localStore.paused ? localStore.play(false) : localStore.pause()
              }
              style={styles.videoIcon}
              name={localStore.paused ? 'md-play-circle' : 'md-pause'}
              size={size}
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
                  name="ios-settings"
                  size={23}
                  color={Colors.light}
                  style={theme.paddingLeft}
                />
              </Tooltip>
            </View>
          )}
          {localStore.player && (
            <View style={styles.controlBarContainer}>
              {isIOS && (
                <View
                  style={[
                    theme.padding,
                    theme.rowJustifySpaceEvenly,
                    theme.marginRight,
                  ]}>
                  <Icon
                    onPress={localStore.toggleFullScreen}
                    name="ios-expand"
                    size={23}
                    color={Colors.light}
                    style={theme.paddingLeft}
                  />
                </View>
              )}
              {progressBar}
              <View style={[theme.padding, theme.rowJustifySpaceEvenly]}>
                <Icon
                  onPress={localStore.toggleVolume}
                  name={
                    localStore.volume === 0
                      ? 'ios-volume-off'
                      : 'ios-volume-high'
                  }
                  size={23}
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
