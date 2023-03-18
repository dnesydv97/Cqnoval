import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {CircularIconButton} from 'components';
import {
  AppColors,
  AppDimensions,
  SMALLER_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';

const AddMoreButton = ({
  icon = 'plus',
  title = 'Add More',
  onPress,
  containerStyle = {},
}) => {
  return (
    <TouchableOpacity
      style={{...styles.buttonContainer, ...containerStyle}}
      onPress={onPress}>
      <CircularIconButton
        onPress={onPress}
        icon={icon}
        iconSize={15}
        iconColor="white"
        containerStyle={styles.icon}
      />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AddMoreButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.PRIMARY_DARK,
    borderRadius: AppDimensions.LARGE,
    marginVertical: AppDimensions.SMALL,
    width: moderateScale(85),
    height: moderateVerticalScale(30),
  },
  icon: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
  text: {
    ...SMALLER_TEXT_STYLE,
    color: 'white',
  },
});
