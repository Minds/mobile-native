import 'react-native';
import React from 'react';

import { isObservable } from 'mobx';

import BlogModel from '../../src/blogs/BlogModel';
import UserModel from '../../src/channel/UserModel';
import blogFakeFactory from '../../__mocks__/fake/blogs/BlogFactory';

describe('Blog model', () => {

  it('should create a new instance', () => {
    const data = blogFakeFactory(1);

    const model = BlogModel.create(data);

    expect(model).toBeInstanceOf(BlogModel);
  });

  it('should create many new instances', () => {
    const data = [blogFakeFactory(1), blogFakeFactory(2)];

    const model = BlogModel.createMany(data);

    expect(model[0]).toBeInstanceOf(BlogModel);
    expect(model[1]).toBeInstanceOf(BlogModel);
  });

  it('should have observable properties', () => {
    const data = blogFakeFactory(1);

    const observablesProp = BlogModel.observables;
    const observablesShallowProp = BlogModel.observablesShallow;

    const model = BlogModel.create(data);

    observablesProp.forEach(o => expect(isObservable(model,o)).toBe(true));
    observablesShallowProp.forEach(o => expect(isObservable(model,o)).toBe(true));
  });

  it('should have an UserModel as ownerObj', () => {
    const data = blogFakeFactory(1);

    const model = BlogModel.create(data);

    expect(model.ownerObj).toBeInstanceOf(UserModel);
  });
});