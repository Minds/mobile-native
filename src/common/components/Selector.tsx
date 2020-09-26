import React, { Component } from 'react';
import { FlatList, StyleSheet, TextStyle } from 'react-native';
import { Text } from 'react-native-elements';
import { CommonStyle } from '../../styles/Common';
import ThemedStyles from '../../styles/ThemedStyles';
import ModalPicker from './ModalPicker';
import Touchable from './Touchable';

type PropsType = {
  data: Array<Object>;
  valueExtractor: Function;
  keyExtractor: Function;
  title?: string;
  onItemSelect: Function;
  textStyle?: TextStyle;
  backdropOpacity?: number;
  children?: (onItemSelect: any) => any;
};

export default class Selector extends Component<PropsType> {
  state = {
    show: false,
    selected: '',
  };

  flatListRef = React.createRef<FlatList<any>>();

  show = (item) => {
    this.setState({ show: true, selected: item });

    // SCROLL TO INDEX IF SELECTED
    setTimeout(() => {
      if (this.state.selected) {
        const itemToScrollTo = this.props.data.find(
          (item) => this.props.keyExtractor(item) === this.state.selected,
        );
        this.flatListRef.current?.scrollToIndex({
          animated: false,
          index: this.props.data.indexOf(itemToScrollTo || 0),
        });
      }
    }, 500);
  };

  close = () => {
    this.setState({ show: false });
  };

  renderItem = ({ item }) => {
    const theme = ThemedStyles.style;
    const fontColor = this.isSelected(item)
      ? styles.selectedColorFont
      : styles.fontColor;
    return (
      <Touchable
        onPress={() => this.itemSelect(item)}
        style={CommonStyle.margin2x}>
        <Text
          style={[
            fontColor,
            theme.fontXL,
            theme.centered,
            this.props.textStyle,
          ]}>
          {this.valueExtractor(item)}
        </Text>
      </Touchable>
    );
  };

  itemSelect = (item) => {
    this.props.onItemSelect(
      this.props.data.find((p) => this.props.keyExtractor(p) === item),
    );
    this.close();
  };

  isSelected = (item) => {
    return this.state.selected === this.keyExtractor(item);
  };

  setSelected = (item) => {
    this.setState({ selected: this.keyExtractor(item) });
  };

  valueExtractor = (item) => {
    return this.props.valueExtractor(item);
  };

  keyExtractor = (item) => {
    return this.props.keyExtractor(item);
  };

  render() {
    const modal = (
      <ModalPicker
        onSelect={this.itemSelect}
        onCancel={this.close}
        show={this.state.show}
        title={this.props.title}
        valueExtractor={this.props.valueExtractor}
        keyExtractor={this.props.keyExtractor}
        value={this.state.selected}
        items={this.props.data}
      />
    );

    if (this.props.children) {
      return [this.props.children(this.show), modal];
    }

    return modal;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: 'transparent',
    width: 55,
    height: 55,
    zIndex: 1000,
  },
  fontColor: {
    color: '#fff',
  },
  selectedColorFont: {
    color: '#0085DD',
  },
  marginBottom: {
    marginBottom: 30,
  },
});
