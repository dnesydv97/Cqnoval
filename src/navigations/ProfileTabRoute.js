import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {navScreenNames, screenNames} from 'constant';
import {
  BasicInfoScreen,
  DocumentScreen,
  FirstPointContactScreen,
  OfficialInfoScreen,
} from 'scenes';
import {BaseContainer} from 'components';
import {Icons} from 'assets';
import {AppColors, SMALLEST_TEXT_STYLE} from 'styles';
import {moderateScale} from 'react-native-size-matters';

const Tab = createMaterialTopTabNavigator();

const ProfileTabs = ({userDetail, docData}) => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: true,
        showIcon: true,
        activeTintColor: AppColors.ACCENT,
        indicatorStyle: {
          backgroundColor: AppColors.ACCENT,
        },
        tabStyle: {
          height: moderateScale(40),
        },
        labelStyle: {
          height: moderateScale(22),
        },
      }}>
      <Tab.Screen
        name={navScreenNames.NAV_PROFILE_OFFICIAL_INFO_SCREEN}
        children={() => <OfficialInfoScreen userDetail={userDetail} />}
        options={{tabBarLabel: screenNames.PROFILE_OFFICIAL_INFO_SCREEN}}
      />
      <Tab.Screen
        name={navScreenNames.NAV_PROFILE_FIRST_POINT_SCREEN}
        children={() => <FirstPointContactScreen userDetail={userDetail} />}
        options={{tabBarLabel: screenNames.PROFILE_FIRST_POINT_SCREEN}}
      />
      <Tab.Screen
        name={navScreenNames.NAV_DOCUMENT_TAB_SCREEN}
        children={() => (
          <DocumentScreen userDetail={userDetail} docData={docData} />
        )}
        options={{tabBarLabel: screenNames.PROFILE_DOCUMENTS_SCREEN}}
      />
    </Tab.Navigator>
  );
};

export default ProfileTabs;
