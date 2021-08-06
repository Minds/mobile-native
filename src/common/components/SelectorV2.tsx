import React, { Component } from 'react';
import { FlatList, Text, TextStyle } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { BottomSheetButton, BottomSheet, MenuItem } from './bottom-sheet';
import i18n from '../../common/services/i18n.service';

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
  bottomSheetRef = React.createRef<any>();

  show = (item?) => {
    this.setState({ show: true, selected: item });

    // SCROLL TO INDEX IF SELECTED
    setTimeout(() => {
      if (this.state.selected) {
        const itemToScrollTo = this.props.data.find(
          item => this.props.keyExtractor(item) === this.state.selected,
        );
        this.flatListRef.current?.scrollToIndex({
          animated: true,
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
      <MenuItem
        onPress={() => this.itemSelect(item)}
        textStyle={{ color: fontColor.color }}
        title={this.valueExtractor(item)}
        style={styles.menuItem}
      />
    );
  };

  itemSelect = item => {
    this.props.onItemSelect(item);
    this.close();
  };

  isSelected = item => {
    return this.state.selected === this.keyExtractor(item);
  };

  setSelected = item => {
    this.setState({ selected: this.keyExtractor(item) });
  };

  valueExtractor = item => {
    return this.props.valueExtractor(item);
  };

  keyExtractor = item => {
    return this.props.keyExtractor(item);
  };

  render() {
    const theme = ThemedStyles.style;

    const modal = this.state.show && (
      <BottomSheet ref={this.bottomSheetRef} autoShow onDismiss={this.close}>
        {Boolean(this.props.title) && (
          <Text
            style={[
              theme.colorPrimaryText,
              theme.fontXXL,
              theme.centered,
              theme.marginLeft5x,
            ]}>
            {this.props.title}
          </Text>
        )}
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem}
          extraData={this.state.selected}
          style={styles.flatList}
          ref={this.flatListRef}
          onScrollToIndexFailed={() => this.flatListRef.current?.scrollToEnd()}
        />
        <BottomSheetButton text={i18n.t('cancel')} onPress={this.close} />
      </BottomSheet>
    );

    if (this.props.children) {
      return [this.props.children(this.show), modal];
    }

    return modal;
  }
}

const styles = ThemedStyles.create({
  menuItem: ['paddingHorizontal5x', 'rowJustifyCenter'],
  flatList: { maxHeight: 300, overflow: 'scroll' },
});
