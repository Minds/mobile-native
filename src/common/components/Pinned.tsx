import React, {
  Component,
} from 'react';
import { observer } from 'mobx-react'
import {
  StyleSheet,
} from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/Colors';


// types
type Props = {
  entity: Object
};

/**
 * Pinned icon
 */
@observer
export default class Pinned<Props> extends Component {

  /**
   * Render
   */
  render() {
    if (!this.props.entity.pinned) return null;
    return (
      <IconMaterial
        name="turned-in"
        color={colors.medium}
        size={25}
        style={styles.pinned}
      />
    );
  }
}

/** styles */
const styles = StyleSheet.create({
  pinned: {
    position: 'absolute',
    right:10,
    top: -5
  }
})