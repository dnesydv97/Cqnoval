import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {navScreenNames, screenNames} from 'constant';
import {TenderSummary, TenderCompanies, TenderTasks, TenderDocs} from 'scenes';
import {BaseContainer} from 'components';
import {AppColors, AppDimensions} from 'styles';
import {moderateScale} from 'react-native-size-matters';

const Tab = createMaterialTopTabNavigator();

const TenderTab = () => {
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
                    height: 40,
                    width: 96,
                },
                labelStyle: {
                    height: 22,
                    textTransform: 'capitalize',
                    fontSize: moderateScale(14),
                },
            }}
        >
            <Tab.Screen
                name={navScreenNames.NAV_TENDER_SUMMARY}
                children={() => <TenderSummary/>}
                options={{tabBarLabel: 'Summary'}}
            />
            <Tab.Screen
                name={navScreenNames.NAV_TENDER_TASKS}
                children={() => <TenderTasks/>}
                options={{tabBarLabel: 'Tasks'}}
            />
            <Tab.Screen
                name={navScreenNames.NAV_TENDER_COMPANIES}
                children={() => <TenderCompanies/>}
                options={{tabBarLabel: 'Companies'}}
            />
            <Tab.Screen
                name={navScreenNames.NAV_TENDER_DOCS}
                children={() => <TenderDocs/>}
                options={{tabBarLabel: 'Docs'}}
            />
        </Tab.Navigator>
    );
};

export default TenderTab;