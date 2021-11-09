import { UNIT } from '~styles/Tokens';

export const COMMON_BUTTON_STYLES = {
  LARGE: {
    minHeight: UNIT.XL2 + UNIT.S,
    paddingHorizontal: UNIT.L2,
    paddingVertical: UNIT.S,
  },
  MEDIUM: {
    minHeight: UNIT.XL2 + UNIT.XS,
    paddingHorizontal: UNIT.XXL,
    paddingVertical: UNIT.XS,
  },
  SMALL: {
    minHeight: UNIT.L2 + UNIT.XS,
    paddingHorizontal: UNIT.L,
    paddingVertical: UNIT.XXXS,
  },
  TINY: {
    minHeight: UNIT.L2 + UNIT.XS,
    paddingHorizontal: UNIT.L,
    paddingVertical: UNIT.XXXS,
  },
};

export const FLAT_BUTTON_STYLES = {
  TINY: {
    minHeight: UNIT.XXXL,
    paddingHorizontal: UNIT.S,
    paddingVertical: UNIT.XXS,
  },
  SMALL: {
    minHeight: UNIT.XXXL,
    paddingHorizontal: UNIT.S,
    paddingVertical: UNIT.XXS,
  },
  MEDIUM: {
    minHeight: UNIT.L2,
    paddingHorizontal: UNIT.S,
    paddingVertical: UNIT.XS,
  },
  LARGE: {
    minHeight: UNIT.L2 + UNIT.XS,
    paddingHorizontal: UNIT.XXL,
    paddingVertical: UNIT.XXS,
  },
};
