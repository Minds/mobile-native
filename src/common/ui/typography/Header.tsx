import React from 'react';

import { withSpacer } from '~ui/layout';
import { Typography, TypographyPropsType } from './Typography';

type HeaderType = Omit<TypographyPropsType, 'type'>;

export const H1 = (props: HeaderType) => <Typography type="H1" {...props} />;
export const H2 = (props: HeaderType) => <Typography type="H2" {...props} />;
export const H3 = (props: HeaderType) => <Typography type="H3" {...props} />;
export const H4 = (props: HeaderType) => <Typography type="H3" {...props} />;

export const H1S = withSpacer(H1);
export const H2S = withSpacer(H2);
export const H3S = withSpacer(H3);
export const H4S = withSpacer(H4);
