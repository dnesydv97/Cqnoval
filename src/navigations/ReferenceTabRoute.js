import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {navScreenNames, screenNames} from 'constant';
import {ProjectScreen, ContractScreen, TenderScreen, OtherScreen} from 'scenes';
import {BaseContainer} from 'components';
import {Icons} from 'assets';
import {AppColors, AppDimensions} from 'styles';
import {moderateScale} from 'react-native-size-matters';

const Tab = createMaterialTopTabNavigator();

const ReferenceTabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: false,
        showIcon: true,
        activeTintColor: AppColors.ACCENT,
        indicatorStyle: {
          backgroundColor: AppColors.ACCENT,
        },
        tabStyle: {
          height: moderateScale(40),
          width: moderateScale(125),
        },
        labelStyle: {
          height: moderateScale(22),
          fontWeight: 'bold',
          textTransform: 'capitalize',
          fontSize: moderateScale(14),
        },
      }}>
      <Tab.Screen
        name={navScreenNames.NAV_TENDER_SCREEN}
        children={() => <TenderScreen />}
        options={{tabBarLabel: 'Tender'}}
      />
      <Tab.Screen
        name={navScreenNames.NAV_PROJECT_SCREEN}
        children={() => <ProjectScreen />}
        options={{tabBarLabel: 'Project'}}
      />
      {/* <Tab.Screen
        name={navScreenNames.NAV_CONTRACT_SCREEN}
        children={() => <ContractScreen />}
        options={{tabBarLabel: 'Contract'}}
      /> */}
      <Tab.Screen
        name={navScreenNames.NAV_OTHER_SCREEN}
        children={() => <OtherScreen />}
        options={{tabBarLabel: 'Others'}}
      />
    </Tab.Navigator>
  );
};

export default ReferenceTabs;
