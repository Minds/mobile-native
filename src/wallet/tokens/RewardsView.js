import React, {
  Component
} from 'react';

import {
  Text,
  FlatList,
  View,
  TouchableOpacity
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'
import DateTimePicker from 'react-native-modal-datetime-picker';

import { CommonStyle } from '../../styles/Common';
import CenteredLoading from '../../common/components/CenteredLoading';
import token from "../../common/helpers/token";

import i18n from '../../common/services/i18n.service';

/**
 * Rewards view
 */
@inject('wallet')
@observer
export default class RewardsView extends Component {

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    this.props.wallet.ledger.list.clearList();
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    this.props.wallet.ledger.list.clearList();

    const end = new Date();
    const start   = new Date();

    end.setHours(23, 59, 59);
    start.setMonth(start.getMonth() - 1);
    start.setHours(0, 0, 0);

    this.setState({
      fromVisible: false,
      toVisible: false,
      from: start,
      to: end
    }, () => {
      this.loadMore();
    });
  }

  /**
   * Render
   */
  render() {
    const wallet = this.props.wallet;
    const entities = wallet.ledger.list.entities;

    if (!wallet.ledger.list.loaded) {
      return <CenteredLoading />
    }

    const header = this.getHeader();

    return (
      <FlatList
        data={entities.slice()}
        renderItem={this.renderRow}
        keyExtractor={(item, index) => item.timestamp+index}
        onRefresh={this.refresh}
        refreshing={wallet.ledger.list.refreshing}
        onEndReached={this.loadMore}
        onEndThreshold={0}
        ListHeaderComponent={header}
        style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite]}
      />
    )
  }

  /**
   * Get header
   */
  getHeader() {
    return (
      <View style={[CommonStyle.padding, CommonStyle.rowJustifyCenter]}>
        <TouchableOpacity onPress={this.showFrom}>
          <Text style={CommonStyle.fontS}>FROM: <Text style={[CommonStyle.colorPrimary, CommonStyle.fontL]}>{i18n.l('date.formats.small', this.state.from)}</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.showTo} style={CommonStyle.paddingLeft2x}>
          <Text style={CommonStyle.fontS}>TO: <Text style={[CommonStyle.colorPrimary, CommonStyle.fontL]}>{i18n.l('date.formats.small', this.state.to)}</Text></Text>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={this.state.fromVisible}
          onConfirm={this.setFrom}
          date={this.state.from}
          onCancel={this.hideFrom}
          />
        <DateTimePicker
          isVisible={this.state.toVisible}
          onConfirm={this.setTo}
          date={this.state.to}
          onCancel={this.hideTo}
        />
      </View>
    )
  }

  showTo = () => {
    this.setState({ toVisible: true });
  }

  showFrom = () => {
    this.setState({ fromVisible: true });
  }

  hideTo = () => {
    this.setState({ toVisible: false });
  }

  hideFrom = () => {
    this.setState({ fromVisible: false });
  }


  setTo = (value) => {
    this.setState({toVisible: false, to: value}, () => {
      this.refresh();
    });
  }

  setFrom = (value) => {
    console.log(value)
    this.setState({fromVisible: false, from: value}, () => {
      this.refresh();
    });
  }

  loadMore = () => {
    this.props.wallet.ledger.loadList(this.state.from, this.state.to);
  }

  renderRow = (row) => {
    const item = row.item;
    return (
      <View style={[CommonStyle.padding]}>
        <Text style={[CommonStyle.fontXL, {color: 'green'}]}>+ {token(item.amount)}</Text>
        <View style={CommonStyle.rowJustifyStart}>
          <Text style={[CommonStyle.fontS, CommonStyle.flexContainer]}>{item.type.toUpperCase()}</Text>
          <Text style={[CommonStyle.fontS]}>{i18n.l('date.formats.small', item.timestamp)}</Text>
        </View>
      </View>
    )
  }

  refresh = () => {
    this.props.wallet.ledger.refresh(this.state.from, this.state.to);
  }
}
