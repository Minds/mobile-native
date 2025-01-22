import Markdown, { MarkdownProps } from 'react-native-markdown-display';

type MarkDownProps = MarkdownProps & {
  disableLinks?: boolean;
  children: any;
};

export function MarkDown(props: MarkDownProps) {
  const { disableLinks, children, ...markdownProps } = props;
  if (disableLinks) {
    markdownProps.onLinkPress = () => false;
    markdownProps.style = {
      ...markdownProps.style,
      link: {
        textDecorationLine: 'none',
      },
    };
  }
  return (
    <Markdown {...markdownProps}>{fixDeepLinks(children as string)}</Markdown>
  );
}

// replace relative links with absolute app links `mindsapp://`
const fixDeepLinks = (url: string) => url.replace(/\]\(\//g, '](mindsapp://');
