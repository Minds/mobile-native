import React, {
  Component,
} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { CommonStyle } from '../../styles/Common';
import Touchable from './Touchable';
import PropTypes from 'prop-types';

export default class Selector extends Component {

  /**
   * Constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      selected: '',
    };
  }

  show = () => {
    this.setState({show: true});
  }

  close = () => {
    this.setState({show: false});
  }

  renderItem = ({item}) => {
    return (
      <Touchable onPress={() => this.itemSelect(item)}>
        <Text style={[{color:'white'}]}>{this.valueExtractor(item)}</Text>
      </Touchable>
    );
  };

  itemSelect = (item) => {
    this.props.onItemSelect(item);
    this.close();
  }

  setSelected = (item) => {
    this.setState({selected: this.valueExtractor(item)});
  }

  valueExtractor = (item) => {
    return this.props.valueExtractor(item);
  }

  keyExtractor = (item) => {
    return this.props.keyExtractor(item);
  }

  render() {
    return(
      <View>
        <Modal isVisible={this.state.show}>
          <View style={[styles.container]}>
            <Text style={[{color:'white'}, CommonStyle.fontXL]}> {this.props.title} </Text>
            <View style={[ CommonStyle.flexContainer ]}>
              <FlatList
                data={this.props.data}
                renderItem={this.renderItem}
                keyExtractor={this.props.keyExtractor}
              />
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
      </View>
    )
  }
}

Selector.propTypes = {
  data: PropTypes.array.isRequired,
  valueExtractor: PropTypes.func.isRequired,
  keyExtractor: PropTypes.func.isRequired,
  title: PropTypes.string,
  onItemSelect: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: 200,
    height: 450,
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