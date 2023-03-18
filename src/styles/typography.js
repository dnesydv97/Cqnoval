import {scaleFont} from './mixins';
import {AppColors} from './index';
import {moderateScale} from 'react-native-size-matters';

// FONT FAMILY
export const FONT_FAMILY_REGULAR = 'OpenSans-Regular';
export const FONT_FAMILY_BOLD = 'OpenSans-Bold';
export const FONT_FAMILY_LIGHT = 'OpenSans-Light';
export const FONT_FAMILY_LIGHT_ITALIC = 'OpenSans-LightItalic';

//KARLA FONT FAMILY
export const KARLA_FAMILY_REGULAR = 'typeface-karla';

// FONT WEIGHT
export const FONT_WEIGHT_REGULAR = '400';
export const FONT_WEIGHT_BOLD = '700';

const textStyle = {
  color: AppColors.PRIMARY_TEXT,
  fontSize: moderateScale(14),
};

export const HEADING_TEXT_SIZE = {
  ...textStyle,
  fontSize: moderateScale(16),
};
export const LARGE_HEADING_TEXT_SIZE = {
  ...textStyle,
  fontSize: moderateScale(20),
};
export const NORMAL_HEADING_TEXT_SIZE = {
  ...textStyle,
  fontSize: moderateScale(14),
  fontWeight: FONT_WEIGHT_BOLD,
};

export const XXX_TEXT_SIZE = {
  ...textStyle,
  fontSize: moderateScale(80),
};
export const NORMAL_TEXT_STYLE = {
  ...textStyle,
};
export const SMALL_TEXT_STYLE = {
  ...textStyle,
  fontSize: moderateScale(12),
};
export const SMALLER_TEXT_STYLE = {
  ...textStyle,
  fontSize: moderateScale(10),
};
export const SMALLEST_TEXT_STYLE = {
  ...textStyle,
  fontSize: moderateScale(8),
};

export const SUB_HEADING_TEXT_STYLE = {
  ...textStyle,
  fontSize: moderateScale(32),
};
