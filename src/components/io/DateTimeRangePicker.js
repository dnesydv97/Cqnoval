import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {DateTimePicker} from 'components';
import {dateFormats, getDateOnRequiredFormat} from 'utils';
import {EqualSpaceHorizontalView} from 'components/base';
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors, AppDimensions, NORMAL_TEXT_STYLE} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import DatePicker from 'react-native-date-picker';

const DateTimeRangePicker = ({
  startDate,
  endDate,
  minDate,
  maxDate,
  onDateChanged,
  dateFormat = dateFormats.year_month_day_dash,
  dateFormat2 = dateFormats.year_month_day_dash,
  mode = 'datetime',
  mode2 = 'datetime',
  separator = 'To',
  editable,
  containerStyle = {},
}) => {
  const [dateRange, setDateRange] = useState({
    startDate: startDate ? new Date(startDate) : new Date(),
    endDate: endDate ? new Date(endDate) : new Date(),
  });
  const [showPicker, setShowPicker] = useState(false);
  const [isStartDate, setIsStartDate] = useState(true);

  useEffect(() => {
    setDateRange({
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
    });
  }, [startDate, endDate]);

  function onOkPressed() {
    onDateChanged(dateRange);
    setShowPicker(false);
  }

  const onDateChange = (value) => {
    setDateRange(
      isStartDate
        ? {
            ...dateRange,
            startDate: value,
          }
        : {
            ...dateRange,
            endDate: value,
          },
    );
  };

  function onPress(isStart) {
    setIsStartDate(isStart);
    editable && setShowPicker(true);
  }

  return (
    <View style={{...styles.container, ...containerStyle}}>
      <View
        style={{
          ...styles.dateRangeContainer,
          // borderColor: editable ? 'black' : 'grey',
        }}>
        <View
          style={{
            ...styles.dateIconContainer,
            borderColor: editable ? 'black' : 'grey',
          }}>
          <Text style={styles.text} onPress={() => onPress(true)}>
            {getDateOnRequiredFormat(dateRange.startDate, dateFormat)}
          </Text>
          <IconOutline
            name={mode === 'time' ? 'clock-circle' : 'calendar'}
            size={20}
            style={styles.icon}
            onPress={() => onPress(true)}
          />
        </View>
        <Text style={styles.text}>{separator}</Text>
        <View
          style={{
            ...styles.dateIconContainer,
            borderColor: editable ? 'black' : 'grey',
          }}>
          <Text style={styles.text} onPress={() => onPress(false)}>
            {getDateOnRequiredFormat(dateRange.endDate, dateFormat2)}
          </Text>
          <IconOutline
            name={mode2 === 'time' ? 'clock-circle' : 'calendar'}
            size={20}
            style={styles.icon}
            onPress={() => onPress(false)}
          />
        </View>
      </View>

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
            date={isStartDate ? dateRange.startDate : dateRange.endDate}
            onDateChange={onDateChange}
            mode={isStartDate ? mode : mode2}
            fadeToColor="rgba(245,245,245)"
            minimumDate={minDate && new Date(minDate)}
            maximumDate={maxDate && new Date(maxDate)}
          />
        </View>
      )}
    </View>
  );
};

export default DateTimeRangePicker;

const styles = StyleSheet.create({
  container: {},
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: AppDimensions.SMALL,
    // borderRadius: AppDimensions.SMALL,
    // borderColor: AppColors.DISABLE,
    // borderWidth: 1,
  },
  dateIconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: AppDimensions.SMALL,
    borderColor: AppColors.DISABLE,
    borderWidth: 1,
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    paddingHorizontal: AppDimensions.SMALL,
    paddingVertical: AppDimensions.NORMAL,
    textAlign: 'center',
  },
  icon: {
    padding: AppDimensions.SMALL,
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
});
