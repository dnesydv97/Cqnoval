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
import {
  dateFormats,
  getDateOnRequiredFormat,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';
import {messages, navScreenNames} from 'constant';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const LoanItem = ({item}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.titleTagContainer}>
        <Text style={{...styles.title, fontWeight: 'bold'}} numberOfLines={2}>
          {`Leave Request for ${item.leaveDays} Days`}
        </Text>
        <Text style={{...styles.title}} numberOfLines={2}>
          {item.reason}
        </Text>
        <Text style={styles.time}>{`${getDateOnRequiredFormat(
          item.leaveDayFrom,
          dateFormats.year_month_day_dash,
        )} To ${getDateOnRequiredFormat(
          item.leaveDayTo,
          dateFormats.year_month_day_dash,
        )}`}</Text>
        <View style={styles.tagContainer}>
          <View
            style={{
              ...styles.label,
              borderColor:
                item.leaveApplicationStatusName === 'Approved'
                  ? AppColors.TAG_GREEN
                  : item.leaveApplicationStatusName === 'Pending'
                  ? AppColors.WARNING_YELLOW
                  : AppColors.TAG_RED,
            }}>
            <Text
              style={{
                ...styles.labelText,
                color:
                  item.leaveApplicationStatusName === 'Approved'
                    ? AppColors.TAG_GREEN
                    : item.leaveApplicationStatusName === 'Pending'
                    ? AppColors.WARNING_YELLOW
                    : AppColors.TAG_RED,
              }}>
              {item.leaveApplicationStatusName}
            </Text>
          </View>
          {item.leaveDays.toString().includes('.5') && (
            <View
              style={{
                ...styles.label,
                borderColor: AppColors.TAG_ORANGE,
              }}>
              <Text
                style={{
                  ...styles.labelText,
                  color: AppColors.TAG_ORANGE,
                }}>
                Half Day
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.time}>{`Requested on ${getDateOnRequiredFormat(
          item.creationTime,
          dateFormats.ddd_DD_MMM_SPACE,
        )}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LoanItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.LIST_ITEM_BG,
    paddingVertical: AppDimensions.NORMAL,
    marginVertical: AppDimensions.SMALL,
    borderWidth: 1,
    borderColor: AppColors.DISABLE,
    borderRadius: 10,
  },
  titleTagContainer: {
    paddingHorizontal: AppDimensions.NORMAL,
  },
  tagContainer: {
    flexDirection: 'row',
    paddingVertical: AppDimensions.NORMAL,
  },
  title: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: AppDimensions.SMALLER,
  },
  time: {
    ...SMALL_TEXT_STYLE,
    color: AppColors.PRIMARY_DARK,
    paddingVertical: AppDimensions.SMALLEST,
  },
  label: {
    padding: AppDimensions.SMALL,
    marginHorizontal: AppDimensions.SMALLER,
    borderColor: AppColors.PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    color: 'white',
  },
  labelText: {
    ...SMALL_TEXT_STYLE,
    borderRadius: 10,
  },
});
