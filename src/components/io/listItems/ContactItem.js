import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  CircularIconButton,
  PickerView,
  TextField,
  AddMoreButton,
} from 'components';
import {AppColors, AppDimensions} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import {isAndroid} from 'utils';

const ContactItem = ({
  editable,
  labels = [],
  labelValue = '',
  valuePlaceholder = '',
  value = '',
  addMoreMsg = 'more',
  labelInputContainer = {},
  valueInputContainer = {},
  onLabelChanged,
  onValueChanged,
  onAdd,
  style = {},
  onRemove,
  itemIndex = -1,
  hasAddMore = false,
  isLastItem = false,
}) => {
  const [expand, setExpand] = useState(false);
  return (
    <View style={styles.container}>
      {editable && (
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 0.4,
          }}>
          <CircularIconButton
            icon="minus"
            iconSize={15}
            containerStyle={styles.roundButton}
            onPress={() => onRemove(itemIndex)}
          />
          <PickerView
            onValueChange={onLabelChanged}
            editable
            items={labels}
            value={labelValue}
            containerStyle={{}}
            pickerStyle={{
              color: AppColors.PRIMARY_TEXT,
              fontWeight: 'bold',
              marginHorizontal: AppDimensions.NORMAL,
              marginVertical: AppDimensions.NORMAL,
            }}
            containerStyle={{...labelInputContainer}}
          />
          <View
            style={{
              borderLeftWidth: editable ? 1 : 0,
              height: moderateScale(25),
              marginTop: AppDimensions.NORMAL,
            }}
          />
          <TextField
            placeholder={valuePlaceholder}
            value={value}
            containerStyle={valueInputContainer}
            onChangeText={onValueChanged}
            editable
            inputTextStyle={{color: AppColors.PRIMARY_TEXT, paddingVertical: 2}}
          />
        </View>
      )}
      {!editable && labelValue != '' && value != '' && value != null && (
        <View
          style={{
            borderBottomWidth: isLastItem ? 0 : 1,
            borderColor: AppColors.LIGHT_GRAY,
            paddingBottom: AppDimensions.SMALL,
          }}>
          <PickerView
            items={labels}
            value={labelValue}
            containerStyle={{}}
            pickerStyle={{
              color: AppColors.PRIMARY_TEXT,
              fontWeight: 'bold',
              paddingHorizontal: isAndroid ? 0 : moderateScale(6),
            }}
            containerStyle={{...labelInputContainer}}
            inputTextStyle={{color: AppColors.ACCENT}}
          />
          <TextField
            placeholder={valuePlaceholder}
            value={value}
            containerStyle={valueInputContainer}
            inputTextStyle={{color: AppColors.ACCENT, paddingVertical: 0}}
          />
        </View>
      )}
    </View>
  );
};

ContactItem.protoType = {
  editable: PropTypes.bool,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  labelValue: PropTypes.string,
  value: PropTypes.string,
  labelInputContainer: PropTypes.object,
  valueInputContainer: PropTypes.object,
  onValueChanged: PropTypes.func.isRequired,
  onLabelChanged: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  itemIndex: PropTypes.number.isRequired,
  style: PropTypes.string,
};

export default ContactItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginVertical: AppDimensions.SMALL,
  },
  roundButton: {
    borderWidth: 0.5,
    borderColor: AppColors.TAG_GREEN,
    marginVertical: AppDimensions.NORMAL,
    height: moderateScale(20),
    width: moderateScale(20),
  },
});
