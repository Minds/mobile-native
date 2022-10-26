---
to: "<%= assets ? `${absPath}/screens/${dashName}/assets/index.tsx` : null %>"
sh: "<%= assets ? `cp src/assets/images/asset.svg ${absPath}/screens/${dashName}/assets/${camelName}.svg` : null%>"
---
import React from 'react';
import { SvgProps } from 'react-native-svg';
import { SvgAsset } from 'components/.';
import <%= CamelName%>SVG from './<%= camelName%>.svg';

export const <%= CamelName%> = (props: SvgProps): JSX.Element => {
  return <SvgAsset {...{ Component: <%= CamelName%>SVG, ...props }} />
};
