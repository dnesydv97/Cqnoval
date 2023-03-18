import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';

const EditUpdateButton = ({editMode, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={onPress && onPress}>
      {editMode ? (
        <Text style={styles.editButton}>Save</Text>
      ) : (
        <Text style={styles.editButton}>Edit</Text>
      )}
    </TouchableOpacity>
  );
};

EditUpdateButton.propType = {
  editMode: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

export default EditUpdateButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_DARK,
    fontWeight: 'bold',
    marginHorizontal: AppDimensions.SMALLEST,
  },
});
