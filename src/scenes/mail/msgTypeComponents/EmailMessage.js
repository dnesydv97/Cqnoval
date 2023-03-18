import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {moderateScale} from 'react-native-size-matters';
import {getDisplayValue} from 'utils';

const EmailMessage = ({message = null}) => {
  return (
    <HTMLView
      value={getDisplayValue(message)}
      stylesheet={htmlStyles}
      style={{height: moderateScale(300)}}
    />
  );
};

export default EmailMessage;

const styles = StyleSheet.create({});
const htmlStyles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
});
