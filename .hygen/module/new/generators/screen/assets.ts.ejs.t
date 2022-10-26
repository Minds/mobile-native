---
to: "<%= `${absPath}/.hygen/screen/new/assets.ts.ejs.t` %>"
---
---
to: "<%%= assets ? `${relPath}/assets/index.tsx` : null %>"
sh: "<%%= assets ? `cp ../../../src/assets/images/asset.svg ${relPath}/assets/${camelName}.svg` : null%>"
---
import React from 'react';
import { SvgProps } from 'react-native-svg';
import { SvgAsset } from 'components/.';
import <%%= CamelName%>SVG from './<%%= camelName%>.svg';

export const <%%= CamelName%> = (props: SvgProps): JSX.Element => {
  return <SvgAsset {...{ Component: <%%= CamelName%>SVG, ...props }} />;
}
