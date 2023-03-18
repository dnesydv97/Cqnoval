import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  BaseContainer,
  FloatingActionButton,
  GuestItem,
  LoadMoreFlatList,
  PickerView,
} from 'components';
import {navScreenNames, screenNames} from 'constant';
import {useNavigation} from '@react-navigation/native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {getGuestLabel} from 'services';
import {clearGuestReducer, fetchGuests} from 'services/redux/guest/action';
import {AppColors, AppDimensions, SMALL_TEXT_STYLE} from 'styles';
import {
  getPickerItems,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
  addDaysToDate,
  dateFormats,
  getDateOnRequiredFormat,
} from 'utils';
import DateRangePicker from 'react-native-daterange-picker';
import moment from 'moment';
import {moderateScale} from 'react-native-size-matters';

const getDatesDropdown = [
  {
    value: 7,
    label: '7 Days',
  },
  {
    value: 29,
    label: '30 Days',
  },
  {
    value: 'CustomDate',
    label: 'Custom',
  },
];

const GuestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const guestsRdxData = useSelector(
    (state) => state.guestReducer,
    shallowEqual,
  );

  const [loading, setLoading] = useState(false);
  const [selectedGuestLabel, setSelectedGuestLabel] = useState(null);
  const [filterDateRange, setFilterDateRange] = useState({
    range: '',
    startDate: '',
    endDate: '',
  });
  const [guests, setGuests] = useState({
    totalCount: 0,
    items: [],
  });
  const [guestLabels, setGuestLabels] = useState([]);

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  useEffect(() => {
    getGuestLabels();
  }, []);

  useEffect(() => {
    filterDateRange.endDate !== 'Invalid date' &&
      getGuests(
        0,
        selectedGuestLabel,
        filterDateRange.startDate,
        filterDateRange.endDate,
      );
    return () => {
      dispatch(clearGuestReducer());
    };
  }, [selectedGuestLabel, filterDateRange]);

  useEffect(() => {
    setLoading(guestsRdxData.isLoading);
    if (
      !guestsRdxData.isLoading &&
      !guestsRdxData.isError &&
      guestsRdxData.data
    ) {
      setGuests(guestsRdxData.data);
    }
  }, [guestsRdxData]);

  function getGuests(skipCount, guestLabelId, fromDate, toDate) {
    dispatch(fetchGuests(skipCount, guestLabelId, fromDate, toDate));
  }

  function getGuestLabels() {
    getGuestLabel()
      .then((response) => {
        console.log('Guest Label Response ', response);
        if (response.status === 200) setGuestLabels(response.data);
      })
      .catch(onError);
  }

  function onItemClicked(item) {
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_ADD_GUEST_SCREEN,
      {guestId: item.id},
    );
  }

  const [showPicker, setShowPicker] = useState(false);

  function onDateRangeSelected(dateRange) {
    let startDate = '';
    let endDate = '';

    if (dateRange === 'CustomDate') {
      setShowDateRangePicker(true);
    } else {
      startDate = getDateOnRequiredFormat(
        new Date(),
        dateFormats.year_month_day_dash,
        null,
      );

      endDate = addDaysToDate(new Date(), dateRange).format(
        dateFormats.year_month_day_dash,
      );
    }

    onDateRangeChange({startDate, endDate, range: dateRange});
  }

  function onDateRangeChange(dates) {
    setFilterDateRange({
      ...filterDateRange,
      startDate: getDateOnRequiredFormat(dates.startDate),
      endDate: getDateOnRequiredFormat(dates.endDate),
    });
  }

  return (
    <BaseContainer
      loading={loading}
      isDrawer
      toolbarTitle={screenNames.GUEST_SCREEN}>
      <View style={styles.filterContainer}>
        <PickerView
          // label="Guest List"
          items={getPickerItems(guestLabels, 'displayName', 'id')}
          placeholder={{label: 'Guest Filter By'}}
          value={selectedGuestLabel}
          labelStyle={styles.pickerLabelStyle}
          pickerStyle={styles.pickerStyle}
          containerStyle={{
            flex: 0.8,
            backgroundColor: AppColors.PRIMARY,
            borderRadius: 15,
            padding: AppDimensions.SMALL,
            marginLeft: 10,
            marginRight: 5,
          }}
          pickerContainer={styles.pickerContainer}
          editable
          onValueChange={setSelectedGuestLabel}
        />
        <PickerView
          // label="Filter By Date"
          items={getDatesDropdown}
          placeholder={{label: 'Filter By Date'}}
          value={filterDateRange.range}
          labelStyle={styles.pickerLabelStyle}
          pickerStyle={styles.pickerStyle}
          containerStyle={{
            flex: 0.8,
            backgroundColor: AppColors.PRIMARY,
            borderRadius: 15,
            padding: AppDimensions.SMALL,
            marginRight: 10,
            marginLeft: 10,
          }}
          pickerContainer={styles.pickerContainer}
          editable
          onValueChange={onDateRangeSelected}
        />
      </View>

      <View style={styles.flatListContainer}>
        <LoadMoreFlatList
          data={guests.items}
          loading={loading}
          onLoadMore={() =>
            getGuests(
              guests.items.length,
              selectedGuestLabel,
              filterDateRange.startDate,
              filterDateRange.endDate,
            )
          }
          SingleItemView={GuestItem}
          onItemClicked={onItemClicked}
          showLoadMore={guests.totalCount > guests.items.length}
        />
      </View>
      <FloatingActionButton
        onPress={() =>
          navigateToGivenScreen(navigation, navScreenNames.NAV_ADD_GUEST_SCREEN)
        }
      />
      {/* <DateRangePickerItem
        visibility={showDateRangePicker}
        containerStyle={{}}
        collapsable={true}
        title={'Select Date Range'}
        range
        onDismiss={(dates) => {
          console.log('ONDissmiss Called ', dates);
          setShowDateRangePicker(false);
          // onDateRangeSelected(dates)
          onDateRangeChange(dates);
        }}
        // onDateRangeChange={onDateRangeChange}
      /> */}
      {showDateRangePicker && (
        <DateRangePicker
          onChange={(dates) => {
            onDateRangeChange(dates);
            dates.endDate &&
              setTimeout(() => {
                setShowDateRangePicker(false);
              }, 500);
          }}
          endDate={filterDateRange.endDate}
          startDate={filterDateRange.startDate}
          displayedDate={moment()}
          backdropStyle={{paddingBottom: moderateScale(100)}}
          range
          open>
          <Text>{''}</Text>
        </DateRangePicker>
      )}
    </BaseContainer>
  );
};

export default GuestScreen;

const styles = StyleSheet.create({
  pickerContainer: {
    // borderWidth: 0.5,
  },
  pickerStyle: {
    paddingHorizontal: AppDimensions.NORMAL,
    ...SMALL_TEXT_STYLE,
  },
  pickerLabelStyle: {
    ...SMALL_TEXT_STYLE,
    color: AppColors.SMOKE_WHITE,
    paddingVertical: AppDimensions.SMALLER,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.SMOKE_WHITE,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  flatListContainer: {
    flex: 1,
    backgroundColor: AppColors.SMOKE_WHITE,
    marginTop: AppDimensions.SMALL,
    borderRadius: 10,
  },
  checkBox: {
    marginHorizontal: AppDimensions.SMALL,
    marginVertical: AppDimensions.SMALL,
  },
});
