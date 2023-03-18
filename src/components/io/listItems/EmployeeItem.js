import {useNavigation} from '@react-navigation/native';
import {Icons, Images} from 'assets';
import {BaseCard} from 'components';
import {navScreenNames} from 'constant';
import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
} from 'styles';
import {
  getDateFromFullSystemDate,
  getDisplayValue,
  navigateToGivenScreenWithParams,
} from 'utils';

const EmployeeItem = ({employee}) => {
  const navigation = useNavigation();

  const onPress = () =>
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_PROFILE_SCREEN,
      {userId: employee.appUserId},
    );
  return (
    <BaseCard containerStyle={styles.cardContainer}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Image style={styles.icon} source={Images.logo} />
        <View style={styles.infoContainer}>
          <Text style={styles.nameStyle}>{employee.employeeName}</Text>
          <Text style={styles.infoText}>{`Mobile: ${getDisplayValue(
            employee.phoneMobile,
          )}`}</Text>
          <Text style={styles.infoText}>{`Joined: ${getDateFromFullSystemDate(
            employee.hireDate,
          )}`}</Text>
        </View>
      </TouchableOpacity>
    </BaseCard>
  );
};

export default EmployeeItem;

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AppDimensions.NORMAL,
    paddingVertical: AppDimensions.NORMAL,
    marginVertical: AppDimensions.SMALL,
  },
  container: {
    flexDirection: 'row',
    // margin: AppDimensions.SMALL,
    // padding: AppDimensions.SMALL,
    // backgroundColor: AppColors.SEMI_TRANSPARENT_WHITE,
    // borderRadius: moderateScale(4),
  },
  infoContainer: {padding: AppDimensions.SMALL},
  icon: {
    height: moderateVerticalScale(70),
    width: moderateScale(70),
    backgroundColor: AppColors.SMOKE_WHITE,
    borderRadius: moderateScale(80 / 2),
  },
  nameStyle: {
    ...HEADING_TEXT_SIZE,
    paddingVertical: AppDimensions.SMALL,
  },
  infoText: {
    ...SMALLER_TEXT_STYLE,
  },
});
