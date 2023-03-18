import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {AppColors, AppDimensions} from 'styles';

const TableRow = ({
  row = ['Column 1, Column 2, Column 3'],
  isHeader,
  index,
  size = [150, 150, 150],
  headerColor = AppColors.PRIMARY_DARK,
}) => {
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isHeader
          ? headerColor
          : index % 2 !== 0
          ? AppColors.SMOKE_WHITE
          : AppColors.DISABLE,
      }}>
      {row.map((item, index) => (
        <Text
          style={{
            ...styles.textStyle,
            width: moderateScale(size[index]),
            color: isHeader ? AppColors.SMOKE_WHITE : AppColors.PRIMARY_TEXT,
          }}>
          {item}
        </Text>
      ))}
    </View>
  );
};

export default TableRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: AppDimensions.NORMAL,
    paddingHorizontal: AppDimensions.SMALL,
  },
  textStyle: {
    paddingHorizontal: AppDimensions.SMALL,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
