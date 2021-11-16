import React from 'react';
import { Typography, TypographyPropsType } from './Typography';

type BodyType = Omit<TypographyPropsType, 'type'>;

export const B1 = (props: BodyType) => <Typography type="B1" {...props} />;
export const B2 = (props: BodyType) => <Typography type="B2" {...props} />;
export const B3 = (props: BodyType) => <Typography type="B3" {...props} />;
export const B4 = (props: BodyType) => <Typography type="B4" {...props} />;
