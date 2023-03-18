import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {
  BaseContainer,
  PickerView,
  TextField,
  DateTimePicker,
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
  HEADING_TEXT_SIZE,
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
  getAppointmentDetail,
  getAppointmentLabel,
  getGoalLabels,
  getGoalPriority,
  getGuestDetail,
  getGuestLabel,
} from 'services';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  addNewGuest,
  resetAddUpdateGuestReducer,
  updateGuestDetail,
} from 'services/redux/guest/action';
import {
  addNewAppointment,
  resetAddUpdateAppointmentReducer,
  updateAppointmentDetail,
} from 'services/redux/appointments/action';
import {moderateScale} from 'react-native-size-matters';

const getCandidateObj = (id, name) => {
  return {
    id: '',
    appointmentEventId: '',
    candidateId: id,
    candidateName: name,
    isPrimary: true,
    isActive: true,
  };
};

const AddAppointmentScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const appointmentRdxData = useSelector(
    (state) => state.appointmentReducer,
    shallowEqual,
  );
  const route = useRoute();
  const {appointmentId} = route?.params;

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [appointmentInfo, setAppointmentInfo] = useState({
    startDateTime: '',
    endDateTime: '',
    reminderDateTime: '',
    id: null,
    subject: '',
    endDate: '',
    startDate: '',
    markItOff: false,
    endTime: '',
    startTime: '',
    organizerEventPriorityId: '',
    organizerEventLabelId: '',
    organizerEventPriorityDto: null,
    organizerEventLabelDto: null,
    reminderDate: '',
    reminderTime: '',
    isReminder: false,
    notes: '',
    isActive: true,
    appointmentEventCandidateDtos: [],
    makeMePrimary: true,
  });

  const [preloadedData, setPreloadedData] = useState({
    appointLabelsLabels: [],
    appointmentPriority: [],
  });
  useEffect(() => {
    setLoading(appointmentRdxData.isLoading);
    if (
      !appointmentRdxData.isLoading &&
      !appointmentRdxData.isError &&
      appointmentRdxData.isNewData &&
      appointmentRdxData.data
    ) {
      showSuccessToast(messages.GOAL_ADDED_SUCCESS);
      checkAndGoBack(navigation);
    } else if (
      !appointmentRdxData.isLoading &&
      !appointmentRdxData.isError &&
      appointmentRdxData.updated &&
      appointmentRdxData.data
    ) {
      showSuccessToast(messages.GOAL_UPDATE_SUCCESS);
      checkAndGoBack(navigation);
    } else if (!appointmentRdxData.isLoading && appointmentRdxData.isError) {
      showFailToast(messages.GOAL_ADDED_FAIL);
    }
  }, [appointmentRdxData]);

  useEffect(() => {
    getPreloadedData();
    return () => {
      dispatch(resetAddUpdateAppointmentReducer());
    };
  }, []);

  useEffect(() => {
    setEditMode(!appointmentId);
    appointmentId && getAppointmentDetailById();
  }, [appointmentId]);

  const onChangeText = (key) => (value) => {
    setAppointmentInfo({
      ...appointmentInfo,
      [key]: value,
    });
  };

  function getPreloadedData() {
    Promise.all([getGoalLabels(), getGoalPriority()])
      .then((response) => {
        console.log('Appointment preloaded Data Response ', response);
        setPreloadedData({
          ...preloadedData,
          appointLabelsLabels: response[0].data,
          appointmentPriority: response[1].data,
        });
      })
      .catch(onError);
  }

  function getAppointmentDetailById() {
    setLoading(true);
    getAppointmentDetail(appointmentId)
      .then((response) => {
        setLoading(false);
        console.log('Appointment Detail response ', response);
        if (response.status === 200) setAppointmentInfo(response.data);
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
        showFailToast(messages.GOAL_DETAIL_FAILED);
      });
  }

  function onAddUpdate(isNew = true) {
    setLoading(true);
    console.log('Data to be sent to server ', appointmentInfo);
    console.log('Data to be sent to server ', JSON.stringify(appointmentInfo));

    (appointmentInfo.organizerEventLabelId =
      appointmentInfo.organizerEventLabelDto.id),
      (appointmentInfo.organizerEventPriorityId =
        appointmentInfo.organizerEventPriorityDto.id),
      delete appointmentInfo.startDateTime;
    delete appointmentInfo.endDateTime;
    delete appointmentInfo.reminderDateTime;
    delete appointmentInfo.organizerEventLabelDto;
    delete appointmentInfo.organizerEventPriorityDto;

    dispatch(
      isNew
        ? addNewAppointment(appointmentInfo)
        : updateAppointmentDetail(appointmentInfo),
    );
  }

  function onPrimaryChanged(checked, searchIndex) {
    let candidates = appointmentInfo.appointmentEventCandidateDtos.map(
      (candi, index) => {
        if (index === searchIndex) {
          candi.isPrimary = checked;
        }
        return candi;
      },
    );

    onChangeText('appointmentEventCandidateDtos')(candidates);
  }

  function onUsersChanged(userList) {
    console.log('changed user list ', userList);
    const convertedUsers = userList.map((item) => {
      let user =
        'isPrimary' in item
          ? item
          : getCandidateObj(item.appUserId, item.fullName);

      return user;
    });

    onChangeText('appointmentEventCandidateDtos')(convertedUsers);
  }

  const onDateChanged = (type) => (dateRange) => {
    console.log('changed user list ', dateRange, type);

    if (type === 'start') {
      setAppointmentInfo({
        ...appointmentInfo,
        startDate: dateRange.startDate,
        startTime: getDateOnRequiredFormat(
          dateRange.endDate,
          dateFormats.hour_min_24_hr,
        ),
      });
    } else if (type === 'end') {
      setAppointmentInfo({
        ...appointmentInfo,
        endDate: dateRange.startDate,
        endTime: getDateOnRequiredFormat(
          dateRange.endDate,
          dateFormats.hour_min_24_hr,
        ),
      });
    } else if ((type = 'reminder')) {
      setAppointmentInfo({
        ...appointmentInfo,
        reminderDate: dateRange.startDate,
        reminderTime: getDateOnRequiredFormat(
          dateRange.endDate,
          dateFormats.hour_min_24_hr,
        ),
      });
    }
  };

  function getPriorityById(id) {
    const priorityItem = preloadedData.appointmentPriority.find(
      (item) => item.id === id,
    );
    return priorityItem;
  }

  function getAppointmentLabelById(id) {
    const labelItem = preloadedData.appointLabelsLabels.find(
      (item) => item.id === id,
    );
    return labelItem;
  }

  return (
    <BaseContainer
      loading={loading}
      toolbarTitle={screenNames.ADD_APPOINTMENT_SCREEN}
      scrollable>
      <View style={styles.container}>
        <TextField
          inputTextContainerStyle={styles.pickerContainer}
          label="Subject"
          onChangeText={onChangeText('subject')}
          value={appointmentInfo.subject}
          labelStyle={styles.pickerLabelStyle}
          editable={editMode}
        />

        <Text style={{...NORMAL_TEXT_STYLE, marginTop: AppDimensions.NORMAL}}>
          Start Date/Time
        </Text>
        <DateTimeRangePicker
          mode="date"
          mode2="time"
          dateFormat2={dateFormats.hour_min_12_hr_meridian}
          startDate={appointmentInfo.startDateTime}
          endDate={appointmentInfo.startDateTime}
          onDateChanged={onDateChanged('start')}
          separator=""
          editable={editMode}
        />

        <Text style={{...NORMAL_TEXT_STYLE, marginTop: AppDimensions.NORMAL}}>
          End Date/Time
        </Text>
        <DateTimeRangePicker
          mode="date"
          mode2="time"
          dateFormat2={dateFormats.hour_min_12_hr_meridian}
          editable={editMode}
          separator=""
          startDate={appointmentInfo.endDateTime}
          endDate={appointmentInfo.endDateTime}
          onDateChanged={onDateChanged('end')}
        />
        {/* onChangeText('organizerEventPriorityId') */}

        <EqualSpaceHorizontalView>
          <PickerView
            label="Priority"
            placeholder={{label: 'Set Priority'}}
            value={
              appointmentInfo.organizerEventPriorityDto &&
              appointmentInfo.organizerEventPriorityDto.id
            }
            items={getPickerItems(
              preloadedData.appointmentPriority,
              'name',
              'id',
            )}
            onValueChange={(priorityId) =>
              setAppointmentInfo({
                ...appointmentInfo,
                organizerEventPriorityId: priorityId,
                organizerEventPriorityDto: getPriorityById(priorityId),
              })
            }
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            pickerContainer={styles.pickerContainer}
            editable={editMode}
          />
          <PickerView
            label="Label Type"
            placeholder={{label: 'Label Type'}}
            value={
              appointmentInfo.organizerEventLabelDto &&
              appointmentInfo.organizerEventLabelDto.id
            }
            items={getPickerItems(
              preloadedData.appointLabelsLabels,
              'name',
              'id',
            )}
            onValueChange={(labelId) =>
              setAppointmentInfo({
                ...appointmentInfo,
                organizerEventLabelId: labelId,
                organizerEventLabelDto: getAppointmentLabelById(labelId),
              })
            }
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            pickerContainer={styles.pickerContainer}
            editable={editMode}
          />
        </EqualSpaceHorizontalView>

        <TextField
          inputTextContainerStyle={styles.pickerContainer}
          label="Remarks"
          onChangeText={onChangeText('notes')}
          value={appointmentInfo.notes}
          labelStyle={styles.pickerLabelStyle}
          multiline
          editable={editMode}
        />

        <View style={{marginTop: AppDimensions.LARGE}}>
          <Checkbox
            disabled={!editMode}
            checked={appointmentInfo.isReminder}
            onChange={(e) => onChangeText('isReminder')(e.target.checked)}>
            Reminder
          </Checkbox>
        </View>
        <DateTimeRangePicker
          mode="date"
          mode2="time"
          separator=""
          editable={editMode && appointmentInfo.isReminder}
          dateFormat2={dateFormats.hour_min_12_hr_meridian}
          containerStyle={{marginBottom: AppDimensions.NORMAL}}
          startDate={appointmentInfo.reminderDateTime}
          endDate={appointmentInfo.reminderDateTime}
          onDateChanged={onDateChanged('reminder')}
        />
        <PersonSearchBox
          selectedUsers={getPersonSearchSelectedItems(
            appointmentInfo.appointmentEventCandidateDtos,
            'candidateId',
            'candidateName',
          )}
          onUsersChanged={onUsersChanged}
          editable={editMode}
        />
        <View style={styles.flatListContainer}>
          <FlatList
            data={appointmentInfo.appointmentEventCandidateDtos}
            keyExtractor={(index) => String(index)}
            renderItem={({item, index}) => (
              <View
                style={{
                  ...styles.flatListItem,
                  backgroundColor:
                    index % 2 === 0 ? AppColors.LIST_ITEM_BG : 'white',
                }}>
                <Text style={styles.text}>{item.candidateName}</Text>
                <View style={{marginHorizontal: AppDimensions.LARGE}}>
                  <Checkbox
                    disabled={!editMode}
                    checked={item.isPrimary}
                    onChange={(e) => onPrimaryChanged(e.target.checked, index)}>
                    Primary
                  </Checkbox>
                </View>
              </View>
            )}
          />
        </View>
        <View style={{marginVertical: AppDimensions.NORMAL}}>
          <Checkbox
            disabled={
              appointmentInfo.appointmentEventCandidateDtos.length && !editMode
            }
            checked={appointmentInfo.makeMePrimary}
            onChange={(e) => onChangeText('makeMePrimary')(e.target.checked)}>
            Make Me Primary
          </Checkbox>
        </View>

        <View style={styles.footerContainer}>
          <AddEditUpdateButton
            onCancel={() => checkAndGoBack(navigation)}
            onUpdate={() => onAddUpdate(false)}
            onSubmit={() => onAddUpdate(true)}
            onEdit={() => setEditMode(true)}
            isEdit={!!appointmentId}
            editMode={editMode}
          />
        </View>
      </View>
    </BaseContainer>
  );
};

export default AddAppointmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.LIST_ITEM_BG,
  },
  pickerContainer: {
    borderWidth: 0.5,
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
    borderRadius: AppDimensions.SMALL,
    paddingVertical: AppDimensions.NORMAL,
    paddingStart: AppDimensions.NORMAL,
  },
  text: {
    width: '50%',
    ...SMALL_TEXT_STYLE,
  },
});
