import React, {useEffect, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {WarningTypes, WarningLength} from 'constant';
import {AppColors, NORMAL_TEXT_STYLE, WINDOW_WIDTH} from 'styles';
import {moderateVerticalScale} from 'react-native-size-matters';

const WarningView = ({
  type = WarningTypes.SUCCESS,
  message,
  length = WarningLength.SHORT,
  showWarning = false,
}) => {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(showWarning);
  }, [showWarning]);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, length);
  }, []);

  return isVisible ? (
    <View style={[styles.container, getStyle(type)]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  ) : null;
};

WarningView.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string.isRequired,
  length: PropTypes.number,
  showWarning: PropTypes.bool,
};

export default WarningView;

const getStyle = (type) => {
  if (type === WarningTypes.SUCCESS) {
    return {
      backgroundColor: AppColors.SUCCESS_GREEN,
    };
  } else if (type === WarningTypes.FAILED) {
    return {
      backgroundColor: AppColors.ERROR_RED,
    };
  } else if (type === WarningTypes.INFO) {
    return {
      backgroundColor: AppColors.INFO_BLUE,
    };
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.SUCCESS_GREEN,
    height: moderateVerticalScale(30),
    justifyContent: 'center',
    position: 'absolute',
    width: WINDOW_WIDTH,
    bottom: 0,
    elevation: 1,
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.SMOKE_WHITE,
    alignSelf: 'center',
  },
});
