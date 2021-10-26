import React, { Component } from 'react';

import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';

import { Icon } from 'react-native-elements';
import settingsStore from '../settings/SettingsStore';
import GroupModel from '~/groups/GroupModel';

type PropsType = {
  group?: GroupModel;
  visible?: boolean;
  route: { key: string };
  navigation: any;
  testID?: string;
};

/**
 * Animated presence container
 */
function ShowHide({ children, ...other }) {
  return (
    <MotiView {...animation} {...other}>
      {children}
    </MotiView>
  );
}

@observer
export default class CaptureFab extends Component<PropsType> {
  /**
   * Nav to activity full screen
   */
  navToCapture = () => {
    this.props.navigation.push('Capture', {
      group: this.props.group,
      parentKey: this.props.route.key,
    });
  };

  render() {
    return (
      <AnimatePresence>
        {this.props.visible && (
          <ShowHide>
            <Icon
              raised
              reverse
              name="edit"
              type="material"
              color="#4690DF"
              size={28}
              containerStyle={
                settingsStore.leftHanded ? styles.leftSide : styles.rightSide
              }
              iconProps={iconProps}
              onPress={() => this.navToCapture()}
              testID={this.props.testID}
            />
          </ShowHide>
        )}
      </AnimatePresence>
    );
  }
}

const iconProps = { size: 23 } as any;

const styles = StyleSheet.create({
  rightSide: {
    position: 'absolute',
    // backgroundColor:'#4690DF',
    bottom: 35,
    // zIndex: 1,
    right: 8,
  },
  leftSide: {
    position: 'absolute',
    // backgroundColor:'#4690DF',
    bottom: 35,
    zIndex: 1000,
    left: 8,
  },
});

// Animation definition
const animation = {
  from: {
    opacity: 0,
    translateY: 70,
  },
  transition: {
    delay: 200,
  },
  animate: {
    opacity: 1,
    translateY: 0,
  },
  exit: {
    opacity: 0,
    translateY: 70,
  },
};
