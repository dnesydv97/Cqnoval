import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '@ant-design/react-native';
import {AppColors, AppDimensions, WINDOW_WIDTH} from 'styles';

const AddEditUpdateButton = ({
  cancelText = 'Cancel',
  updateText = 'Update',
  editText = 'Edit',
  submitText = 'Submit',
  onCancel,
  onUpdate,
  onEdit,
  onSubmit,
  isEdit,
  editMode,
}) => {
  return (
    <View style={styles.container}>
      <Button type="warning" onPress={onCancel}>
        {cancelText}
      </Button>
      {isEdit ? (
        editMode ? (
          <Button type="primary" onPress={onUpdate}>
            {updateText}
          </Button>
        ) : (
          <Button type="primary" onPress={onEdit}>
            {editText}
          </Button>
        )
      ) : (
        <Button type="primary" onPress={onSubmit}>
          {submitText}
        </Button>
      )}
    </View>
  );
};

export default AddEditUpdateButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: AppDimensions.SMALL,
    backgroundColor: AppColors.NORMAL_WHITE,
    marginBottom: AppDimensions.MODERATE,
    marginTop: AppDimensions.MODERATE,
  },
});
