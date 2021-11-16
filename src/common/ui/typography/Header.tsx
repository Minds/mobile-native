import React from 'react';

import { Typography, TypographyPropsType } from './Typography';

type HeaderType = Omit<TypographyPropsType, 'type'>;

export const H1 = (props: HeaderType) => (
  <Typography type="H1" font="bold" {...props} />
);
export const H2 = (props: HeaderType) => (
  <Typography type="H2" font="bold" {...props} />
);
export const H3 = (props: HeaderType) => (
  <Typography type="H3" font="bold" {...props} />
);
export const H4 = (props: HeaderType) => (
  <Typography type="H4" font="bold" {...props} />
);
