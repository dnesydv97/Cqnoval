import React from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {AppColors, boxShadow} from 'styles';
import {IconOutline} from '@ant-design/icons-react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';

const FloatingActionButton = ({
  icon = 'plus',
  localIcon = null,
  size = 30,
  color = AppColors.SMOKE_WHITE,
  containerStyle = {},
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{...styles.container, ...containerStyle}}
      onPress={onPress}>
      {localIcon ? (
        <Image
          source={localIcon}
          style={{height: 25, width: 25}}
          resizeMode="contain"
        />
      ) : (
        <IconOutline name={icon} size={size} color={color} />
      )}
    </TouchableOpacity>
  );
};

export default FloatingActionButton;

const styles = StyleSheet.create({
  container: {
    ...boxShadow(AppColors.NORMAL_BLACK),
    backgroundColor: AppColors.PRIMARY_DARK,
    height: moderateScale(43),
    width: moderateScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(40),
    position: 'absolute',
    right: moderateScale(20),
    bottom: moderateVerticalScale(15),
  },
});
