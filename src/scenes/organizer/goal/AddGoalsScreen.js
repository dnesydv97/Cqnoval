import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  BaseContainer,
  BaseCard,
  PickerView,
  TextField,
  DateTimePicker,
  AddEditUpdateButton,
} from 'components';
import {Button, Checkbox} from '@ant-design/react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {messages, screenNames} from 'constant';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALLEST_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import {
  checkAndGoBack,
  getPickerItems,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';
import {
  addGoal,
  getGoalDetail,
  getGoalLabels,
  getGoalPriority,
  updateGoal,
} from 'services';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  addNewGoal,
  resetAddUpdateGoalReducer,
  updateGoalDetail,
} from 'services/redux/goal/action';


const AddGoalsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {goalId} = route?.params;

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [goalInfo, setGoalInfo] = useState({
    id: '',
    title: '',
    details: '',
    dueDate: '',
    organizerEventLabelId: '',
    organizerEventPriorityId: '',
    isActive: true,
    isComplete: false,
  });
  const [preloadedData, setPreloadedData] = useState({
    goalLabels: [],
    goalPriority: [],
  });

  useEffect(() => {
    getRequiredData();
  }, []);

  useEffect(() => {
    setEditMode(!goalId);
    goalId && getGoalDetailById();
  }, [goalId]);

  const onChangeText = (key) => (value) => {
    setGoalInfo({
      ...goalInfo,
      [key]: value,
    });
  };

  function getRequiredData() {
    Promise.all([getGoalLabels(), getGoalPriority()])
      .then((response) => {
        console.log('Required Data Response', response);
        setPreloadedData({
          ...preloadedData,
          goalLabels: response[0].data,
          goalPriority: response[1].data,
        });
      })
      .catch((error) => {
        onError(error);
      });
  }

  function getGoalDetailById() {
    setLoading(true);
    getGoalDetail(goalId)
      .then((response) => {
        setLoading(false);
        console.log('Goal Detail response ', response);
        if (response.status === 200) setGoalInfo(response.data);
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
        showFailToast(messages.GOAL_DETAIL_FAILED);
      });
  }

  function onAddUpdate(isNew = true) {
    setLoading(true);
    console.log('Data to be sent to server', goalInfo);
    console.log('Data to be sent to server', JSON.stringify(goalInfo));

    dispatch(isNew? addNewGoal(goalInfo) : updateGoalDetail(goalInfo));
    {/*isNew
      ? addGoal(goalInfo)
          .then((response) => {
            console.log('Add Goal response');
            setLoading(false);
            if (response.status === 200) {
              showSuccessToast(messages.GOAL_ADDED_SUCCESS);
              checkAndGoBack(navigation);
            } else showFailToast(messages.GOAL_ADDED_FAIL);
          })
          .catch((error) => {
            setLoading(false);
            showFailToast(messages.GOAL_ADDED_FAIL);
            onError(error);
          })
      : updateGoal(goalInfo, goalInfo.id)
          .then((response) => {
            console.log('Update Goal response');
            setLoading(false);
            if (response.status === 200) {
              showSuccessToast(messages.GOAL_UPDATE_SUCCESS);
              checkAndGoBack(navigation);
            } else showFailToast(messages.GOAL_UPDATE_FAILED);
          })
          .catch((error) => {
            setLoading(false);
            showFailToast(messages.GOAL_UPDATE_FAILED);
            onError(error);
          });*/}
  }

  return (
    <BaseContainer
      loading={loading}
      toolbarTitle={screenNames.ADD_GOALS_SCREEN}
      scrollable>
      <View style={styles.container}>
        <PickerView
          label="Goal Label"
          value={goalInfo.organizerEventLabelId}
          onValueChange={onChangeText('organizerEventLabelId')}
          items={getPickerItems(preloadedData.goalLabels, 'name', 'id')}
          placeholder={{label: 'Goal Labels'}}
          labelStyle={styles.pickerLabelStyle}
          pickerStyle={styles.pickerStyle}
          pickerContainer={styles.pickerContainer}
          editable={editMode}
        />
        <TextField
          inputTextContainerStyle={styles.pickerContainer}
          label="Goal Title"
          onChangeText={onChangeText('title')}
          value={goalInfo.title}
          labelStyle={styles.pickerLabelStyle}
          editable={editMode}
        />
        <DateTimePicker
          label="Due Date"
          labelStyle={styles.pickerLabelStyle}
          initialDate={goalInfo.dueDate}
          editable={editMode}
          mode="date"
          onDateChanged={onChangeText('dueDate')}
        />
        <PickerView
          label="Priority"
          placeholder={{label: 'Set Priority'}}
          value={goalInfo.organizerEventPriorityId}
          items={getPickerItems(preloadedData.goalPriority, 'name', 'id')}
          onValueChange={onChangeText('organizerEventPriorityId')}
          labelStyle={styles.pickerLabelStyle}
          pickerStyle={styles.pickerStyle}
          pickerContainer={styles.pickerContainer}
          editable={editMode}
        />
        <TextField
          inputTextContainerStyle={{
            ...styles.pickerContainer,
          }}
          label="Details"
          onChangeText={onChangeText('details')}
          value={goalInfo.details}
          labelStyle={styles.pickerLabelStyle}
          editable={editMode}
          multiline
          numberOfLines={4}
        />
        <View style={{marginVertical: AppDimensions.NORMAL}}>
          <Checkbox
            checked={goalInfo.isComplete}
            disabled={!editMode}
            onChange={(e) => onChangeText('isComplete')(e.target.checked)}>
            Mark As Completed
          </Checkbox>
        </View>

        <View style={styles.footerContainer}>
          <AddEditUpdateButton
            onCancel={() => checkAndGoBack(navigation)}
            onUpdate={() => onAddUpdate(true)}
            onSubmit={() => onAddUpdate(true)}
            onEdit={() => setEditMode(true)}
            isEdit={!!goalId}
            editMode={editMode}
          />
        </View>
      </View>
    </BaseContainer>
  );
};
export default AddGoalsScreen;

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
    alignContent: 'flex-start',
  },
  footerContainer: {
    width: '100%',
    position: 'relative',
    bottom: 0,

  },
});
