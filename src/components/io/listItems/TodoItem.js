import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {PopMenuItem} from 'components';
import {IconOutline} from '@ant-design/icons-react-native';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import {updateGoal} from 'services';
import {
  dateFormats,
  getDateOnRequiredFormat,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';
import {messages} from 'constant';
import {Checkbox} from '@ant-design/react-native';
import {useDispatch} from 'react-redux';
import {
  markAppointmentOffById,
  updateAppointmentDetail,
} from 'services/redux/appointments/action';

const AppointmentItem = ({item, onItemClicked}) => {
  const dispatch = useDispatch();

  const popUpMenu = [
    {
      label: 'Delete',
      onPress: () => updateItem('delete'),
    },
    {
      label: 'Mark as Complete',
      onPress: () => updateItem('complete'),
    },
  ];

  function updateItem(type) {
    let updatedItem = item;
    if (type === 'delete') {
      updatedItem = {
        ...item,
        isActive: false,
      };
    } else if (type === 'complete') {
    }
    dispatch(updateAppointmentDetail(updatedItem));
  }

  const MoreItem = () => <IconOutline name="more" size={30} />;

  return item.isActive ? (
    <TouchableOpacity style={styles.container} onPress={onItemClicked}>
      <View style={styles.titleTagContainer}>
        <View style={styles.tagContainer}>
          <View
            style={{
              ...styles.label,
              backgroundColor: item.organizerEventPriorityDto.colorHexValue, 
              // borderColor: item.organizerEventPriorityDto.colorHexValue,
            }}>
            <Text
              style={{
                ...styles.labelText,
                // color: item.organizerEventPriorityDto.colorHexValue,
              }}>
              {item.organizerEventPriorityDto.name}
            </Text>
          </View>
          <View
            style={{
              ...styles.label,
              borderColor: item.organizerEventLabelDto.colorHexValue,
            }}>
            <Text
              style={{
                ...styles.labelText,
                color: item.organizerEventLabelDto.colorHexValue,
              }}>
              {item.organizerEventLabelDto.name}
            </Text>
          </View>
          <View
            style={{
              ...styles.label,
              borderColor: item.todoEventStatusDto.colorHexValue,
            }}>
            <Text
              style={{
                ...styles.labelText,
                color: item.todoEventStatusDto.colorHexValue,
              }}>
              {item.todoEventStatusDto.name}
            </Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.subject}
        </Text>
      </View>
      <PopMenuItem ButtonComponent={MoreItem} menuItems={popUpMenu} />
    </TouchableOpacity>
  ) : null;
};

export default AppointmentItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.LIST_ITEM_BG,
    padding: AppDimensions.NORMAL,
    marginVertical: AppDimensions.SMALL,
    marginHorizontal: AppDimensions.SMALL,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTagContainer: {
    width: moderateScale(280),
  },
  tagContainer: {
    flexDirection: 'row',
  },
  title: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: AppDimensions.SMALL,
  },
  time: {
    ...SMALLER_TEXT_STYLE,
    color: AppColors.UTIL,
  },
  label: {
    padding: AppDimensions.SMALL,
    marginHorizontal: AppDimensions.SMALLER,
    borderColor: AppColors.SMOKE_WHITE,
    borderWidth: 1,
    borderRadius: 8,
    color: 'white',
  },
  labelText: {
    ...SMALLER_TEXT_STYLE,
    borderRadius: 10,
    color: 'white',
  },
});
