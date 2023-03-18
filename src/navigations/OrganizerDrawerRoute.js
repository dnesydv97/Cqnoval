import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomDrawer} from 'components';
import {navScreenNames, organizerDrawer} from 'constant';
import {useDispatch} from 'react-redux';
import {
  BusinessDueDateScreen,
  CalendarScreen,
  GoalScreen,
  GuestScreen,
  MeetingScreen,
  TaskScreen,
} from 'scenes';

const Drawer = createDrawerNavigator();

const OrganizerDrawerRoute = () => {
  const dispatch = useDispatch();

  return (
    <Drawer.Navigator
      openByDefault={false}
      backBehavior="initialRoute"
      drawerStyle={{width: '70%'}}
      initialRouteName={navScreenNames.NAV_CALENDAR_SCREEN}
      drawerContent={(props) => (
        <CustomDrawer menu={organizerDrawer} {...props} />
      )}>
      <Drawer.Screen
        name={navScreenNames.NAV_BUSINESS_DUE_DATE_SCREEN}
        component={BusinessDueDateScreen}
      />
      <Drawer.Screen
        name={navScreenNames.NAV_GOAL_SCREEN}
        component={GoalScreen}
      />
      <Drawer.Screen
        name={navScreenNames.NAV_GUEST_SCREEN}
        component={GuestScreen}
      />
      <Drawer.Screen
        name={navScreenNames.NAV_MEETING_SCREEN}
        component={MeetingScreen}
      />
      <Drawer.Screen
        name={navScreenNames.NAV_TASK_SCREEN}
        component={TaskScreen}
      />
      <Drawer.Screen
        name={navScreenNames.NAV_CALENDAR_SCREEN}
        component={CalendarScreen}
      />
    </Drawer.Navigator>
  );
};

export default OrganizerDrawerRoute;
