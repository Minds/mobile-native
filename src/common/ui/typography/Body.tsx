import React from 'react';
import { Typography, TypographyPropsType } from './Typography';
import { withSpacer } from '~ui/layout';

type BodyType = Omit<TypographyPropsType, 'type'>;

export const B1 = (props: BodyType) => <Typography type="B1" {...props} />;
export const B2 = (props: BodyType) => <Typography type="B2" {...props} />;
export const B3 = (props: BodyType) => <Typography type="B3" {...props} />;

export const B1S = withSpacer(B1);
export const B2S = withSpacer(B2);
export const B3S = withSpacer(B3);
