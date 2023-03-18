import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {
  BaseContainer,
  PickerView,
  TextField,
  AddEditUpdateButton,
  DateTimeRangePicker,
  EqualSpaceHorizontalView,
  PersonSearchBox,
} from 'components';
import {Checkbox} from '@ant-design/react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {messages, screenNames} from 'constant';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {
  checkAndGoBack,
  dateFormats,
  getPickerItems,
  getPersonSearchSelectedItems,
  onError,
  showFailToast,
  showSuccessToast,
  getDateOnRequiredFormat,
} from 'utils';
import {
  getMeetingDetail,
  getMeetingStatus,
  getMeetingSisterCompanies,
} from 'services';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {moderateScale} from 'react-native-size-matters';
import {
  addNewMeeting,
  resetAddUpdateMeetingReducer,
  updateMeetingDetail,
} from 'services/redux/meeting/action';

const getCandidateObj = (id, fullName, userName, userIdName) => {
  return {
    id: null,
    meetingEventId: '',
    candidateId: id,
    candidateUserName: userName,
    candidateUserIdName: userIdName,
    fullName,
    userName,
    userIdName,
    candidateDto: {
      appUserId: id,
      fullName,
      userName,
      userIdName,
    },
    isActive: true,
  };
};

const AddMeetingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const meetingRdxData = useSelector(
    (state) => state.meetingReducer,
    shallowEqual,
  );
  const route = useRoute();
  const {meetingId} = route?.params;

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [enableBehalfOf, setEnableBehalfOf] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState({
    id: null,
    startDate: '',
    startTime: '',
    dueDate: '',
    dueTime: '',
    title: '',
    meetingRoom: '',
    notes: '',
    isActive: true,
    onBehalfId: null,
    onBehalf: null,
    sisterCompanyId: null,
    sisterCompanyDto: null,
    meetingEventStatusId: null,
    meetingEventStatusDto: null,
    meetingEventCandidateDtos: [],
  });

  const [preloadedData, setPreloadedData] = useState({
    sisterCompanies: [],
    meetingProgress: [],
  });

  useEffect(() => {
    setLoading(meetingRdxData.isLoading);
    if (
      !meetingRdxData.isLoading &&
      !meetingRdxData.isError &&
      meetingRdxData.isNewData &&
      meetingRdxData.data
    ) {
      showSuccessToast(messages.GOAL_ADDED_SUCCESS);
      checkAndGoBack(navigation);
    } else if (
      !meetingRdxData.isLoading &&
      !meetingRdxData.isError &&
      meetingRdxData.updated &&
      meetingRdxData.data
    ) {
      showSuccessToast(messages.GOAL_UPDATE_SUCCESS);
      checkAndGoBack(navigation);
    } else if (!meetingRdxData.isLoading && meetingRdxData.isError) {
      showFailToast(messages.GOAL_ADDED_FAIL);
    }

    return () => {
      dispatch(resetAddUpdateMeetingReducer());
    };
  }, [meetingRdxData]);

  useEffect(() => {
    setEditMode(!meetingId);
    meetingId && getMeetingDetailById();
    getRequiredData();
  }, [meetingId]);

  function getRequiredData() {
    Promise.all([getMeetingSisterCompanies(), getMeetingStatus()])
      .then((response) => {
        console.log('Add meeting required data response ', response);
        setPreloadedData({
          ...preloadedData,
          sisterCompanies: response[0].data,
          meetingProgress: response[1].data,
        });
      })
      .catch(onError);
  }

  const onChangeText = (key) => (value) => {
    setMeetingInfo({
      ...meetingInfo,
      [key]: value,
    });
  };

  function getMeetingDetailById() {
    setLoading(true);
    getMeetingDetail(meetingId)
      .then((response) => {
        setLoading(false);
        console.log('Meeting Detail response ', response);
        if (response.status === 200) {
          setMeetingInfo({
            ...response.data,
            startTime: getDateOnRequiredFormat(
              response.data.startDate,
              dateFormats.hour_min_24_hr,
            ),
            dueTime: getDateOnRequiredFormat(
              response.data.endDate,
              dateFormats.hour_min_24_hr,
            ),
          });
          setEnableBehalfOf(!!response.data.onBehalfId);
        }
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
        showFailToast(messages.GOAL_DETAIL_FAILED);
      });
  }

  function onAddUpdate(isNew = true) {
    setLoading(true);
    let meetingObj = {...meetingInfo};
    meetingObj.onBehalfId = meetingInfo.onBehalf?.appUserId || null;
    console.log(
      'Data to be sent to server ',
      meetingObj,
      JSON.stringify(meetingObj),
    );

    dispatch(
      isNew ? addNewMeeting(meetingObj) : updateMeetingDetail(meetingObj),
    );
  }

  function onUsersChanged(userList) {
    const convertedUsers = userList.map((item) => {
      let user = getCandidateObj(
        item.appUserId,
        item.fullName,
        item.userName,
        item.userIdName,
      );

      return user;
    });
    onChangeText('meetingEventCandidateDtos')(convertedUsers);
  }

  const onDateChanged = (type) => (dateRange) => {
    if (type === 'start') {
      setMeetingInfo({
        ...meetingInfo,
        startDate: dateRange.startDate,
        startTime: getDateOnRequiredFormat(
          dateRange.startDate,
          dateFormats.hour_min_24_hr,
        ),
      });
    } else if (type === 'end') {
      setMeetingInfo({
        ...meetingInfo,
        dueDate: dateRange.startDate,
        dueTime: getDateOnRequiredFormat(
          dateRange.endDate,
          dateFormats.hour_min_24_hr,
        ),
      });
    }
  };

  return (
    <BaseContainer
      // loading={loading}
      toolbarTitle={screenNames.ADD_MEETING_SCREEN}
      scrollable>
      <View style={styles.container}>
        <TextField
          inputTextContainerStyle={styles.pickerContainer}
          label="Title"
          onChangeText={onChangeText('title')}
          value={meetingInfo.title}
          labelStyle={styles.pickerLabelStyle}
          editable={editMode}
        />

        <Text style={{...NORMAL_TEXT_STYLE, marginTop: AppDimensions.NORMAL}}>
          Start Date - Start Time
        </Text>
        <DateTimeRangePicker
          mode="date"
          mode2="time"
          dateFormat2={dateFormats.hour_min_12_hr_meridian}
          startDate={meetingInfo.startDate}
          endDate={meetingInfo.startDate}
          onDateChanged={onDateChanged('start')}
          separator=""
          editable={editMode}
        />

        <Text style={{...NORMAL_TEXT_STYLE, marginTop: AppDimensions.NORMAL}}>
          Due Date - Due Time
        </Text>
        <DateTimeRangePicker
          mode="date"
          mode2="time"
          dateFormat2={dateFormats.hour_min_12_hr_meridian}
          startDate={meetingInfo.dueDate}
          endDate={meetingInfo.dueDate}
          onDateChanged={onDateChanged('end')}
          separator=""
          editable={editMode}
        />

        <EqualSpaceHorizontalView>
          <PickerView
            label="Meeting Of"
            placeholder={{label: 'Meeting Of'}}
            value={meetingInfo.sisterCompanyId}
            items={getPickerItems(preloadedData.sisterCompanies, 'name', 'id')}
            onValueChange={onChangeText('sisterCompanyId')}
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            pickerContainer={styles.pickerContainer}
            editable={editMode}
          />

          <PickerView
            label="Progress Status"
            placeholder={{label: 'Progress'}}
            value={meetingInfo.meetingEventStatusId}
            items={getPickerItems(preloadedData.meetingProgress, 'name', 'id')}
            onValueChange={onChangeText('meetingEventStatusId')}
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            pickerContainer={styles.pickerContainer}
            editable={editMode}
          />
        </EqualSpaceHorizontalView>

        <TextField
          inputTextContainerStyle={styles.pickerContainer}
          label="Meeting Location"
          onChangeText={onChangeText('meetingRoom')}
          value={meetingInfo.meetingRoom}
          labelStyle={styles.pickerLabelStyle}
          multiline
          editable={editMode}
        />

        <Text style={styles.pickerLabelStyle}>Attendee</Text>
        <PersonSearchBox
          selectedUsers={getPersonSearchSelectedItems(
            meetingInfo.meetingEventCandidateDtos,
            'candidateId',
            'candidateUserIdName',
          )}
          onUsersChanged={onUsersChanged}
          editable={editMode}
        />

        <TextField
          inputTextContainerStyle={styles.pickerContainer}
          label="Remarks"
          onChangeText={onChangeText('notes')}
          value={meetingInfo.notes}
          labelStyle={styles.pickerLabelStyle}
          multiline
          editable={editMode}
        />

        <View style={{marginTop: AppDimensions.LARGE}}>
          <Checkbox
            disabled={!editMode}
            checked={enableBehalfOf}
            onChange={(e) => setEnableBehalfOf(e.target.checked)}>
            On Behalf Of
          </Checkbox>
        </View>

        <PersonSearchBox
          selectedUsers={getPersonSearchSelectedItems(
            meetingInfo.onBehalf ? [meetingInfo.onBehalf] : [],
            'appUserId',
            'userIdName',
          )}
          onUsersChanged={(users) => {
            let user = users[0];
            onChangeText('onBehalf')(user ? user : null);
          }}
          editable={editMode && enableBehalfOf}
          singleMode
        />

        <View style={styles.footerContainer}>
          <AddEditUpdateButton
            onCancel={() => checkAndGoBack(navigation)}
            onUpdate={() => onAddUpdate(false)}
            onSubmit={() => onAddUpdate(true)}
            onEdit={() => setEditMode(true)}
            isEdit={!!meetingId}
            editMode={editMode}
          />
        </View>
      </View>
    </BaseContainer>
  );
};

export default AddMeetingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.LIST_ITEM_BG,
  },
  pickerContainer: {
    borderWidth: 1,
    backgroundColor: 'white',
  },
  pickerStyle: {
    paddingHorizontal: AppDimensions.NORMAL,
    ...SMALL_TEXT_STYLE,
  },
  pickerLabelStyle: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    paddingVertical: AppDimensions.SMALLER,
  },
  footerContainer: {
    width: '100%',
    bottom: 0,
    position: 'relative',
  },
  flatListContainer: {
    backgroundColor: 'white',
    height: moderateScale(150),
    borderWidth: 1,
    borderRadius: AppDimensions.SMALL,
    marginVertical: AppDimensions.SMALL,
  },
  flatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: AppDimensions.SMALL,
    paddingVertical: AppDimensions.NORMAL,
    paddingStart: AppDimensions.NORMAL,
  },
  text: {
    width: '25%',
    ...SMALL_TEXT_STYLE,
  },
});
