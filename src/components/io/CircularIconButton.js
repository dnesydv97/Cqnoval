import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import PropTypes from 'prop-types';
import {AppColors} from 'styles';
import {moderateScale} from 'react-native-size-matters';

const CircularIconButton = ({
  icon,
  iconColor = AppColors.TAG_GREEN,
  iconSize = 30,
  onPress,
  activeOpacity = 1,
  containerStyle = {},
}) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={{...styles.container, ...containerStyle}}>
      <IconOutline
        style={styles.icon}
        name={icon}
        size={iconSize}
        color={iconColor}
        onPress={onPress}
      />
    </TouchableOpacity>
  );
};

CircularIconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
};

export default CircularIconButton;

const styles = StyleSheet.create({
  container: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: AppColors.WARNING_YELLOW,
  },
});
