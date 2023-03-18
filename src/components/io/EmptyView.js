import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors, AppDimensions, HEADING_TEXT_SIZE} from 'styles';

const EmptyView = ({message}) => {
  return (
    <View style={styles.container}>
      <IconOutline name="robot" size={80} color={AppColors.DISABLE} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

EmptyView.protoType = {
  message: PropTypes.string.isRequired,
};

export default EmptyView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...HEADING_TEXT_SIZE,
    color: AppColors.DISABLE,
  },
});
