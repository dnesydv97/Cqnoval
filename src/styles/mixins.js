import {Dimensions} from 'react-native';
import {Platform} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

//FOR DRAWER
export const DRAWER_WIDTH =
  Platform.OS == 'ios' ? moderateScale(250) : moderateScale(170);
export const DRAWER_ITEM_HEIGHT =
  Platform.OS == 'ios' ? moderateScale(40) : moderateScale(35);
export const DRAWER_ICON_SIZE =
  Platform.OS == 'ios' ? moderateScale(45) : moderateScale(45);

//For Custom ToolBar
export const TOOLBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
export const TOOLBAR_ICON_HEIGHT = Platform.OS === 'ios' ? 25 : 30;
export const TOOLBAR_LOGO_HEIGHT = Platform.OS === 'ios' ? 40 : 50;

export function boxShadow(
  color,
  offset = {height: 2, width: 2},
  radius = 2,
  opacity = 0.5,
) {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
  };
}

export const AppDimensions = {
  LARGEST: moderateScale(64),
  LARGER: moderateScale(32),
  LARGE: moderateScale(24),
  MODERATE: moderateScale(16),
  NORMAL: moderateScale(8),
  SMALL: moderateScale(4),
  SMALLER: moderateScale(2),
  SMALLEST: moderateScale(1),
  TINY: moderateScale(0.5),
};
