import React from 'react';
import {AppColors} from 'styles';
import {navScreenNames} from 'constant';
import {BaseContainer} from 'components';
import {Button} from '@ant-design/react-native';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import {
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  showLoadingToast,
} from 'utils';

const btnKey = {
  BUSINESS: 'BusinessDueDate',
  CALENDAR: 'Calendars',
  GOAL: 'Goal',
  MEETING: 'Meeting',
  TASK: 'Task',
};

const OrganizerScreen = () => {
  const navigation = useNavigation();

  const onPress = (key) => {
    switch (key) {
      case btnKey.BUSINESS:
        navigateToGivenScreen(
          navigation,
          navScreenNames.NAV_BUSINESS_DUE_DATE_SCREEN,
        );
        break;
      case btnKey.CALENDAR:
        navigateToGivenScreen(navigation, navScreenNames.NAV_CALENDARS_SCREEN);
        break;
      case btnKey.GOAL:
        navigateToGivenScreen(navigation, navScreenNames.NAV_GOAL_SCREEN);
        break;
      case btnKey.MEETING:
        navigateToGivenScreen(navigation, navScreenNames.NAV_MEETING_SCREEN);
        break;
      case btnKey.TASK:
        navigateToGivenScreen(navigation, navScreenNames.NAV_TASK_SCREEN);
        break;
      default:
        break;
    }
  };

  const rightMenu = () => (
    <IconOutline
      name="more"
      size={30}
      color={AppColors.SMOKE_WHITE}
      onPress={() => showLoadingToast('Loading...')}
    />
  );

  return (
    <BaseContainer toolbarTitle="Organizer" isDrawer>
      <Button
        style={styles.button}
        type="primary"
        onPress={() => onPress(btnKey.BUSINESS)}>
        Business Due dates
      </Button>
      <Button
        style={styles.button}
        type="primary"
        onPress={() => onPress(btnKey.CALENDAR)}>
        Calendar
      </Button>
      <Button
        style={styles.button}
        type="primary"
        //onPress={() => onPress(btnKey.GOAL)}
      >
        Goals
      </Button>
      <Button
        style={styles.button}
        type="primary"
        //onPress={() => onPress(btnKey.MEETING)}
      >
        Meeting
      </Button>
      <Button
        style={styles.button}
        type="primary"
        //onPress={() => onPress(btnKey.TASK)}
      >
        Task
      </Button>
    </BaseContainer>
  );
};

export default OrganizerScreen;

const styles = StyleSheet.create({
  button: {
    margin: 8,
    padding: 10,
    flex: 1,
  },
});
