import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  BaseContainer,
  EqualSpaceHorizontalView,
  FloatingActionButton,
  LoadMoreFlatList,
  MeetingItem,
  PickerView,
  PopMenuItem,
  SearchBox,
} from 'components';
import {IconOutline} from '@ant-design/icons-react-native';
import {messages, navScreenNames, screenNames} from 'constant';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  fetchMeetings,
  resetAddUpdateMeetingReducer,
} from 'services/redux/meeting/action';
import {AppColors, AppDimensions, SMALL_TEXT_STYLE} from 'styles';
import {navigateToGivenScreen, showSuccessToast} from 'utils';
import {moderateScale} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native-gesture-handler';
import TextFormatEditor from 'components/io/TextFormatEditor';

const sortBy = [
  {
    label: 'Meeting Title',
    value: 'title',
  },
  {
    label: 'Start Date',
    value: 'startdate',
  },
  {
    label: 'Sister Company',
    value: 'sistercompany',
  },
];

const MeetingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const meetingRdxData = useSelector(
    (state) => state.meetingReducer,
    shallowEqual,
  );
  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState({
    items: [],
    totalCount: 0,
  });

  const [filterOptions, setFilterOptions] = useState({
    SkipCount: 0,
    SearchKeyword: null,
    Sorting: null,
  });

  useEffect(() => {
    obtainMeetings(0, filterOptions.SearchKeyword, filterOptions.Sorting);
  }, [filterOptions]);

  useEffect(() => {
    // console.log('meetingRdxData changed ', meetingRdxData);
    setLoading(meetingRdxData.isLoading);
    if (
      !meetingRdxData.isLoading &&
      !meetingRdxData.isError &&
      meetingRdxData.data
    ) {
      setMeetings(meetingRdxData.data);
    }
    if (
      !meetingRdxData.isLoading &&
      !meetingRdxData.isError &&
      meetingRdxData.updated
    ) {
      showSuccessToast(messages.GOAL_UPDATE_SUCCESS);
      dispatch(resetAddUpdateMeetingReducer());
    }
  }, [meetingRdxData]);

  const onFilterOptionChanged = (key) => (value) => {
    setFilterOptions({
      ...filterOptions,
      [key]: value,
    });
  };

  function obtainMeetings(SkipCount, SearchKeyword, Sorting) {
    dispatch(fetchMeetings(SkipCount, SearchKeyword, Sorting));
  }

  return (
    <BaseContainer
      isDrawer
      // loading={loading}
      toolbarTitle={screenNames.MEETING_SCREEN}
      fab={{
        visibility: true,
        fabColor: AppColors.BTN_RED,
        onFabClick: () =>
          navigateToGivenScreen(
            navigation,
            navScreenNames.NAV_ADD_MEETING_SCREEN,
          ),
      }}
      containerStyle={styles.container}>
      <View style={styles.filterContainer}>
        <SearchBox
          onSearch={onFilterOptionChanged('SearchKeyword')}
          containerStyle={{
            // marginHorizontal: AppDimensions.SMALL,
            // marginBottom: AppDimensions.SMALL,
            flex: 1,
          }}
        />

        <TouchableOpacity>
          <IconOutline
            color={'black'}
            size={moderateScale(20)}
            name="more"
            // onPress={() => setModalVisibility(true)}
          />
        </TouchableOpacity>
        {/* <EqualSpaceHorizontalView
        containerStyle={{left: '80%'}}> */}
        {/* Order By Picker*/}
        {/* <PickerView
            placeholder={{label: 'Order By'}}
            items={sortBy}
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            pickerContainer={styles.pickerContainer}
            containerStyle={{flex: 0.6, paddingVertical: AppDimensions.MODERATE, paddingHorizontal: AppDimensions.MODERATE}}
            editable
            onValueChange={onFilterOptionChanged('Sorting')}
            value={filterOptions.Sorting}
          /> */}
        {/* </EqualSpaceHorizontalView> */}
      </View>

      <View style={styles.flatListContainer}>
        <LoadMoreFlatList
          data={meetings.items}
          loading={loading}
          onLoadMore={() =>
            obtainMeetings(
              appointments.items.length,
              filterOptions.SearchKeyword,
              filterOptions.Sorting,
            )
          }
          SingleItemView={MeetingItem}
          showLoadMore={meetings.totalCount > meetings.items.length}
        />
      </View>
      {/* <FloatingActionButton
        onPress={() =>
          navigateToGivenScreen(
            navigation,
            navScreenNames.NAV_ADD_MEETING_SCREEN,
          )
        }
      /> */}
    </BaseContainer>
  );
};
export default MeetingScreen;

const styles = StyleSheet.create({
  container: {},
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //height: moderateScale(115),
    backgroundColor: 'white',
    // borderRadius: 10,
    // marginBottom: AppDimensions.SMALL,
  },
  flatListContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: AppDimensions.SMALL,
    borderRadius: 10,
  },
  pickerContainer: {
    backgroundColor: AppColors.LIST_ITEM_BG,
    borderRadius: 20,
    height: moderateScale(40),
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
});
