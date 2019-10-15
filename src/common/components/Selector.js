import React, {
  Component
} from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import Modal from 'react-native-modal';

export default class Selector extends Component {

  /**
   * Constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {show: false};
  }

  show = () => {
    this.setState({show: true});
  }

  render() {
    const show = this.state.show;
    return(
      <Modal isVisible={show}>
        <View style={styles.container}>
          <Text style={{color:'white'}}> Selector Title </Text>
        </View>
        
      </Modal>
    )
  }
}

const styles = StyleSheet.create({

container: {
  backgroundColor: 'transparent',
  width: 200,
  height: 450,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: -150,
  right: 70
}

});