import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppColors, AppDimensions, WINDOW_WIDTH} from 'styles';
import {
  checkAndGoBack,
  getDateOnRequiredFormat,
  navigateToGivenScreen,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';
import {messages, screenNames} from 'constant';
import {
  BaseContainer,
  TextField,
  DateTimePicker,
  EditUpdateButton,
} from 'components';
import {Button} from '@ant-design/react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {addHoliday, getHolidyDetailById} from 'services';

const AddHolidayScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {holidayId, minDate, maxDate} = route?.params;

  const [holidayInfo, setHolidayInfo] = useState({
    id: '',
    title: '',
    date: new Date(),
    remarks: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setEditMode(holidayId === null);
    holidayId && getHolidayDetail();
  }, [holidayId]);

  const onChangeText = (key) => (value) => {
    setHolidayInfo({
      ...holidayInfo,
      [key]: value,
    });
  };

  function getHolidayDetail() {
    setLoading(true);
    getHolidyDetailById(holidayId)
      .then((response) => {
        setLoading(false);
        console.log('Holiday Detail response ', response);
        if (response.status === 200) setHolidayInfo(response.data);
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
        showFailToast(messages.HOLIDAY_DETAIL_FAILED);
      });
  }

  function onAddUpdate(isNew = true) {
    setLoading(true);
    addHoliday([holidayInfo])
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          showSuccessToast(
            isNew
              ? messages.HOLIDAY_ADDED_SUCCESS
              : messages.HOLIDAY_UPDATE_SUCCESS,
          );
          checkAndGoBack(navigation);
        } else
          showFailToast(
            isNew
              ? messages.HOLIDAY_ADDED_FAIL
              : messages.HOLIDAY_UPDATE_FAILED,
          );
      })
      .catch((error) => {
        setLoading(false);
        showFailToast(
          isNew ? messages.HOLIDAY_ADDED_FAIL : messages.HOLIDAY_UPDATE_FAILED,
        );
        onError(error);
      });
  }
  return (
    <BaseContainer
      toolbarTitle={screenNames.ADD_HOLIDAY_SCREEN}
      // loading={loading}
      >
      <View style={styles.container}>
        <TextField
          label="Holiday Title"
          onChangeText={onChangeText('title')}
          value={holidayInfo.title}
          labelStyle={styles.labelStyle}
          editable={editMode}
        />
        <DateTimePicker
          label="Date"
          initialDate={holidayInfo.date}
          editable={editMode}
          mode="date"
          onDateChanged={onChangeText('date')}
          minDate={minDate}
          maxDate={maxDate}
        />
        <TextField
          label="Remarks"
          onChangeText={onChangeText('remarks')}
          value={holidayInfo.remarks}
          labelStyle={styles.labelStyle}
          editable={editMode}
          multiline
        />

        <View style={styles.footerContainer}>
          <AddEditUpdateButton
            onCancel={() => checkAndGoBack(navigation)}
            onUpdate={() => onAddUpdate(false)}
            onEdit={() => setEditMode(true)}
            isEdit={!!holidayId}
            editMode={editMode}
          />
        </View>
      </View>
    </BaseContainer>
  );
};

export default AddHolidayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelStyle: {
    color: AppColors.PRIMARY_TEXT,
  },
  footerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: AppDimensions.SMALL,
    position: 'absolute',
    bottom: 0,
  },
});
