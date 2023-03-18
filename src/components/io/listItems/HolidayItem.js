import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {getDateOnRequiredFormat} from 'utils';
import {BaseCard} from 'components/base';

const HolidayItem = ({item, onItemClicked}) => {
  return (
    <BaseCard containerStyle={styles.cardContainer}>
      <TouchableOpacity onPress={onItemClicked} style={styles.container}>
        <Text style={styles.titleText} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.text} numberOfLines={2}>
          {item.remarks}
        </Text>
        <Text style={styles.dateText}>
          {getDateOnRequiredFormat(item.date)}
        </Text>
      </TouchableOpacity>
    </BaseCard>
  );
};

export default HolidayItem;

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AppDimensions.NORMAL,
    paddingVertical: AppDimensions.NORMAL,
    marginVertical: AppDimensions.SMALL,
  },
  container: {},
  titleText: {
    ...NORMAL_TEXT_STYLE,
    padding: AppDimensions.SMALLER,
  },
  text: {
    ...SMALL_TEXT_STYLE,
    padding: AppDimensions.SMALLER,
  },
  dateText: {
    ...SMALL_TEXT_STYLE,
    textAlign: 'right',
    color: AppColors.UTIL,
    padding: AppDimensions.SMALLER,
  },
});
