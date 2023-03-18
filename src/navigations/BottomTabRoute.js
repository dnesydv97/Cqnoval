import React, {useState} from 'react';
import {StyleSheet, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {navScreenNames} from 'constant';
import {
  ContactScreen,
  DashboardScreen,
  ProfileScreen,
  ReferenceScreen,
} from 'scenes';
import {moderateScale} from 'react-native-size-matters';
import {CustomTabBar, MoreTabBarItem} from 'components';
import MailRoute from './MailDrawerRoute';
import OrganizerRoute from './OrganizerDrawerRoute';
import ContactDrawerRoute from './ContactDrawerRoute';
import HRDrawerRoute from './HRDrawerRoute';
import {AppColors, AppDimensions} from 'styles';
import {useRoute} from '@react-navigation/native';
import {Icons} from 'assets';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {fetchMyProfile} from 'services/redux/profile/action';

const Tab = createBottomTabNavigator();

const BottomTabRoute = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const {isDrawerOpen} = route?.params;

  const [moreModalVisibility, setMoreModalVisibility] = useState(false);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="history"
      tabBarOptions={{
        showLabel: false,
        activeBackgroundColor: 'white',
        style: {
          backgroundColor: 'white',
        }
      }}
      tabBar
      tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          //tabBarLabel: 'Dashboard',
          tabBarIcon: (focused, color, size) => (
            <Image
              source={Icons.iconHome}
              style={{
                ...styles.iconStyle,
                tintColor: focused ? AppColors.PRIMARY_DARK : '#AFAFAF',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="MailBox"
        children={MailRoute}
        options={{
          tabBarVisible: !isDrawerOpen,
          tabBarIcon: (focused, color, size) => (
            <Image
              source={Icons.iconChatMessage}
              style={{
                ...styles.iconStyle,
                tintColor: focused ? AppColors.PRIMARY_DARK : '#AFAFAF',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      {console.log("Bottom Tab Route Loaded")}
      <Tab.Screen
        name="Business"
        component={ReferenceScreen}
        options={{
          tabBarVisible: !isDrawerOpen,
          tabBarIcon: (focused, color, size) => (
            <Image
              source={Icons.iconBusiness}
              style={{
                ...styles.iconStyle,
                tintColor: focused ? AppColors.PRIMARY_DARK : '#AFAFAF',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Organizer"
        component={OrganizerRoute}
        options={{
          tabBarVisible: !isDrawerOpen,
          tabBarIcon: (focused, color, size) => (
            <Image
              source={Icons.iconCalendar}
              style={{
                ...styles.iconStyle,
                tintColor: focused ? AppColors.PRIMARY_DARK : '#AFAFAF',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name={navScreenNames.NAV_PROFILE_SCREEN}
        component={ProfileScreen}
        initialParams={{userId: null}}
        options={{
          iconVisibility: false,
        }}
      />
      <Tab.Screen
        name={navScreenNames.NAV_HR_DRAWER_TAB_ROUTE}
        component={HRDrawerRoute}
        initialParams={{userId: null}}
        options={{
          iconVisibility: false,
        }}
      />
      {/* <Tab.Screen
        name={navScreenNames.NAV_CONTACT_ROUTE}
        component={ContactDrawerRoute}
        initialParams={{userId: null}}
        options={{
          iconVisibility: false,
        }}
      /> */}

      <Tab.Screen
        name={navScreenNames.NAV_CONTACT_SCREEN}
        component={ContactScreen}
        options={{
          iconVisibility: false,
        }}
      />

      <Tab.Screen
        name={'MoreButtonOption'}
        children={() => null}
        options={{
          tabBarVisible: !isDrawerOpen,
          tabBarButton: (navigation) => (
            <MoreTabBarItem
              navigation={navigation}
              modalVisibility={moreModalVisibility}
              onDismiss={setMoreModalVisibility}
            />
          ),
          tabBarLabel: 'More',
          onMoreClick: setMoreModalVisibility,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabRoute;

const styles = StyleSheet.create({
  iconStyle: {
    padding: AppDimensions.SMALLEST,
    height: moderateScale(25),
    width: moderateScale(25),
  },
});
