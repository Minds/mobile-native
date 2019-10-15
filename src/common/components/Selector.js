import React, {
  Component
} from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { CommonStyle } from '../../styles/Common';

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

  close = () => {
    this.setState({show: false});
  }

  render() {
    const show = this.state.show;
    return(
      <Modal isVisible={show}>
        <View style={[styles.container]}>
          <Text style={[{color:'white'}, CommonStyle.fontXL]}> Selector Title </Text>
          <View style={{height:570}}>
            <Text style={{color:'white'}}> List </Text>
          </View>
          <Icon 
            raised
            name="md-close"
            type='ionicon'
            color='black'
            size={24}
            containerStyle={ styles.iconContainer }
            onPress={this.close}
          />
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: 200,
    height: 650,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 50,
    right: 70,
  },
  iconContainer: {
    backgroundColor:'white',
    width:55,
    height:55,
    zIndex:1000,
  },
});