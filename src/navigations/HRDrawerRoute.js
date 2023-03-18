import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomDrawer} from 'components';
import {ContactDrawerMenu, hrDrawerMenu, navScreenNames} from 'constant';
import {useDispatch} from 'react-redux';
import {
  CompanyScreen,
  HolidayScreen,
  LeaveListScreen,
  LoanListScreen,
  PersonScreen,
} from 'scenes';

const Drawer = createDrawerNavigator();

const HRDrawerRoute = () => {
  const dispatch = useDispatch();

  return (
    <Drawer.Navigator
      openByDefault={false}
      backBehavior="initialRoute"
      drawerStyle={{width: '70%'}}
      initialRouteName={navScreenNames.NAV_HOLIDAY_SCREEN}
      drawerContent={(props) => (
        <CustomDrawer menu={hrDrawerMenu} {...props} />
      )}>
      <Drawer.Screen
        name={navScreenNames.NAV_HOLIDAY_SCREEN}
        component={HolidayScreen}
      />
      <Drawer.Screen
        name={navScreenNames.NAV_LEAVE_LIST_SCREEN}
        component={LeaveListScreen}
      />
      <Drawer.Screen
        name={navScreenNames.NAV_LOAN_LIST_SCREEN}
        component={LoanListScreen}
      />
    </Drawer.Navigator>
  );
};

export default HRDrawerRoute;
