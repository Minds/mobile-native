import { FONT_SIZES, UNIT } from '~styles/Tokens';

export const TYPES = {
  H1: {
    fontSize: FONT_SIZES.XXXL,
    lineHeight: UNIT.XL + UNIT.L,
  },
  H2: {
    fontSize: FONT_SIZES.XXL,
    lineHeight: UNIT.L * 2,
  },
  H3: {
    fontSize: FONT_SIZES.XL,
    lineHeight: UNIT.XXXL,
  },
  H4: {
    fontSize: FONT_SIZES.L,
    lineHeight: UNIT.XXXL,
  },
  B1: {
    fontSize: FONT_SIZES.M,
    lineHeight: UNIT.XXL,
  },
  B2: {
    fontSize: FONT_SIZES.S,
    lineHeight: UNIT.XL,
  },
  B3: {
    fontSize: FONT_SIZES.XS,
    lineHeight: UNIT.L,
  },
  B4: {
    fontSize: FONT_SIZES.XXS,
    lineHeight: UNIT.L,
  },
  Btn1: {
    fontSize: FONT_SIZES.L,
    lineHeight: UNIT.XXL,
  },
  Btn2: {
    fontSize: FONT_SIZES.M,
    lineHeight: UNIT.XL,
  },
  Btn3: {
    fontSize: FONT_SIZES.S,
    lineHeight: UNIT.XL,
  },
};

// FLAT is for typography components that would not rely on lineHeight to attach to the grid
// In this case, it uses the closest UNIT to the FONT-SIZE
export const FLAT = {
  H1: {
    lineHeight: UNIT.L2,
  },
  H2: {
    lineHeight: UNIT.XXL,
  },
  H3: {
    lineHeight: UNIT.XL,
  },
  H4: {
    lineHeight: UNIT.XL,
  },
  B1: {
    lineHeight: UNIT.L,
  },
  B2: {
    lineHeight: UNIT.L,
  },
  B3: {
    lineHeight: UNIT.M,
  },
  B4: {
    lineHeight: UNIT.M,
  },
  button1: {
    lineHeight: UNIT.XXL,
  },
  button2: {
    lineHeight: UNIT.L,
  },
  button3: {
    lineHeight: UNIT.XL,
  },
};
