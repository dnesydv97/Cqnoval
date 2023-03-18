import React from 'react';
import {StyleSheet, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const VerticleSeparator = (props) => {
  return <View style={{...styles.container, ...props.style}} />;
};

export default VerticleSeparator;

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 1,
    height: moderateScale(25),
  },
});
