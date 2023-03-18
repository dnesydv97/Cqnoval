import React, {useState} from 'react';
import Icons from 'assets';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {BaseModal} from 'components';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {extraTabMenus, navScreenNames} from 'constant';
import {AppColors, AppDimensions, WINDOW_WIDTH} from 'styles';
import {isAndroid, navigateToGivenScreen} from 'utils';
import {width} from 'react-native-daterange-picker/src/modules';

const MoreTabBarItem = ({navigation, modalVisibility, onDismiss}) => {
  // const [modalVisibility, setModalVisibility] = useState(false);

  const entryAnimation = (value) =>
    Animated.timing(value, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    });
  const exitAnimation = (value) =>
    Animated.timing(value, {
      toValue: 200,
      duration: 300,
      useNativeDriver: true,
    });

  const [moreTabMenus, setMoreTabMenus] = useState(extraTabMenus);

  const TabBarItem = ({name, screen, title, index, active}) => {
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={active ? {selected: true} : {}}
        onPress={() => onPress(index, screen)}
        style={{
          height: moderateVerticalScale(70),
          width: isAndroid
            ? moderateScale(WINDOW_WIDTH / 5.6)
            : moderateScale(WINDOW_WIDTH / 5.0),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: active ? AppColors.UTIL : '',
          paddingVertical: 10,
        }}>
        <View style={styles.iconStyle}>
          <IconOutline
            name={name}
            size={moderateScale(30)}
            color={active ? AppColors.PRIMARY_DARK : '#AFAFAF'}
          />
        </View>
        <Text
          style={{
            color: active ? AppColors.UTIL : AppColors.NORMAL_BLACK,
            fontSize: moderateScale(12),
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const onPress = (clickedIndex, screen) => {
    const newArray = moreTabMenus.map((item, index) => {
      if (index === clickedIndex)
        return {
          ...item,
          active: true,
        };
      return {
        ...item,
        active: false,
      };
    });
    setMoreTabMenus(newArray);
    onDismiss(false);
    navigateToGivenScreen(navigation, screen);
  };

  return (
    <View style={styles.container}>
      <IconOutline
        color={'#AFAFAF'}
        size={moderateScale(25)}
        name="more"
      />
      {modalVisibility && (
        <BaseModal
          containerStyle={styles.modalContainerStyle}
          modalStyle={styles.modalStyle}
          bodyStyle={{paddingHorizontal: 0}}
          visibility={modalVisibility}
          collapsable
          title=""
          hasCrossIcon={false}
          hasDropDownIcon={true}
          hideOnEmptyAreaClicked
          animationType="fade"
          entryAnimation={entryAnimation}
          exitAnimation={exitAnimation}
          animationInitialValue={100}
          onDismiss={() => onDismiss(false)}>
          <View style={{flexDirection: 'row'}}>
            {moreTabMenus.map((item, index) => (
              <TabBarItem key={Math.random()} {...item} index={index} />
            ))}
          </View>
        </BaseModal>
      )}
    </View>
  );
};

export default MoreTabBarItem;

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: 'red',
  },
  modalStyle: {
    // borderWidth: 1,
    // borderColor: 'red',
    backgroundColor: AppColors.SEMI_TRANSPARENT,
    marginBottom: moderateScale(55),
  },
  modalContainerStyle: {
    height: moderateScale(100),
    position: 'absolute',
    bottom: 0,
    borderWidth: 1,
    borderColor: AppColors.DISABLE,
  },
  iconStyle: {
    height: moderateScale(35),
    width: moderateScale(35),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppDimensions.SMALL,
  },
});
