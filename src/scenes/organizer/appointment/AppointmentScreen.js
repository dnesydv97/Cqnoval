import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  AppointmentItem,
  BaseContainer,
  EqualSpaceHorizontalView,
  FloatingActionButton,
  LoadMoreFlatList,
  PickerView,
} from 'components';
import {messages, navScreenNames, screenNames} from 'constant';
import {Checkbox} from '@ant-design/react-native';
import {AppColors, AppDimensions, SMALL_TEXT_STYLE} from 'styles';
import {useNavigation} from '@react-navigation/native';
import {
  clearAppointmentReducer,
  fetchAppointments,
  resetAddUpdateAppointmentReducer,
} from 'services/redux/appointments/action';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {getGoalLabels} from 'services';
import {
  getPickerItems,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
  showSuccessToast,
} from 'utils';

const sortBy = [
  {
    label: 'Subject',
    value: 'subject',
  },
  {
    label: 'Start Date',
    value: 'startdate',
  },
  {
    label: 'Priority',
    value: 'priority',
  },
  {
    label: 'Todo Label',
    value: 'label',
  },
];

const AppointmentScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const appointmentsRdxData = useSelector(
    (state) => state.appointmentReducer,
    shallowEqual,
  );

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState({
    totalCount: 0,
    items: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    MarkItOffStatuses: false,
    LabelStatuses: null,
    GuestEventStatuses: null,
    SearchDateFrom: null,
    SearchDateTo: null,
    SortType: false,
    Sorting: null,
  });
  
  const [preloadedData, setPreloadedData] = useState({
    eventStatusList: [],
    sortByList: sortBy,
  });

  useEffect(() => {
    getPreloadedData();
    return () => {
      dispatch(clearAppointmentReducer());
    };
  }, []);

  useEffect(() => {
    obtainAppointments(
      0,
      filterOptions.MarkItOffStatuses,
      filterOptions.LabelStatuses,
      filterOptions.GuestEventStatuses,
      filterOptions.SearchDateFrom,
      filterOptions.SearchDateTo,
      filterOptions.SortType,
      filterOptions.Sorting,
    );
  }, [filterOptions]);

  useEffect(() => {
    console.log('appointmentsRdxData changed ', appointmentsRdxData);
    setLoading(appointmentsRdxData.isLoading);
    if (
      !appointmentsRdxData.isLoading &&
      !appointmentsRdxData.isError &&
      appointmentsRdxData.data
    ) {
      setAppointments(appointmentsRdxData.data);
    }
    if (
      !appointmentsRdxData.isLoading &&
      !appointmentsRdxData.isError &&
      appointmentsRdxData.updated
    ) {
      showSuccessToast(messages.GOAL_UPDATE_SUCCESS);
      dispatch(resetAddUpdateAppointmentReducer());
    }
  }, [appointmentsRdxData]);

  function getPreloadedData() {
    getGoalLabels()
      .then((response) => {
        console.log('Preloaded Data Response', response);
        setPreloadedData({
          ...preloadedData,
          eventStatusList: [{id: null, name: 'Show All'}, ...response.data],
        });
      })
      .catch(onError);
  }

  function obtainAppointments(
    SkipCount,
    MarkItOffStatuses,
    LabelStatuses,
    GuestEventStatuses,
    SearchDateFrom,
    SearchDateTo,
    SortType,
    Sorting,
  ) {
    dispatch(
      fetchAppointments(
        SkipCount,
        MarkItOffStatuses,
        LabelStatuses,
        GuestEventStatuses,
        SearchDateFrom,
        SearchDateTo,
        SortType,
        Sorting,
      ),
    );
  }

  const onFilterOptionChanged = (key) => (value) => {
    setFilterOptions({
      ...filterOptions,
      [key]: value,
    });
  };

  function onItemPressed(item) {
    console.log('On Appointment Item clicked ', item);
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_ADD_APPOINTMENT_SCREEN,
      {appointmentId: item.id},
    );
  }
  return (
    <BaseContainer
      isDrawer
      toolbarTitle={screenNames.APPOINTMENT_SCREEN}
      loading={loading}>
      <View style={styles.filterContainer}>
        <EqualSpaceHorizontalView>
          <PickerView
            // label="Appointments Lists"
            items={getPickerItems(preloadedData.eventStatusList, 'name', 'id')}
            placeholder={{label: 'Goal Filter By'}}
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            containerStyle={{flex: 1, marginLeft: 10,}}
            pickerContainer={styles.pickerContainer}
            value={filterOptions.LabelStatuses}
            editable
            onValueChange={onFilterOptionChanged('LabelStatuses')}
          />
          <PickerView
            // label="Order By"
            placeholder={{label: 'Order By'}}
            items={preloadedData.sortByList}
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            pickerContainer={styles.pickerContainer}
            containerStyle={{flex: 1, marginRight: 15, paddingLeft: 5}}
            editable
            onValueChange={onFilterOptionChanged('Sorting')}
            value={filterOptions.Sorting}
          />
        </EqualSpaceHorizontalView>

        <EqualSpaceHorizontalView
          containerStyle={{
            marginVertical: 0,
            marginBottom: AppDimensions.SMALL,
            justifyContent: 'space-around',
          }}>
          <Checkbox
            checked={filterOptions.MarkItOffStatuses}
            onChange={(e) => {
              onFilterOptionChanged('MarkItOffStatuses')(e.target.checked);
            }}
            style={styles.checkBox}>
            Hide Completed
          </Checkbox>
          <Checkbox
            checked={filterOptions.SortType}
            onChange={(e) => {
              onFilterOptionChanged('SortType')(e.target.checked);
            }}
            style={styles.checkBox}>
            Ascending
          </Checkbox>
        </EqualSpaceHorizontalView>
      </View>
      <View style={styles.flatListContainer}>
        <LoadMoreFlatList
          data={appointments.items}
          loading={loading}
          onLoadMore={() =>
            obtainAppointments(
              appointments.items.length,
              filterOptions.MarkItOffStatuses,
              filterOptions.LabelStatuses,
              filterOptions.GuestEventStatuses,
              filterOptions.SearchDateFrom,
              filterOptions.SearchDateTo,
              filterOptions.SortType,
              filterOptions.Sorting,
            )
          }
          SingleItemView={AppointmentItem}
          onItemClicked={onItemPressed}
          showLoadMore={appointments.totalCount > appointments.items.length}
        />
      </View>
      <FloatingActionButton
        onPress={() =>
          navigateToGivenScreen(
            navigation,
            navScreenNames.NAV_ADD_APPOINTMENT_SCREEN,
          )
        }
      />
    </BaseContainer>
  );
};

export default AppointmentScreen;

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 0.5,
  },
  pickerStyle: {
    paddingHorizontal: AppDimensions.NORMAL,
    ...SMALL_TEXT_STYLE,
  },
  pickerLabelStyle: {
    ...SMALL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    paddingVertical: AppDimensions.SMALLER,
  },
  filterContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  flatListContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: AppDimensions.SMALL,
    borderRadius: 10,
  },
  checkBox: {
    marginHorizontal: AppDimensions.SMALL,
    marginVertical: AppDimensions.SMALL,
  },
});
