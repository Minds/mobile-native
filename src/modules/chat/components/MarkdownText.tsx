import React from 'react';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { APP_URI } from '~/config/Config';
import { regex } from '~/services';

import sp from '~/services/serviceProvider';

const markDownIt = MarkdownIt({ typographer: true, linkify: true }).disable([
  'image',
]);

const linkHandler = (url: string) => {
  sp.resolve('openURL').open(url);
  return false;
};

export default function MarkdownText({ children, dark = false }) {
  return (
    <Markdown
      markdownit={markDownIt}
      style={dark ? stylesDark : styles}
      onLinkPress={linkHandler}>
      {preprocessTags(children)}
    </Markdown>
  );
}

const preprocessTags = (text: string) =>
  text.replace(regex.tag, match => {
    const sp = match[0] === ' ' ? ' ' : '';
    if (sp) {
      match = match.substring(1);
    }
    return `${sp}[${match}](${APP_URI}${match.replace('@', '')})`;
  });

const styles = sp.styles.create({
  body: ['colorPrimaryText'],
  link: ['colorLink'],
  code_block: ['bgSecondaryBackground'],
  fence: ['bgTransparent', 'border0x'],
  code_inline: ['bgSecondaryBackground'],
  table: ['flexContainer', { minWidth: '90%' }], // fix table render inside the bubble
});

const stylesDark = sp.styles.create({
  body: ['colorPrimaryText_Dark'],
  link: ['colorLink'],
  code_block: ['bgSecondaryBackground'],
  fence: ['bgTransparent', 'border0x'],
  code_inline: ['bgSecondaryBackground'],
  table: ['flexContainer', { minWidth: '90%' }],
});
