import { HashtagService } from '~/common/services/hashtag.service';

const hashtagService = new HashtagService();

describe('Hashtag Service', () => {
  it('should correctly split hashtags', () => {
    expect(hashtagService.slice('cat dog rat # 1')).toEqual([]);
    expect(hashtagService.slice('#cat # d #dog rat ##')).toEqual([
      'cat',
      'dog',
    ]);
  });
});
