import { regex } from './index';

describe('regex service', () => {
  it('tag: it should match usernames', () => {
    expect(regex.tag.test('@someuser')).toBe(true);
    expect(regex.tag.test('hey @someuser final')).toBe(true);
    expect(regex.tag.test('hey @other@minds.com')).toBe(true);
  });
  it('tag: it should match usernames with underscor', () => {
    expect(regex.tag.test('@some_user')).toBe(true);
    expect(regex.tag.test('hey @some_user final')).toBe(true);
  });
  it('tag: it should match usernames with mixed case', () => {
    expect(regex.tag.test('@SoMeUser')).toBe(true);
  });
  it('tag: it should match usernames at domains', () => {
    expect(regex.tag.test('hey @other@minds.com')).toBe(true);
  });
  it('tag: it should split the string by usernames correctly', () => {
    // needed by the Tags commponent
    const str = '@mdeveloper3 hash #minds @msantangelo@minds.com';
    const results = str.split(regex.tag);
    expect(results).toEqual([
      '',
      '',
      'mdeveloper3',
      undefined,
      ' hash #minds',
      ' ',
      'msantangelo@minds.com',
      undefined,
      '',
    ]);
  });

  it('url: it should match urls', () => {
    expect(regex.url.test('https://www.minds.com')).toBe(true);
    expect(regex.url.test('http://www.minds.com')).toBe(true);
    expect(regex.url.test('ftp://www.minds.com')).toBe(true);
  });
  it('url: it should split the string by urls correctly', () => {
    const str = 'https://www.minds.com';
    const results = str.split(regex.url);
    expect(results).toEqual(['', '', 'https://www.minds.com', '']);
  });
  it('shortUrl: it should match short urls', () => {
    expect(regex.url.test('https://minds.com')).toBe(true);
    expect(regex.url.test('http://minds.com')).toBe(true);
    expect(regex.url.test('ftp://minds.com')).toBe(true);
  });

  it('hash: it should match hashes', () => {
    expect(regex.hash.test('#minds')).toBe(true);
  });
});
