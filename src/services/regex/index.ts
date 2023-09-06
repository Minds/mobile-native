const shortUrl =
  /(^|\b)([-A-Z0-9à-œ+&@#\/%?=~_|!:,.;]+\.(?:com|org|net)\/[-A-Z0-9à-œ+&@#\/%=~_|\(\)]*)/im;
/(^|\b)([-A-Z0-9à-œ+&@#\/%?=~_|!:,.;]+\.(?:com|org|net)\/[-A-Z0-9à-œ+&@#\/%=~_|\(\)]*)/im;

const url =
  /(^|\b)(\b(?:https?|http|ftp):\/\/[-A-Z0-9à-œ+&@#\/%?=~_|!:,.;\(\)]*[-A-Z0-9à-œ+&@#\/%=~_|])/im;

const wwwUrl =
  /(^|\b)(www\.[-A-Z0-9à-œ+&@#\/%?=~_|!:,.;]*[-A-Z0-9à-œ+&@#\/%=~_|\(\)]*)/im;

const tag =
  /(^|\W|\s)@([a-z0-9_\-\.]+[a-z0-9_](?:@[a-z0-9_\-]+\.[a-z]{2,}(?:\.[a-z]{2,})?)?)\b/im;

export const regex = {
  hash: new RegExp(
    [
      '([^&]|\\B|^)', // Start of string, and word boundary. Not if preceded by & symbol
      '#', //
      '([',
      '\\wÀ-ÿ', // All Latin words + accented characters
      '\\u0E00-\\u0E7F', // Unicode range for Thai
      '\\u2460-\\u9FBB', // Unicode range for Japanese but may be overly zealous
      ']+)',
    ].join(''),
    'gim',
  ),
  cash: new RegExp(
    [
      '([^&]|\\b|^)', // Start of string, and word bounday. Not if preceeded by & symbol
      '\\$', //
      '([',
      'A-Za-z',
      ']+)',
    ].join(''),
    'gim', // Global, Case insensitive, Multiline
  ),
  url,
  shortUrl,
  wwwUrl,
  tag,
};
