---
to: "./assets/index.ts"
---
export default {
  ICON: require('./<%=camelName%>/images/icon_logo.png'),
  COMPOSE: require('./<%=camelName%>/images/compose.png'),
  EMPTY_FEED: require('./<%=camelName%>/images/emptyFeed.png'),
  LOGO: require('./<%=camelName%>/images/logo.png'),
  LOGO_WHITE: require('./<%=camelName%>/images/logo_white.png'),
  LOGO_MONO: require('./<%=camelName%>/images/logo_mono.png'),
  LOGO_MONO_WHITE: require('./<%=camelName%>/images/logo_mono_white.png'),
} as const;
