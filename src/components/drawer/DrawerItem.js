import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {moderateVerticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {navScreenNames} from 'constant';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {logout, navigateToGivenScreenWithParams} from 'utils';

const DrawerItem = ({item}) => {
  const mainTitle = item.title;
  const navigation = useNavigation();

  const onPress = () =>
    item.screen
      ? item.screen === navScreenNames.NAV_LOG_OUT
        ? logout(navigation)
        : navigateToGivenScreenWithParams(navigation, item.screen, {
            mainFilter: item.title,
            filter: 'All',
          })
      : null;

  const onSubmenuPressed = (item) =>
    item.screen &&
    navigateToGivenScreenWithParams(navigation, item.screen, {
      filter: item.title,
      mainFilter: mainTitle,
    });

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Image style={styles.icon} source={item.icon} resizeMode="contain" />
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
      {item.subMenu ? (
        <FlatList
          data={item.subMenu}
          keyExtractor={(subMenu, index) => String(subMenu.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={styles.subMenuContainer}
              onPress={() => onSubmenuPressed(item)}>
              <Image
                style={styles.icon}
                source={item.icon}
                resizeMode="contain"
              />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      ) : null}
    </>
  );
};

DrawerItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    icon: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    // screen: PropTypes.string.isRequired,
  }),
};

export default DrawerItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: AppDimensions.NORMAL,
    marginVertical: AppDimensions.SMALLEST,
    alignItems: 'center',
    marginRight: 20,
    marginTop: 10,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    height: moderateVerticalScale(35),
    borderBottomWidth: 0.3,
    left: 10,
    borderBottomColor: AppColors.UTIL,
    // backgroundColor:AppColors.ACCENT,
  },
  subMenuContainer: {
    flexDirection: 'row',
    padding: AppDimensions.NORMAL,
    marginVertical: AppDimensions.SMALLEST,
    alignItems: 'center',
    marginRight: 50,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    height: moderateVerticalScale(40),
    left: 30,
    borderBottomColor: AppColors.UTIL,
    // backgroundColor: AppColors.ACCENT,
  },
  icon: {
    height: moderateVerticalScale(20),
    width: moderateVerticalScale(20),
    marginLeft: 10,
    tintColor: AppColors.NORMAL_BLACK,
  },
  title: {
    ...SMALL_TEXT_STYLE,
    paddingHorizontal: AppDimensions.NORMAL,
    color: AppColors.NORMAL_BLACK,
  },
});
