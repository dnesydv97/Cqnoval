import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {EqualSpaceHorizontalView, CircularIconButton} from 'components';
import {moderateScale} from 'react-native-size-matters';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
} from 'styles';
import {dateFormats, getDateOnRequiredFormat} from 'utils';
import PropTypes from 'prop-types';

const DateTimePicker = ({
  label = 'Date Of Birth :',
  initialDate,
  labelStyle = {},
  minDate,
  maxDate,
  onDateChanged,
  dateFormat = dateFormats.year_month_day_dash,
  mode = 'datetime',
  editable,
}) => {
  const [date, setDate] = useState(
    initialDate ? new Date(initialDate) : new Date(),
  );
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setDate(initialDate ? new Date(initialDate) : new Date());
  }, [initialDate]);

  function onDateValueChanged(date) {
    setDate(date);
    // onDateChanged(getDateOnRequiredFormat(date, dateFormat));
  }

  function onOkPressed() {
    onDateChanged(getDateOnRequiredFormat(date, dateFormat));
    setShowPicker(false);
  }

  return (
    <>
      <EqualSpaceHorizontalView containerStyle={styles.container}>
        {label && editable ? (
          <Text style={{...styles.label, ...labelStyle}}>{label}</Text>
        ) : null}
        <Text
          style={{...styles.text, borderWidth: editable ? 0 : 0}}
          onPress={() => editable && setShowPicker(true)}>
          {getDateOnRequiredFormat(date, dateFormat)}
        </Text>
      </EqualSpaceHorizontalView>
      {showPicker && (
        <View style={styles.dateContainer}>
          <View style={styles.buttonContainer}>
            <Text
              icon="check"
              label="Confirm"
              onPress={onOkPressed}
              containerStyle={styles.roundButton}>
              Confirm
            </Text>
            <Text>Select Date</Text>
            <Text
              icon="close"
              label="cancel"
              onPress={() => setShowPicker(false)}
              containerStyle={styles.roundButton}>
              Cancel
            </Text>
          </View>
          <DatePicker
            date={date}
            onDateChange={onDateValueChanged}
            mode={mode}
            fadeToColor="rgba(245,245,245,245)"
            minimumDate={minDate && new Date(minDate)}
            maximumDate={maxDate && new Date(maxDate)}
          />
        </View>
      )}
    </>
  );
};

DateTimePicker.protoTypes = {
  label: PropTypes.string,
  initialDate: PropTypes.any,
  onDateChanged: PropTypes.func.isRequired,
  dateFormat: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['datetime', 'date', 'time']),
  editable: PropTypes.bool,
};

export default DateTimePicker;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderWidth: 1,
    // backgroundColor: AppColors.SMOKE_WHITE,
  },
  dateContainer: {
    borderWidth: 0.5,
    padding: AppDimensions.NORMAL,
    // borderRadius: AppDimensions.NORMAL,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: AppDimensions.NORMAL,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.DISABLE,
    alignItems: 'center',
  },
  roundButton: {
    borderWidth: 0,
    width: moderateScale(40),
    height: moderateScale(40),
  },
  label: {
    flex: 1,
    ...HEADING_TEXT_SIZE,
  },
  text: {
    flex: 1.1,
    ...NORMAL_TEXT_STYLE,
    paddingHorizontal: AppDimensions.SMALLER,
    // paddingVertical: AppDimensions.NORMAL,
    borderColor: AppColors.DISABLE,
    borderRadius: AppDimensions.SMALL,
    borderBottomWidth: 1,
  },
});
