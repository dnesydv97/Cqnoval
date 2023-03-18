import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {navScreenNames, screenNames} from 'constant';
import {
    ProjectDetailScreen,
    RefCompanyScreen,
    RefFeesScreen,
    RefReportScreen,
    RefTaskScreen,
} from 'scenes';
import {BaseContainer} from 'components';
import {Icons} from 'assets';
import {AppColors, AppDimensions} from 'styles';

const Tab = createMaterialTopTabNavigator();

const ReferenceDetailTabRoute = () => {
    return(
        <Tab.Navigator
        tabBarOptions={{
            scrollEnabled: true,
            showIcon: true,
            activeTintColor: AppColors.ACCENT,
            indicatorStyle: {
                backgroundColor: AppColors.ACCENT,
            },
        }}>
            
            <Tab.Screen
                name={navScreenNames.NAV_REFERENCE_COMPANY_SCREEN}
                children={() => <RefCompanyScreen/>}
                options={{tabBarLabel: "Company"}}
            />
            <Tab.Screen
                name={navScreenNames.NAV_REFERENCE_FEES_SCREEN}
                children={() => <RefFeesScreen/>}
                options={{tabBarLabel: "Fees"}}
            />
            <Tab.Screen
                name={navScreenNames.NAV_REFERENCE_REPORT_SCREEN}
                children={() => <RefReportScreen/>}
                options={{tabBarLabel: "Report"}}
            />
            <Tab.Screen
                name={navScreenNames.NAV_REFERENCE_TASK_SCREEN}
                children={() => <RefTaskScreen/>}
                options={{tabBarLabel: "Task"}}
            /> 
        </Tab.Navigator>
    );
};

export default ReferenceDetailTabRoute;