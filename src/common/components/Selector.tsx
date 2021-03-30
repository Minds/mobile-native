import React, { Component } from 'react';
import { FlatList, StyleSheet, TextStyle, View } from 'react-native';
import Modal from 'react-native-modal';
import { Icon, Text } from 'react-native-elements';
import { CommonStyle } from '../../styles/Common';
import ThemedStyles from '../../styles/ThemedStyles';
import Touchable from './Touchable';

type PropsType = {
  data: Array<Object>;
  valueExtractor: Function;
  keyExtractor: Function;
  title?: string;
  onItemSelect: Function;
  textStyle?: TextStyle | TextStyle[];
  backdropOpacity?: number;
  children?: (onItemSelect: any) => any;
};

export default class Selector extends Component<PropsType> {
  state = {
    show: false,
    selected: '',
  };

  flatListRef = React.createRef<FlatList<any>>();

  show = (item?) => {
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
      ? theme.colorLink
      : theme.colorPrimaryText;
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
    this.props.onItemSelect(item);
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
    const theme = ThemedStyles.style;

    const modal = (
      <Modal
        backdropColor={ThemedStyles.getColor('primary_background_highlight')}
        isVisible={this.state.show}
        backdropOpacity={this.props.backdropOpacity}>
        <View style={[styles.container]}>
          <Text
            style={[
              theme.colorPrimaryText,
              theme.fontXXL,
              styles.marginBottom,
              theme.centered,
            ]}>
            {this.props.title}
          </Text>
          <View
            style={[
              theme.flexContainer,
              theme.marginTop3x,
              theme.paddingLeft2x,
              styles.marginBottom,
            ]}>
            <FlatList
              data={this.props.data}
              renderItem={this.renderItem}
              extraData={this.state.selected}
              ref={this.flatListRef}
              onScrollToIndexFailed={() =>
                this.flatListRef.current?.scrollToEnd()
              }
            />
          </View>
          <Icon
            raised
            name="md-close"
            type="ionicon"
            color="black"
            size={24}
            containerStyle={styles.iconContainer}
            onPress={this.close}
          />
        </View>
      </Modal>
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
  marginBottom: {
    marginBottom: 30,
  },
});
