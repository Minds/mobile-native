import {
  FONT_FAMILY_REGULAR,
  FONT_FAMILY_MEDIUM,
  FONT_FAMILY_BOLD,
  FONT_FAMILY_BLACK,
  FONT_SIZES,
  UNIT,
} from '~styles/Tokens';

export const FAMILY = {
  regular: FONT_FAMILY_REGULAR,
  medium: FONT_FAMILY_MEDIUM,
  bold: FONT_FAMILY_BOLD,
  black: FONT_FAMILY_BLACK,
};

export const TYPES = {
  header1: {
    fontSize: FONT_SIZES.XXXL,
    lineHeight: UNIT.XL + UNIT.L,
  },
  header2: {
    fontSize: FONT_SIZES.XXL,
    lineHeight: UNIT.L * 2,
  },
  header3: {
    fontSize: FONT_SIZES.XL,
    lineHeight: UNIT.XXXL,
  },
  header4: {
    fontSize: FONT_SIZES.L,
    lineHeight: UNIT.XXXL,
  },
  body1: {
    fontSize: FONT_SIZES.M,
    lineHeight: UNIT.XXL,
  },
  body2: {
    fontSize: FONT_SIZES.S,
    lineHeight: UNIT.XL,
  },
  body3: {
    fontSize: FONT_SIZES.XS,
    lineHeight: UNIT.L,
  },
  button1: {
    fontSize: FONT_SIZES.L,
    lineHeight: UNIT.XXL,
  },
  button2: {
    fontSize: FONT_SIZES.M,
    lineHeight: UNIT.XL,
  },
  button3: {
    fontSize: FONT_SIZES.S,
    lineHeight: UNIT.XL,
  },
};
