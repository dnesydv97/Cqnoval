import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {AppColors, AppDimensions} from 'styles';
import {isToday} from 'utils';

const DayView = ({date, state, marking, onDayClick, selectedDate}) => {
  return (
    <TouchableOpacity
      key={date.timestamp}
      style={{
        ...styles.container,
        backgroundColor:
          selectedDate === date.dateString
            ? AppColors.PRIMARY_DARK
            : isToday(date.dateString)
            ? AppColors.FAV_LIST_COLOR
            : AppColors.TRANSPARENT,
      }}
      onPress={() => onDayClick(date, state, marking)}>
      <Text
        style={{
          ...styles.dayText,
          color:
            state === 'disabled'
              ? 'gray'
              : selectedDate === date.dateString
              ? 'white'
              : 'black',
        }}>
        {date.day}
      </Text>
      <View style={{flexDirection: 'row'}}>
        {marking?.dots &&
          marking.dots.map((dot) => (
            <View
              key={Math.random()}
              style={{
                ...styles.dotMarker,
                backgroundColor: dot.color.toLowerCase(),
              }}
            />
          ))}
      </View>
    </TouchableOpacity>
  );
};

export default DayView;

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    borderColor: AppColors.DISABLE,
    borderRadius: moderateScale(20),
    width: moderateScale(35),
    height: moderateVerticalScale(35),
    // padding: AppDimensions.SMALL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    textAlign: 'center',
  },
  dotMarker: {
    margin: 1,
    height: 6,
    width: 6,
    borderRadius: 3,
  },
});
