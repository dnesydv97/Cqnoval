import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {AppColors, AppDimensions, SMALLER_TEXT_STYLE} from 'styles';
import {IconOutline} from '@ant-design/icons-react-native';

const LoadMore = ({containerStyle = {}, onPress, title = 'Load More'}) => {
  return (
    <TouchableOpacity
      style={{...styles.container, ...containerStyle}}
      onPress={onPress}>
      <IconOutline style={styles.icon} name="reload" />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

LoadMore.protoType = {
  containerStyle: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default LoadMore;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.PRIMARY_DARK,
    paddingVertical: AppDimensions.NORMAL,
    marginTop: AppDimensions.NORMAL,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    borderWidth: 1,
    borderRadius: 15,
    width:  120,
    borderColor: AppColors.DISABLE,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  text: {
    ...SMALLER_TEXT_STYLE,
    color: AppColors.SMOKE_WHITE,
  },
  icon: {
    marginHorizontal: AppDimensions.NORMAL,
    color: AppColors.SMOKE_WHITE,
  },
});
