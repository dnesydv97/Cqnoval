import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {PopMenuItem} from 'components';
import {IconOutline} from '@ant-design/icons-react-native';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import {updateGoal} from 'services';
import {onError, showFailToast, showSuccessToast} from 'utils';
import {messages} from 'constant';

const GoalItem = ({item, helpingData, onItemClicked}) => {
  const popUpMenu = [
    {
      label: 'Delete',
      onPress: () => updateItem('Delete'),
    },
    {
      label: 'Mark as Complete',
      onPress: () => updateItem('MarkComplete'),
    },
  ];

  function updateItem(type) {
    helpingData();
    let updatedItem = item;
    if (type === 'MarkComplete') {
      updatedItem = {
        ...item,
        isComplete: true,
      };
    } else if (type === 'Delete') {
      updatedItem = {
        ...item,
        isActive: false,
      };
    }

    updateGoal(updatedItem, item.id)
      .then((response) => {
        console.log('Product Delete response ', response);
        if (response.status === 200) {
          showSuccessToast(messages.GOAL_UPDATE_SUCCESS);
          helpingData(updatedItem);
        }
      })
      .catch((error) => {
        onError(error);
        showFailToast(messages.GOAL_UPDATE_FAILED);
      });
  }

  const MoreItem = () => <IconOutline name="more" size={30} />;
  return item.isActive ? (
    <TouchableOpacity style={styles.container} onPress={onItemClicked}>
      <View style={styles.titleTagContainer}>
        <View style={styles.tagContainer}>
          <View
            style={{...styles.label, backgroundColor: AppColors.PRIMARY}}>
            <Text style={styles.labelText}>
              {/* {item.organizerEventPriorityName} */}High
            </Text>
          </View>
          {item.isComplete && (
            <View
              style={{
                ...styles.label,
                backgroundColor: AppColors.SUCCESS_GREEN,
              }}>
              <Text
                style={{
                  ...styles.labelText,
                }}>
                Completed
              </Text>
            </View>
          )}
        </View>
        <Text
          style={{
            ...styles.title,
            //textDecorationLine: item.isComplete && 'line-through',
          }}
          numberOfLines={2}>
          {item.title}
        </Text>
      </View>
      <PopMenuItem ButtonComponent={MoreItem} menuItems={popUpMenu} />
    </TouchableOpacity>
  ) : null;
};

export default GoalItem;

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
    width: moderateScale(300),
  },
  tagContainer: {
    flexDirection: 'row',
  },
  title: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: AppDimensions.NORMAL,
  },
  label: {
    backgroundColor: AppColors.PRIMARY,
    padding: AppDimensions.SMALL,
    marginHorizontal: AppDimensions.SMALL,
    borderRadius: 15,
  },
  labelText: {
    ...SMALL_TEXT_STYLE,
    borderRadius: 15,
    color: 'white',
  },
});
