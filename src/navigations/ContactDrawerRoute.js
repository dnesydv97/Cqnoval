import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomDrawer} from 'components';
import {ContactDrawerMenu, navScreenNames} from 'constant';
import {useDispatch} from 'react-redux';
import {CompanyScreen, PersonScreen} from 'scenes';
import CompanyDetailTabRoute from './CompanyDetailTabRoute';

const Drawer = createDrawerNavigator();

const ContactDrawerRoute = () => {
  const dispatch = useDispatch();

  return (
    <Drawer.Navigator
      openByDefault={false}
      backBehavior="initialRoute"
      drawerStyle={{width: '70%'}}
      initialRouteName={navScreenNames.NAV_COMPANY_SCREEN}
      drawerContent={(props) => (
        <CustomDrawer menu={ContactDrawerMenu} {...props} />
      )}>
      <Drawer.Screen
        name={navScreenNames.NAV_COMPANY_SCREEN}
        component={CompanyScreen}
      />

      <Drawer.Screen
        name={navScreenNames.NAV_PERSON_SCREEN}
        component={PersonScreen}
      />
    </Drawer.Navigator>
  );
};

export default ContactDrawerRoute;
