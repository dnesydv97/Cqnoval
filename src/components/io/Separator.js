import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppColors} from 'styles';

const Separator = ({
  color = AppColors.DISABLE,
  width = 1,
  containerStyle = {},
}) => {
  return (
    <View
      style={{
        backgroundColor: color,
        height: width,
        ...containerStyle,
      }}
    />
  );
};

export default Separator;

const styles = StyleSheet.create({});
