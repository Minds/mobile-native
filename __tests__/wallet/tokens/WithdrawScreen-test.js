import 'react-native';
import React from 'react';

import { observable, useStrict } from 'mobx';

import WithdrawScreen from '../../../src/wallet/tokens/WithdrawScreen';

import { shallow } from 'enzyme';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import userStoreMockFactory from '../../../__mocks__/stores/user.store';
import withdrawStoreMockFactory from '../../../__mocks__/stores/withdraw.store';

import componentOrWrappedComponent from '../../../tests-helpers/component-or-wrapped-component';
import { FlatList } from 'react-native';
import JoinView from '../../../src/wallet/tokens/JoinView';

describe('WithdrawScreen', () => {
  let user, withdraw, screen;

  beforeEach(() => {
    useStrict(false);

    user = observable(userStoreMockFactory());
    withdraw = observable(withdrawStoreMockFactory());

    user.me.rewards = true;

    screen = shallow(
      <WithdrawScreen.wrappedComponent user={user} withdraw={withdraw} />
    );
  });

  it('renders correctly', () => {
    const renderedScreen = renderer.create(
      <WithdrawScreen.wrappedComponent user={user} withdraw={withdraw} />
    );

    expect(renderedScreen.toJSON()).toMatchSnapshot();
  });

  it('should have a flatlist', async () => {
    await screen.instance().componentWillMount();
    screen.update();

    expect(screen.find(FlatList)).toHaveLength(1);
  });

  it('should show join component', async () => {
    user.me.rewards = false;

    await screen.instance().componentWillMount();
    screen.update();

    expect(screen.findWhere(componentOrWrappedComponent(JoinView)))
      .toHaveLength(1);
  })
});
