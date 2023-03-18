import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {navScreenNames} from 'constant';
import {CompanyDetailScreen, CompanyScreen, PersonScreen} from 'scenes';
import {AppColors} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import {useRoute} from '@react-navigation/native';
import {BaseContainer} from 'components';

const Tab = createMaterialTopTabNavigator();

const CompanyDetailTabRoute = () => {
  const route = useRoute();
  const {companyId, isFavourite} = route?.params;
  return (
    <BaseContainer toolbarTitle="">
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
          name={navScreenNames.NAV_COMPANY_DETAIL_SCREEN}
          children={() => <CompanyDetailScreen />}
          initialParams={{companyId, isFavourite}}
          options={{tabBarLabel: 'Detail'}}
        />
        <Tab.Screen
          name={navScreenNames.NAV_PERSON_SCREEN}
          children={() => <PersonScreen />}
          options={{tabBarLabel: 'Persons'}}
        />
      </Tab.Navigator>
    </BaseContainer>
  );
};

export default CompanyDetailTabRoute;
