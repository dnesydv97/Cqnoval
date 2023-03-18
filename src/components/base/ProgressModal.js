import {ActivityIndicator, Modal} from '@ant-design/react-native';
import {Images, Loader} from 'assets';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {NORMAL_TEXT_STYLE} from 'styles';
import {PlainBaseModal} from 'components';

const ProgressModal = ({
  progressMessage = 'Please Wait ...',
  loading = false,
}) => {
  return (
    <PlainBaseModal onDismiss={() => {}} visibility={loading}>
      <View style={styles.container}>
        <ActivityIndicator color="white" />
        <Text style={styles.text}>{progressMessage}</Text>
      </View>
    </PlainBaseModal>
  );
};

export default ProgressModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: moderateScale(100),
    height: moderateVerticalScale(100),
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: moderateScale(8),
    textAlign: 'center',
    color: 'white',
  },
});
