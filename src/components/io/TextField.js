import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
} from 'styles';
import {getDisplayValue, isIos} from 'utils';

const TextField = ({
  label = '',
  value = '',
  error = '',
  onChangeText,
  editable = false,
  placeholder = '',
  containerStyle = {},
  labelStyle = {},
  errorTextStyle = {},
  inputTextContainerStyle = {},
  inputTextStyle = {},
  isSecuredText = false,
  multiline = false,
  numberOfLines,
  right,
  returnKeyType,
  returnKeyLabel,
  onKeyPress,
  onSubmitEditing,
}) => {
  return (
    <View style={{...styles.container, ...containerStyle}}>
      {!!label && (
        <Text
          style={{
            ...styles.labelText,
            ...labelStyle,
          }}>
          {label}
        </Text>
      )}
      <View
        style={{
          ...styles.inputContainer,
          ...inputTextContainerStyle,
          borderColor: editable ? 'black' : 'grey',
        }}>
        <TextInput
          style={{
            ...styles.text,
            ...inputTextStyle,
          }}
          value={getDisplayValue(value)}
          onChangeText={onChangeText}
          placeholder={placeholder || label}
          editable={editable}
          multiline={multiline}
          secureTextEntry={isSecuredText}
          numberOfLines={numberOfLines}
          right={right}
          returnKeyType={returnKeyType}
          returnKeyLabel={returnKeyLabel}
          onKeyPress={onKeyPress}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
      {!!error && (
        <Text style={{...styles.errorText, ...errorTextStyle}}>{error}</Text>
      )}
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({
  container: {
    marginVertical: AppDimensions.SMALL,
  },
  labelText: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.ACCENT,
  },
  errorText: {
    ...SMALLER_TEXT_STYLE,
    color: AppColors.ERROR_RED,
  },
  inputContainer: {
    paddingHorizontal: isIos ? AppDimensions.NORMAL : 0,
    borderColor: AppColors.DISABLE,
    borderRadius: AppDimensions.SMALL,
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: AppDimensions.NORMAL,
    borderColor: 'grey',
  },
});
