import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {shallowEqual, useSelector} from 'react-redux';
import {Images} from 'assets';
import {navScreenNames} from 'constant';
import {DrawerItem} from 'components';
import {AppColors, NORMAL_TEXT_STYLE, SMALLER_TEXT_STYLE} from 'styles';
import {
  getDisplayValue,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
} from 'utils';
import {getUserRole} from 'services';
import PropTypes from 'prop-types';
import {getFullFileUrl} from 'scenes/contact/functions';
import {useIsDrawerOpen} from '@react-navigation/drawer';

const CustomDrawer = ({menu = []}) => {
  const navigation = useNavigation();
  const isDrawerOpen = useIsDrawerOpen();

  const profileReducer = useSelector(
    (state) => state.profileReducer,
    shallowEqual,
  );
  const [source, setSource] = useState(Images.profileAvatar);

  useEffect(() => {
    getProfilePicture();
  }, [profileReducer]);

  const parentNavigation = navigation.dangerouslyGetParent();

  useEffect(() => {
    parentNavigation.setParams({isDrawerOpen});
  }, [isDrawerOpen]);

  async function getProfilePicture() {
    profileReducer.data?.employeePersonalDetailUpdateDto?.uploadedFileDtos
      ?.length &&
      setSource({
        uri: await getFullFileUrl(
          profileReducer.data.employeePersonalDetailUpdateDto
            .uploadedFileDtos[0].viewFileURL,
        ),
      });
  }

  const onPress = () =>
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_PROFILE_SCREEN,
      {
        userId: null,
      },
    );

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <TouchableWithoutFeedback onPress={onPress}>
          <Image
            style={styles.icon}
            source={source}
            defaultSource={Images.profileAvatar}
            onError={() => setSource(Images.profileAvatar)}
          />
        </TouchableWithoutFeedback>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.drawerHeader}>
            <Text style={styles.text}>
              {getDisplayValue(
                profileReducer.data?.employeePersonalDetailUpdateDto
                  ?.employeeName,
              )}
            </Text>
            <Text style={styles.smallText}>
              {getDisplayValue(
                profileReducer.data?.employeeOfficialDetailUpdateDto
                  ?.officialEmail,
              )}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={menu}
        contentInset={{right: 0, top: 0, left: 0, bottom: 200}}
        keyExtractor={(item, index) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({index, item}) => <DrawerItem item={item} />}
      />
    </View>
  );
};

CustomDrawer.propTypes = {
  menu: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      icon: PropTypes.any.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    zIndex: 10,
    position: 'absolute',
  },
  //#1b3665
  userInfoContainer: {
    height: moderateVerticalScale(120),
    backgroundColor: '#ffffff',
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 20,
    borderBottomColor: AppColors.PRIMARY,
    borderBottomWidth: 1,
    marginRight: 10,
  },
  drawerHeader: {
    marginLeft: 15,
  },
  icon: {
    height: moderateVerticalScale(60),
    width: moderateScale(60),
    borderRadius: moderateScale(60 / 2),
    backgroundColor: AppColors.ACCENT,
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    color: '#000000',
  },
  smallText: {
    ...SMALLER_TEXT_STYLE,
    color: '#000000',
  },
});
