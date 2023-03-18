import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {PopMenuItem} from 'components';
import {IconOutline} from '@ant-design/icons-react-native';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import {updateGuest} from 'services';
import {
  dateFormats,
  getDateOnRequiredFormat,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';
import {messages} from 'constant';
import {useDispatch} from 'react-redux';
import {updateGuestDetail} from 'services/redux/guest/action';

const GuestItem = ({item, onItemClicked}) => {
  const dispatch = useDispatch();
  const popUpMenu = [
    {
      label: 'Delete',
      onPress: () => updateItem('Delete'),
    },
  ];

  function updateItem(type) {
    let updatedItem = item;
    if (type === 'Delete') {
      updatedItem = {
        ...item,
        isActive: false,
      };
    }

    dispatch(updateGuestDetail(updatedItem));
  }

  const MoreItem = () => <IconOutline name="more" size={30} />;
  return item.isActive ? (
    <TouchableOpacity style={styles.container} onPress={onItemClicked}>
      <View style={styles.titleTagContainer}>
        <View style={styles.tagContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {item.guestEventStatusDisplayName}
            </Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {`${item.guestName} | ${item.companyName}`}
        </Text>
        <Text style={styles.date} numberOfLines={2}>
          {`${getDateOnRequiredFormat(
            item.arrivalDate,
            dateFormats.DD_MMM_YYYY_DASH,
          )} To ${getDateOnRequiredFormat(
            item.departureDate,
            dateFormats.DD_MMM_YYYY_DASH,
          )}`}
        </Text>
      </View>
      <PopMenuItem ButtonComponent={MoreItem} menuItems={popUpMenu} />
    </TouchableOpacity>
  ) : null;
};

export default GuestItem;

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
  title: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: AppDimensions.NORMAL,
  },
  date: {
    ...SMALLER_TEXT_STYLE,
    color: AppColors.UTIL,
  },
  tagContainer: {
    flexDirection: 'row',
  },

  tag: {
    padding: AppDimensions.SMALL,
    marginHorizontal: AppDimensions.SMALL,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.TAG_RED,
  },
  tagText: {
    ...SMALLER_TEXT_STYLE,
    borderRadius: 10,
    color: AppColors.TAG_RED,
  },
});
