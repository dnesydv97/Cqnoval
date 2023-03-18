import React from 'react';
import {View, StyleSheet} from 'react-native';
import PopoverTooltip from 'react-native-popover-tooltip';
import {AppColors, AppDimensions} from 'styles';
import {moderateScale} from 'react-native-size-matters';

const PopMenuItem = ({menuItems = [], ButtonComponent}) => {
  return (
    <View style={styles.container}>
      <PopoverTooltip
        delayLongPress={0}
        buttonComponent={ButtonComponent ? <ButtonComponent /> : null}
        items={menuItems}
        animationType="spring"
        overlayStyle={{backgroundColor: AppColors.SEMI_TRANSPARENT}} // set the overlay invisible
        tooltipContainerStyle={styles.tooltipContainerStyle}
        labelContainerStyle={styles.labelContainerStyle}
        labelSeparatorColor={AppColors.UTIL}
      />
    </View>
  );
};

export default PopMenuItem;

const styles = StyleSheet.create({
  container: {
    marginRight: moderateScale(20),
    alignItems: 'center',
    marginEnd: AppDimensions.NORMAL,
  },
  tooltipContainerStyle: {
    borderRadius: 4,
    marginRight: 15,
  },
  labelContainerStyle: {
    backgroundColor: AppColors.SMOKE_WHITE,
    width: moderateScale(150),
  },
});
