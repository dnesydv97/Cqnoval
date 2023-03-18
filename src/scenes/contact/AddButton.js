import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {CircularIconButton} from 'components';
import {moderateScale} from 'react-native-size-matters';
import {AppColors, AppDimensions, NORMAL_TEXT_STYLE} from 'styles';

const AddButton = ({onPress, title = 'Add More'}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress && onPress}>
      <CircularIconButton
        icon="plus"
        iconSize={15}
        containerStyle={styles.roundButton}
        onPress={onPress && onPress}
      />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  roundButton: {
    borderWidth: 0.5,
    borderColor: AppColors.TAG_GREEN,
    marginVertical: AppDimensions.NORMAL,
    height: moderateScale(20),
    width: moderateScale(20),
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    fontWeight: 'bold',
    marginHorizontal: AppDimensions.NORMAL,
    marginVertical: AppDimensions.NORMAL,
    textTransform: 'lowercase',
  },
});
