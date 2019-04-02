import 'react-native';
import React from 'react';

import { isObservable } from 'mobx';

import HashtagService from '../../../src/common/services/hashtag.service';

describe('Hashtag Service', () => {
  it('should correctly split hashtags', () => {
    expect(HashtagService.slice('cat dog rat # 1')).toEqual([]);
    expect(HashtagService.slice('#cat # d #dog rat ##')).toEqual(['cat', 'dog']);
  });
});
