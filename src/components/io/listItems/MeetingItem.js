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
import {Checkbox} from '@ant-design/react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  markMeetingAsCompleted,
  updateMeetingDetail,
} from 'services/redux/meeting/action';

const MeetingItem = ({item}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const popUpMenu = [
    {
      label: 'View/Edit',
      onPress: () => updateItem('Edit'),
    },
    {
      label: 'Delete',
      onPress: () => updateItem('Delete'),
    },
    {
      label: 'Mark As Complete',
      onPress: () => updateItem('MarkAsComplete'),
    },
  ];

  function updateItem(type) {
    let updatedItem = item;
    if (type === 'Edit') {
      navigateToGivenScreenWithParams(
        navigation,
        navScreenNames.NAV_ADD_MEETING_SCREEN,
        {meetingId: item.id},
      );
    } else if (type === 'Delete') {
      updatedItem = {
        ...item,
        isActive: false,
      };
      dispatch(updateMeetingDetail(updatedItem));
    } else if (type === 'MarkAsComplete') {
      dispatch(markMeetingAsCompleted(updatedItem.id));
    }
  }

  function onItemClicked() {
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_AGENDA_MINUTE_SCREEN,
      {meetingId: item.id},
    );
  }

  const MoreItem = () => <IconOutline name="more" size={40} />;

  return item.isActive ? (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: item.isComplete
          ? AppColors.SUCCESS_LIST_ITEM_BG
          : AppColors.LIST_ITEM_BG,
      }}
      onPress={onItemClicked}>
      <View style={styles.titleTagContainer}>
        <Text style={{...styles.title, fontWeight: 'bold'}} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {`Invited By: ${item.onBehalf.userName}`}
        </Text>
        <Text style={styles.title}>
          Attendee:
          {item.meetingEventCandidateDtos.map((candidate) => (
            <Text>{` ${candidate.candidateDto.userName},`}</Text>
          ))}
        </Text>
        <View style={styles.tagContainer}>
          <View
            style={{
              ...styles.label,
              borderColor: AppColors.TAG_RED,
            }}>
            <Text
              style={{
                ...styles.labelText,
                color: AppColors.TAG_RED,
              }}>
              {item.sisterCompanyDto.name}
            </Text>
          </View>
          <View
            style={{
              ...styles.label,
              borderColor: AppColors.TAG_GREEN,
            }}>
            <Text
              style={{
                ...styles.labelText,
                color: AppColors.TAG_GREEN,
              }}>
              {item.meetingRoom}
            </Text>
          </View>
        </View>
        <Text style={styles.time}>{`${getDateOnRequiredFormat(
          item.startDate,
          dateFormats.hour_min_12_hr_meridian,
        )}-${getDateOnRequiredFormat(
          item.dueDate,
          dateFormats.hour_min_12_hr_meridian,
        )}`}</Text>
        <Text style={styles.time}>{`${getDateOnRequiredFormat(
          item.dueDate,
          dateFormats.ddd_DD_MMM_SPACE,
        )}`}</Text>
      </View>
      <PopMenuItem ButtonComponent={MoreItem} menuItems={popUpMenu} />
    </TouchableOpacity>
  ) : null;
};

export default MeetingItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.LIST_ITEM_BG,
    padding: AppDimensions.NORMAL,
    marginVertical: AppDimensions.SMALL,
    marginHorizontal: AppDimensions.SMALL,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleTagContainer: {
    width: moderateScale(280),
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
