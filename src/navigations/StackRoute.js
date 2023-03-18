import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  LoginScreen,
  PDFViewerScreen,
  ChangePasswordScreen,
  SplashScreen,
  OrganizerScreen,
  CompanyDetailScreen,
  HolidayScreen,
  AddHolidayScreen,
  AddGoalsScreen,
  AddGuestScreen,
  AddAppointmentScreen,
  AddTodoScreen,
  AddMeetingScreen,
  AgendaMinuteScreen,
  EmailDetailScreen,
  ImageViewerScreen,
  ContractScreen,
  ProjectScreen,
  TenderScreen,
  ContactScreen,
  ReferenceScreen,
  OtherScreen,
  ProjectDetailScreen,
  TenderDetailScreen,
  TenderSummary,
  TenderCompanies,
  TenderTasks,
  TenderDocs,
  RefCompanyScreen,
  RefFeesScreen,
  RefReportScreen,
  RefTaskScreen,
  TenderExtensions,
  LeaveScreen,
  LoanScreen,
  CompanyPersons,
} from 'scenes';
import {navScreenNames, screenNames} from 'constant';
import BottomTabRoute from './BottomTabRoute';
import PersonDetailScreen from 'scenes/contact/person/PersonDetailScreen';
import CompanyDetailTabRoute from './CompanyDetailTabRoute';

const Stack = createStackNavigator();

const StackRoute = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={navScreenNames.NAV_SPLASH_SCREEN}
        screenOptions={{
          headerShown: false,
          gestureDirection: 'horizontal',
        }}>
        <Stack.Screen
          name={navScreenNames.NAV_SPLASH_SCREEN}
          component={SplashScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_BOTTOM_TAB_ROUTE}
          component={BottomTabRoute}
          initialParams={{isDrawerOpen: false}}
        />
        <Stack.Screen
          name={navScreenNames.NAV_LOGIN_SCREEN}
          component={LoginScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_PDF_VIEWER_SCREEN}
          component={PDFViewerScreen}
          initialParams={{url: null}}
        />
        <Stack.Screen
          name={navScreenNames.NAV_IMAGE_VIEWER_SCREEN}
          component={ImageViewerScreen}
          initialParams={{url: null}}
        />
        <Stack.Screen
          name={navScreenNames.NAV_CHANGE_PASSWORD_SCREEN}
          component={ChangePasswordScreen}
        />

        <Stack.Screen
          name={navScreenNames.NAV_ORGANIZER_SCREEN}
          component={OrganizerScreen}
        />

        <Stack.Screen
          name={navScreenNames.NAV_PERSON_DETAIL_SCREEN}
          initialParams={{personId: null}}
          component={PersonDetailScreen}
        />

        <Stack.Screen
          name={navScreenNames.NAV_COMPANY_DETAIL_SCREEN}
          initialParams={{companyId: null, isFavourite: false}}
          component={CompanyDetailScreen}
        />

        <Stack.Screen
          name={navScreenNames.NAV_COMPANY_PERSONS_SCREEN}
          initialParams={{companyId: null, isFavourite: false}}
          component={CompanyPersons}
        />

        {/* <Stack.Screen
          name={navScreenNames.NAV_COMPANY_DETAIL_TAB_ROUTE}
          initialParams={{companyId: null, isFavourite: false}}
          component={CompanyDetailTabRoute}
        /> */}
        <Stack.Screen
          name={navScreenNames.NAV_TENDER_EXTENSION}
          component={TenderExtensions}
        />

        <Stack.Screen
          name={navScreenNames.NAV_ADD_HOLIDAY_SCREEN}
          initialParams={{
            holidayId: null,
            minDate: null,
            maxDate: null,
          }}
          component={AddHolidayScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_ADD_GOALS_SCREEN}
          initialParams={{
            goalId: null,
          }}
          component={AddGoalsScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_ADD_GUEST_SCREEN}
          initialParams={{
            guestId: null,
          }}
          component={AddGuestScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_ADD_APPOINTMENT_SCREEN}
          initialParams={{
            appointmentId: null,
          }}
          component={AddAppointmentScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_ADD_TODO_SCREEN}
          initialParams={{
            todoId: null,
          }}
          component={AddTodoScreen}
        />
        {/* <Stack.Screen
          name={navScreenNames.NAV_CONTACT_SCREEN}
          component={ContactScreen}
        /> */}
        <Stack.Screen
          name={navScreenNames.NAV_ADD_MEETING_SCREEN}
          initialParams={{
            meetingId: null,
          }}
          component={AddMeetingScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_AGENDA_MINUTE_SCREEN}
          initialParams={{
            meetingId: null,
          }}
          component={AgendaMinuteScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_CONTRACT_SCREEN}
          initialParams={{
            contractId: null,
          }}
          component={ContractScreen}
        />

        <Stack.Screen
          name={navScreenNames.NAV_REFERENCE_SCREEN}
          initialParams={{
            referenceId: null,
          }}
          component={ReferenceScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_OTHER_SCREEN}
          initialParams={{
            referenceOthersId: null,
          }}
          component={OtherScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_EMAIL_DETAIL_SCREEN}
          initialParams={{
            messageDetail: null,
          }}
          component={EmailDetailScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_PROJECT_DETAIL_SCREEN}
          initialParams={{
            projectId: null,
          }}
          component={ProjectDetailScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_TENDER_DETAIL_SCREEN}
          initialParams={{
            tenderId: 'null',
          }}
          component={TenderDetailScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_REFERENCE_COMPANY_SCREEN}
          component={RefCompanyScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_REFERENCE_FEES_SCREEN}
          component={RefFeesScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_REFERENCE_REPORT_SCREEN}
          component={RefReportScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_REFERENCE_TASK_SCREEN}
          component={RefTaskScreen}
        />
        <Stack.Screen
          name={navScreenNames.NAV_TENDER_EXTENSION}
          component={TenderExtensions}
          name={navScreenNames.NAV_LEAVE_SCREEN}
          component={LeaveScreen}
          options={{
            title: screenNames.LEAVE_SCREEN,
          }}
        />
        <Stack.Screen
          name={navScreenNames.NAV_LOAN_SCREEN}
          component={LoanScreen}
          options={{
            title: screenNames.LOAN_SCREEN,
          }}
        />
        <Stack.Screen
          name={navScreenNames.NAV_TENDER_SUMMARY}
          component={TenderSummary}
          initialParams={{
            tenderId: 'null',
          }}
          // options={{
          //   title: screenNames.TENDER_SUMMARY,
          // }}
        />
        <Stack.Screen
          name={navScreenNames.NAV_TENDER_COMPANIES}
          component={TenderCompanies}
          options={{
            title: screenNames.TENDER_COMPANIES,
          }}
        />
        <Stack.Screen
          name={navScreenNames.NAV_TENDER_TASKS}
          component={TenderTasks}
          options={{
            title: screenNames.TENDER_TASKS,
          }}
        />
        <Stack.Screen
          name={navScreenNames.NAV_TENDER_DOCS}
          component={TenderDocs}
          options={{
            title: screenNames.TENDER_DOCS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackRoute;
