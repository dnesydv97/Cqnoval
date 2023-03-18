import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
} from 'styles';
import {TextField} from 'components';
import {getDisplayValue} from 'utils';

const HorizontalTextInput = ({
  label = '',
  onChangeText,
  editMode,
  inputTextStyle = {},
  placeholder = '',
  value = '',
  isSecuredText,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={{...styles.inputContainer, borderBottomWidth: editMode ? 1 : 0}}>
        <TextInput
          style={{...styles.textInput, ...inputTextStyle}}
          value={getDisplayValue(value)}
          onChangeText={onChangeText}
          placeholder={placeholder || label}
          editable={editMode}
          multiline={false}
          secureTextEntry={isSecuredText}
        />
      </View>
    </View>
  );
};

export default HorizontalTextInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: AppDimensions.SMALL,
  },
  label: {
    width: '45%',
    ...HEADING_TEXT_SIZE,
  },
  inputContainer: {
    width: '53%',
    borderColor: AppColors.DISABLE,
  },
  textInput: {
    ...NORMAL_TEXT_STYLE,
    // backgroundColor: '#E5E5E5',
    paddingVertical: AppDimensions.SMALL,
    paddingHorizontal: AppDimensions.SMALL,
    borderColor: 'grey',
    alignSelf: 'flex-end',
  },
});
