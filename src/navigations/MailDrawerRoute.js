import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomDrawer} from 'components';
import {mailDrawer, navScreenNames} from 'constant';
import {useDispatch} from 'react-redux';
import {
  MailComposeScreen,
  InboxScreen,
  OutBoxScreen,
  SentScreen,
  InternalMessageScreen,
} from 'scenes';
import {useNavigation} from '@react-navigation/core';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

const Drawer = createDrawerNavigator();

const MailDrawerRoute = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      openByDefault={false}
      backBehavior="initialRoute"
      drawerStyle={{width: '70%'}}
      initialRouteName={navScreenNames.NAV_INBOX_SCREEN}
      drawerContent={(props) => <CustomDrawer menu={mailDrawer} {...props} />}>
      <Drawer.Screen
        name={navScreenNames.NAV_INBOX_SCREEN}
        component={InboxScreen}
        initialParams={{reloadData: false, filter: 'All', mainFilter: 'Inbox'}}
      />
      <Drawer.Screen
        name={navScreenNames.NAV_MAIL_COMPOSE_SCREEN}
        component={MailComposeScreen}
        initialParams={{
          emailDetail: null,
          action: 'new',
        }}
      />
      <Drawer.Screen
        name={navScreenNames.NAV_COMPOSE_INTERNAL_SCREEN}
        component={InternalMessageScreen}
      />
      <Drawer.Screen
        name={navScreenNames.NAV_OUTBOX_SCREEN}
        component={OutBoxScreen}
      />
      <Drawer.Screen
        name={navScreenNames.NAV_SENT_SCREEN}
        component={SentScreen}
      />
    </Drawer.Navigator>
  );
};

export default MailDrawerRoute;
