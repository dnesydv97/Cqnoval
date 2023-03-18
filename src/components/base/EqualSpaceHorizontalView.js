import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppDimensions} from 'styles';

const EqualSpaceHorizontalView = ({children, containerStyle = {}}) => {
  return (
    <View style={{...styles.container, ...containerStyle}}>{children}</View>
  );
};

export default EqualSpaceHorizontalView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginVertical: AppDimensions.NORMAL,
  },
});
