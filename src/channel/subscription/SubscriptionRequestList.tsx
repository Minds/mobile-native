import React, {
  Component
} from 'react';

import {
  FlatList,
  ActivityIndicator,
  Text,
  View
} from 'react-native';

import type { Node, Element } from 'react';
import type SubscriptionRequestStore from './SubscriptionRequestStore';
import { inject, observer } from 'mobx-react';

import SubscriptionRequest from './SubscriptionRequest';
import i18n from '../../common/services/i18n.service';
import { CommonStyle as CS } from '../../styles/Common';
import ErrorLoading from '../../common/components/ErrorLoading';

type PropsType = {
  subscriptionRequest: SubscriptionRequestStore
};

/**
 * Subscription list
 */
@inject('subscriptionRequest')
@observer
class SubscriptionRequestList extends Component<PropsType> {

  /**
   * Render item
   */
  renderItem = (row: any): Element<any> => {
    return (
      <SubscriptionRequest
        row={row}
        onAccept={this.onAccept}
        onReject={this.onReject}
        subscriptionRequest={this.props.subscriptionRequest}
      />
    )
  }

  onAccept = (row: any) => {

  }

  onReject = (row: any) => {

  }

  reload = () => {
    this.props.subscriptionRequest.load();
  }

  /**
   * Render
   */
  render(): Node {
    const {
      subscriptionRequest,
      ...otherProps
    } = this.props;

    let footerCmp = null, emptyCmp = null;

    if (subscriptionRequest.errorLoading) {
      footerCmp = <ErrorLoading message={i18n.t('cantLoad')} tryAgain={this.reload}/>
    } else {

      const message = subscriptionRequest.loading ?
        <ActivityIndicator size="large"/> :
        <Text style={[CS.fontM, CS.fontHairline]}>{i18n.t('discovery.nothingToShow')}</Text>

      emptyCmp = <View style={[CS.flexColumnCentered, CS.marginTop4x, CS.paddingTop2x]}>{message}</View>
    }

    return (
      <FlatList
        data={subscriptionRequest.requests}
        renderItem={this.renderItem}
        ListEmptyComponent={emptyCmp}
        ListFooterComponent={footerCmp}
        {...otherProps}
      />
    )
  }
}

export default SubscriptionRequestList;