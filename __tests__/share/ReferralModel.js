import 'react-native';
import React from 'react';

import { isObservable } from 'mobx';

import ReferralModel from '../../src/share/ReferralModel';
import referralFakeFactory from '../../__mocks__/fake/referral/ReferralFactory';

describe('Referral model', () => {

  it('should create a new instance', () => {
    const data = referralFakeFactory();

    const model = ReferralModel.create(data[0]);

    expect(model).toBeInstanceOf(ReferralModel);
  });

  it('should create many new instances', () => {
    const data = referralFakeFactory();

    const model = ReferralModel.createMany(data);

    expect(model[0]).toBeInstanceOf(ReferralModel);
    expect(model[1]).toBeInstanceOf(ReferralModel);
    expect(model[2]).toBeInstanceOf(ReferralModel);
    expect(model[3]).toBeInstanceOf(ReferralModel);
  });

});