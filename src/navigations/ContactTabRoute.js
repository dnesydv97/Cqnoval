import React, {useState, useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {initialState, navScreenNames, screenNames} from 'constant';
import {CompanyScreen, PersonScreen} from 'scenes';
import {BaseContainer} from 'components';
import {Icons} from 'assets';
import PropTypes from 'prop-types';
import {AppColors, AppDimensions} from 'styles';
import {moderateScale} from 'react-native-size-matters';

const Tab = createMaterialTopTabNavigator();

const ContactTabRoute = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: false,
        showIcon: true,
        activeTintColor: AppColors.ACCENT,
        inactiveTintColor: {
          backgroundColor: AppColors.ACCENT,
        },
        tabStyle: {
          height: moderateScale(40),
        },
        labelStyle: {
          height: moderateScale(22),
          fontWeight: 'bold',
          fontSize: moderateScale(14),
          textTransform: 'capitalize',
        },
      }}>
      <Tab.Screen
        name={navScreenNames.NAV_COMPANY_SCREEN}
        children={() => <CompanyScreen />}
        options={{tabBarLabel: 'Company'}}
      />
      <Tab.Screen
        name={navScreenNames.NAV_PERSON_SCREEN}
        children={() => <PersonScreen />}
        initialParams={{companyName: null}}
        options={{tabBarLabel: 'Person'}}
      />
    </Tab.Navigator>
  );
};

export default ContactTabRoute;
