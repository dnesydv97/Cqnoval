import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Swiper from 'react-native-swiper';
import {AppColors, AppDimensions, NORMAL_TEXT_STYLE} from 'styles';
import Separator from './Separator';

const EmailToggleButton = ({onToggle, isInternal}) => {
  const [isInternalActive, setInternalActive] = useState(isInternal);

  useEffect(() => {
    setInternalActive(isInternal);
  }, [isInternal]);

  function onButtonClicked(type) {
    setInternalActive(type == 'internalMessage' ? true : false);
    onToggle(type == 'internalMessage');
  }

  return (
    <View style={styles.tButtonContainer}>
      {/* <Swiper style={{justifyContent: 'space-evenly'}}> */}
      <TouchableOpacity
        activeOpacity={1}
        style={{
          ...styles.button,
          borderBottomWidth: 1,
          borderBottomColor: !isInternalActive
            ? AppColors.PRIMARY_DARK
            : AppColors.TRANSPARENT,
        }}
        onPress={() => onButtonClicked('message')}>
        <Text
          style={{
            ...styles.buttonText,
            color: !isInternalActive
              ? AppColors.PRIMARY_DARK
              : AppColors.DISABLE,
          }}>
          Mail
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          ...styles.button,
          borderBottomWidth: 1,
          borderBottomColor: isInternalActive
            ? AppColors.PRIMARY_DARK
            : AppColors.TRANSPARENT,
        }}
        onPress={() => onButtonClicked('internalMessage')}>
        <Text
          style={{
            ...styles.buttonText,
            color: isInternalActive
              ? AppColors.PRIMARY_DARK
              : AppColors.DISABLE,
          }}>
          Message
        </Text>
      </TouchableOpacity>
      {/* </Swiper> */}
    </View>
  );
};

export default EmailToggleButton;
const styles = StyleSheet.create({
  tButtonContainer: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.LIGHT_GRAY,
    // marginVertical: AppDimensions.NORMAL,
  },
  button: {
    width: '50%',
    height: '100%',
    padding: AppDimensions.NORMAL,
  },
  buttonText: {
    ...NORMAL_TEXT_STYLE,
    textAlign: 'center',
  },
});
