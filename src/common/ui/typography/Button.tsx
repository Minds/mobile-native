import React from 'react';
import { Typography, TypographyPropsType } from './Typography';

type BodyType = Omit<TypographyPropsType, 'type'>;

export const Btn1 = (props: BodyType) => <Typography type="Btn1" {...props} />;
export const Btn2 = (props: BodyType) => <Typography type="Btn2" {...props} />;
export const Btn3 = (props: BodyType) => <Typography type="Btn3" {...props} />;
