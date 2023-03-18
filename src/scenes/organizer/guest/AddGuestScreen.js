import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  BaseContainer,
  PickerView,
  TextField,
  DateRangePickerItem,
  AddEditUpdateButton,
  DateTimePicker,
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
  getPickerItems,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';
import {getGuestDetail, getGuestLabel} from 'services';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  addNewGuest,
  resetAddUpdateGuestReducer,
  updateGuestDetail,
} from 'services/redux/guest/action';

const AddGuestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const guestRdxData = useSelector((state) => state.guestReducer, shallowEqual);
  const route = useRoute();
  const {guestId} = route?.params;

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    id: '',
    guestName: '',
    companyName: '',
    arrivalDate: '',
    departureDate: '',
    isActive: false,
    isPrivate: false,
    creationTime: '',
    guestEventStatusId: '',
    guestEventStatusDisplayName: '',
    notes: '',
  });
  const [preloadedData, setPreloadedData] = useState({
    goalLabels: [],
    goalPriority: [],
  });
  const [guestLabel, setGuestLabel] = useState([]);
  useEffect(() => {
    setLoading(guestRdxData.isLoading);
    if (
      !guestRdxData.isLoading &&
      !guestRdxData.isError &&
      guestRdxData.isNewData &&
      guestRdxData.data
    ) {
      showSuccessToast(messages.GOAL_ADDED_SUCCESS);
      checkAndGoBack(navigation);
    } else if (
      !guestRdxData.isLoading &&
      !guestRdxData.isError &&
      guestRdxData.updated &&
      guestRdxData.data
    ) {
      showSuccessToast(messages.GOAL_UPDATE_SUCCESS);
      checkAndGoBack(navigation);
    } else if (!guestRdxData.isLoading && guestRdxData.isError) {
      showFailToast(messages.GOAL_ADDED_FAIL);
    }
  }, [guestRdxData]);

  useEffect(() => {
    getGuestLabels();
    return () => {
      dispatch(resetAddUpdateGuestReducer());
    };
  }, []);

  useEffect(() => {
    setEditMode(!guestId);
    guestId && getGuestlDetailById();
  }, [guestId]);

  const onChangeText = (key) => (value) => {
    setGuestInfo({
      ...guestInfo,
      [key]: value,
    });
  };

  function getGuestLabels() {
    getGuestLabel()
      .then((response) => {
        console.log('Guest Label Response ', response);
        if (response.status === 200) setGuestLabel(response.data);
      })
      .catch(onError);
  }

  function getGuestlDetailById() {
    setLoading(true);
    getGuestDetail(guestId)
      .then((response) => {
        setLoading(false);
        console.log('Guest Detail response ', response);
        if (response.status === 200) setGuestInfo(response.data);
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
        showFailToast(messages.GOAL_DETAIL_FAILED);
      });
  }

  function onAddUpdate(isNew = true) {
    setLoading(true);
    console.log('Data to be sent to server ', guestInfo);
    console.log('Data to be sent to server ', JSON.stringify(guestInfo));

    dispatch(isNew ? addNewGuest(guestInfo) : updateGuestDetail(guestInfo));
  }

  return (
    <BaseContainer
      loading={loading}
      toolbarTitle={screenNames.ADD_GUEST_SCREEN}
      style={{flex: 1}}
      scrollable>
      <View style={styles.container}>
        <TextField
          inputTextContainerStyle={styles.pickerContainer}
          label="Guest Name"
          onChangeText={onChangeText('guestName')}
          value={guestInfo.guestName}
          labelStyle={styles.pickerLabelStyle}
          editable={editMode}
        />
        <TextField
          inputTextContainerStyle={styles.pickerContainer}
          label="Company Name"
          onChangeText={onChangeText('companyName')}
          value={guestInfo.companyName}
          labelStyle={styles.pickerLabelStyle}
          editable={editMode}
        />
        {/*<DateTimeRangePicker
          editable={editMode}
          onDateChanged={onChangeText('arrivalDate')}
          mode="date"
        />*/}
        {/* <DateRangePickerItem
          startDate={onChangeText('arrivalDate')}
          endDate={onChangeText('departureDate')}
          
        /> */}
        <DateTimePicker
          label="Arrival Date"
          labelStyle={styles.pickerLabelStyle}
          initialDate={guestInfo.arrivalDate}
          editable={editMode}
          mode="date"
          onDateChanged={onChangeText('arrivalDate')}
        />
        <DateTimePicker
          label="Departure Date"
          labelStyle={styles.pickerLabelStyle}
          initialDate={guestInfo.departureDate}
          editable={editMode}
          mode="date"
          onDateChanged={onChangeText('departureDate')}
        />
        <PickerView
          label="Status"
          placeholder={{label: 'Set Priority'}}
          value={guestInfo.guestEventStatusId}
          items={getPickerItems(guestLabel, 'displayName', 'id')}
          onValueChange={onChangeText('guestEventStatusId')}
          labelStyle={styles.pickerLabelStyle}
          pickerStyle={styles.pickerStyle}
          pickerContainer={styles.pickerContainer}
          editable={editMode}
        />
        <TextField
          inputTextContainerStyle={{
            ...styles.pickerContainer,
          }}
          label="Purpose of Visit"
          onChangeText={onChangeText('notes')}
          value={guestInfo.notes}
          labelStyle={styles.pickerLabelStyle}
          editable={editMode}
          multiline
        />
        <View style={{marginVertical: AppDimensions.NORMAL}}>
          <Checkbox
            checked={guestInfo.isPrivate}
            disabled={!editMode}
            onChange={(e) => onChangeText('isPrivate')(e.target.checked)}>
            Set Private
          </Checkbox>
        </View>

        <View style={styles.footerContainer}>
          <AddEditUpdateButton
            onCancel={() => checkAndGoBack(navigation)}
            onUpdate={() => onAddUpdate(false)}
            onEdit={() => setEditMode(true)}
            onSubmit={() => onAddUpdate(true)}
            isEdit={!!guestId}
            editMode={editMode}
          />
        </View>
      </View>
    </BaseContainer>
  );
};
export default AddGuestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.LIST_ITEM_BG,
    height: '100%',
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
});
