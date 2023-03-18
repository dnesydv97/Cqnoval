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
import {getTodoDetail} from 'services';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {moderateScale} from 'react-native-size-matters';
import {
  addNewTodo,
  resetAddUpdateTodoReducer,
  updateTodoDetail,
} from 'services/redux/todo/action';
import {IconOutline} from '@ant-design/icons-react-native';
import {getGoalLabels, getGoalPriority, getTodoStatus} from 'services';

const getCandidateObj = (id, name) => {
  return {
    id: '',
    todoEventId: '',
    candidateId: id,
    candidateName: name,
    isPrimary: true,
    isSupervisor: false,
    isActive: true,
  };
};

const AddTodoScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const todoRdxData = useSelector((state) => state.todoReducer, shallowEqual);

  const route = useRoute();
  const {todoId} = route?.params;

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [todoInfo, setTodoInfo] = useState({
    id: null,
    subject: '',
    startDate: '',
    dueDate: '',
    notes: '',
    todoEventStatusId: null,
    organizerEventPriorityId: null,
    organizerEventLabelId: null,
    todoEventViewTypeId: null,
    privateUserId: null,
    isActive: true,
    todoEventCandidateDtos: [],
    selectedUsers: [],
  });
  const [preloadedData, setPreloadedData] = useState({
    todoLabels: [],
    todoPriority: [],
    todoProgress: [],
  });

  useEffect(() => {
    setLoading(todoRdxData.isLoading);
    if (
      !todoRdxData.isLoading &&
      !todoRdxData.isError &&
      todoRdxData.isNewData &&
      todoRdxData.data
    ) {
      showSuccessToast(messages.GOAL_ADDED_SUCCESS);
      checkAndGoBack(navigation);
    } else if (
      !todoRdxData.isLoading &&
      !todoRdxData.isError &&
      todoRdxData.updated &&
      todoRdxData.data
    ) {
      showSuccessToast(messages.GOAL_UPDATE_SUCCESS);
      checkAndGoBack(navigation);
    } else if (!todoRdxData.isLoading && todoRdxData.isError) {
      showFailToast(messages.GOAL_ADDED_FAIL);
    }
  }, [todoRdxData]);

  useEffect(() => {
    // console.log('Add Todo Preloaded data ', preloadedData);
    getPreloadedData();
    return () => {
      dispatch(resetAddUpdateTodoReducer());
    };
  }, []);

  useEffect(() => {
    setEditMode(!todoId);
    todoId && getTodoDetailById();
  }, [todoId]);

  const onChangeText = (key) => (value) => {
    setTodoInfo({
      ...todoInfo,
      [key]: value,
    });
  };

  function getTodoDetailById() {
    setLoading(true);
    getTodoDetail(todoId)
      .then((response) => {
        setLoading(false);
        console.log('Todo Detail response ', response);
        if (response.status === 200)
          setTodoInfo({
            ...response.data,
            selectedUsers: [...response.data.todoEventCandidateDtos],
          });
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
        showFailToast(messages.GOAL_DETAIL_FAILED);
      });
  }

  function onAddUpdate(isNew = true) {
    setLoading(true);
    console.log('Data to be sent to server ', todoInfo);
    console.log('Data to be sent to server ', JSON.stringify(todoInfo));
    delete todoInfo.startDateTime;
    delete todoInfo.endDateTime;
    delete todoInfo.reminderDateTime;
    delete todoInfo.organizerEventLabelDto;
    delete todoInfo.organizerEventPriorityDto;

    dispatch(isNew ? addNewTodo(todoInfo) : updateTodoDetail(todoInfo));
  }

  function onPrimaryChanged(key, checked, searchIndex) {
    let candidates = todoInfo.todoEventCandidateDtos.map((candi, index) => {
      if (index === searchIndex) {
        if (key === 'reset') {
          (candi.isPrimary = false), (candi.isSupervisor = false);
        } else candi[key] = checked;
      }
      return candi;
    });

    onChangeText('appointmentEventCandidateDtos')(candidates);
  }

  function onUserDeleted(userIndex) {
    const tempUsers = todoInfo.todoEventCandidateDtos;
    tempUsers.splice(userIndex, 1);
    onChangeText('todoEventCandidateDtos')(tempUsers);
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

    onChangeText('todoEventCandidateDtos')(convertedUsers);
  }

  const onDateChanged = (type) => (dateRange) => {
    if (type === 'start') {
      setTodoInfo({
        ...todoInfo,
        startDate: dateRange.startDate,
        dueDate: dateRange.endDate,
      });
    } else if ((type = 'reminder')) {
      setTodoInfo({
        ...todoInfo,
        reminderDate: dateRange.startDate,
        reminderTime: getDateOnRequiredFormat(
          dateRange.endDate,
          dateFormats.hour_min_24_hr,
        ),
      });
    }
  };

  function getPriorityById(id) {
    const priorityItem = preloadedData.todoPriority.find(
      (item) => item.id === id,
    );
    return priorityItem;
  }

  function getAppointmentLabelById(id) {
    const labelItem = preloadedData.todoLabels.find((item) => item.id === id);
    return labelItem;
  }

  const renderUserItem = ({item, index}) => {
    return (
      <View
        style={{
          ...styles.flatListItem,
          backgroundColor: index % 2 === 0 ? AppColors.LIST_ITEM_BG : 'white',
        }}>
        <Text style={styles.text}>{item.candidateName}</Text>
        <View style={{marginHorizontal: AppDimensions.SMALLER}}>
          <Checkbox
            disabled={!editMode}
            checked={item.isSupervisor}
            onChange={(e) =>
              onPrimaryChanged('isSupervisor', e.target.checked, index)
            }>
            Supervisor
          </Checkbox>
        </View>
        <View style={{marginHorizontal: AppDimensions.SMALLER}}>
          <Checkbox
            disabled={!editMode}
            checked={item.isPrimary}
            onChange={(e) =>
              onPrimaryChanged('isPrimary', e.target.checked, index)
            }>
            Primary
          </Checkbox>
        </View>
        <Text
          onPress={() => editMode && onPrimaryChanged('reset', false, index)}
          style={{color: editMode ? AppColors.PRIMARY_DARK : AppColors.UTIL}}>
          Reset
        </Text>
        <IconOutline
          name="close"
          color={editMode ? 'red' : 'grey'}
          size={20}
          onPress={() => editMode && onUserDeleted(index)}
        />
      </View>
    );
  };

  function getPreloadedData() {
    Promise.all([getGoalLabels(), getGoalPriority(), getTodoStatus()])
      .then((response) => {
        console.log('Preloaded Data Response', response);
        setPreloadedData({
          ...preloadedData,
          todoLabels: [{id: null, name: 'Show All'}, ...response[0].data],
          todoPriority: response[1].data,
          todoProgress: response[2].data,
        });
      })
      .catch(onError);
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
          value={todoInfo.subject}
          labelStyle={styles.pickerLabelStyle}
          editable={editMode}
        />

        <EqualSpaceHorizontalView>
          <PickerView
            label="Progress"
            placeholder={{label: 'Select Progress'}}
            value={todoInfo.todoEventStatusId}
            items={getPickerItems(preloadedData.todoProgress, 'name', 'id')}
            onValueChange={onChangeText('todoEventStatusId')}
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            pickerContainer={styles.pickerContainer}
            editable={editMode}
          />
          <PickerView
            label="Priority"
            placeholder={{label: 'Set Priority'}}
            value={todoInfo.organizerEventPriorityId}
            items={getPickerItems(preloadedData.todoPriority, 'name', 'id')}
            onValueChange={onChangeText('organizerEventPriorityId')}
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            pickerContainer={styles.pickerContainer}
            editable={editMode}
          />
        </EqualSpaceHorizontalView>

        <Text style={{...NORMAL_TEXT_STYLE, marginTop: AppDimensions.NORMAL}}>
          Start Date - Due Date
        </Text>
        <DateTimeRangePicker
          mode="date"
          mode2="date"
          startDate={todoInfo.startDateTime}
          endDate={todoInfo.startDateTime}
          onDateChanged={onDateChanged('start')}
          separator=""
          editable={editMode}
        />

        <PickerView
          label="Todo Labels"
          placeholder={{label: 'Todo Type'}}
          value={todoInfo.organizerEventLabelId}
          items={getPickerItems(preloadedData.todoLabels, 'name', 'id')}
          onValueChange={onChangeText('organizerEventLabelId')}
          labelStyle={styles.pickerLabelStyle}
          pickerStyle={styles.pickerStyle}
          pickerContainer={styles.pickerContainer}
          editable={editMode}
        />

        <TextField
          inputTextContainerStyle={styles.pickerContainer}
          label="Remarks"
          onChangeText={onChangeText('notes')}
          value={todoInfo.notes}
          labelStyle={styles.pickerLabelStyle}
          multiline
          editable={editMode}
        />

        <View style={{marginTop: AppDimensions.LARGE}}>
          <Checkbox
            disabled={!editMode}
            checked={todoInfo.isReminder}
            onChange={(e) => onChangeText('isReminder')(e.target.checked)}>
            Reminder
          </Checkbox>
        </View>

        <DateTimeRangePicker
          mode="date"
          mode2="time"
          separator=""
          editable={editMode && todoInfo.isReminder}
          dateFormat2={dateFormats.hour_min_12_hr_meridian}
          containerStyle={{marginBottom: AppDimensions.NORMAL}}
          startDate={todoInfo.reminderDateTime}
          endDate={todoInfo.reminderDateTime}
          onDateChanged={onDateChanged('reminder')}
        />

        {/* <View style={{marginTop: AppDimensions.LARGE}}>
          <Checkbox
            disabled={!editMode}
            checked={todoInfo.isReminder}
            onChange={(e) => onChangeText('isReminder')(e.target.checked)}>
            Assign
          </Checkbox>
        </View> */}

        <Text style={styles.pickerLabelStyle}>Assign</Text>
        <PersonSearchBox
          selectedUsers={getPersonSearchSelectedItems(
            todoInfo.todoEventCandidateDtos,
            'candidateId',
            'candidateName',
          )}
          onUsersChanged={onUsersChanged}
          editable={editMode}
        />

        <View style={styles.flatListContainer}>
          <FlatList
            data={todoInfo.todoEventCandidateDtos}
            keyExtractor={(index) => String(index)}
            renderItem={renderUserItem}
          />
        </View>
        {todoId && (
          <PickerView
            label="Choose Private User"
            placeholder={{label: 'Select User'}}
            value={todoInfo.privateUserId}
            items={getPickerItems(
              todoInfo.selectedUsers,
              'candidateName',
              'candidateId',
            )}
            onValueChange={onChangeText('privateUserId')}
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            pickerContainer={styles.pickerContainer}
            editable={editMode && !todoInfo.todoEventCandidateDtos.length}
          />
        )}

        <View style={styles.footerContainer}>
          <AddEditUpdateButton
            onCancel={() => checkAndGoBack(navigation)}
            onUpdate={() => onAddUpdate(false)}
            onSubmit={() => onAddUpdate(true)}
            onEdit={() => setEditMode(true)}
            isEdit={!!todoId}
            editMode={editMode}
          />
        </View>
      </View>
    </BaseContainer>
  );
};

export default AddTodoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.LIST_ITEM_BG,
  },
  pickerContainer: {
    borderWidth: 0.5,
    backgroundColor: AppColors.SMOKE_WHITE,
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
