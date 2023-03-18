import {IconOutline} from '@ant-design/icons-react-native';
import SegementedControlTab from 'react-native-segmented-control-tab';
import {Checkbox} from '@ant-design/react-native';
import {BaseCard, BaseContainer, BaseModal} from 'components';
import {navScreenNames, screenNames} from 'constant';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {LocaleConfig, Calendar} from 'react-native-calendars';
import {AppColors, AppDimensions, HEADING_TEXT_SIZE} from 'styles';
import DayView from './DayView';
import CalendarTabRoute from 'navigations/CalendarTabRoute';
import {
  dateFormats,
  getCurrentMonthStartAndEndDate,
  getDateOnRequiredFormat,
  navigateToGivenScreen,
  onError,
} from 'utils';
import {getCalendarEvents} from 'services';
import _, {filter} from 'lodash';
import {Animated, Text} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {Icons} from 'assets';
import {useNavigation} from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const actions = [
  {
    text: 'To do',
    icon: Icons.iconTodo,
    name: 'fab_todo',
    position: 1,
  },
  {
    text: 'Goals',
    icon: Icons.iconGoal,
    name: 'fab_goal',
    position: 2,
  },
  {
    text: 'Appointment',
    icon: Icons.iconAppointment,
    name: 'fab_appointment',
    position: 3,
  },
  {
    text: 'Calls',
    icon: Icons.iconCall,
    name: 'fab_calls',
    position: 4,
  },
];

const CalendarScreen = () => {
  const navigation = useNavigation();

  const [markedDates, setMarkedDates] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({
    Personal: [],
    Business: [],
    Public: [],
  });
  const [selectedDate, setSelectedDate] = useState();
  const [isAD, setAD] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    startDate: getDateOnRequiredFormat(),
    endDate: getDateOnRequiredFormat(),
    EventTypeSystemNames: [],
  });

  useEffect(() => {
    onMonthChanged();
  }, []);

  useEffect(() => {
    if (isAD) {
      LocaleConfig.locales['fr'] = {
        monthNames: [
          'Janvier',
          'Février',
          'Mars',
          'Avril',
          'Mai',
          'Juin',
          'Juillet',
          'Août',
          'Septembre',
          'Octobre',
          'Novembre',
          'Décembre',
        ],
        monthNamesShort: [
          'Janv.',
          'Févr.',
          'Mars',
          'Avril',
          'Mai',
          'Juin',
          'Juil.',
          'Août',
          'Sept.',
          'Oct.',
          'Nov.',
          'Déc.',
        ],
        dayNames: [
          'Dimanche',
          'Lundi',
          'Mardi',
          'Mercredi',
          'Jeudi',
          'Vendredi',
          'Samedi',
        ],
        dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
        today: "Aujourd'hui",
      };
      // LocaleConfig.defaultLocale = 'fr';
    } else {
      LocaleConfig.defaultLocale = 'en';
    }
  }, [isAD]);

  useEffect(() => {
    console.log('All Events cahnged ', allEvents);
  }, [allEvents]);

  useEffect(() => {
    filterOptions.startDate !== filterOptions.endDate && obtainEvents();
  }, [filterOptions]);

  function obtainEvents() {
    setLoading(true);
    getCalendarEvents(
      filterOptions.startDate,
      filterOptions.endDate,
      filterOptions.EventTypeSystemNames,
    )
      .then((response) => {
        setLoading(false);
        console.log('Calendar Events response ', response);
        if (response.status === 200) {
          const newData = response.data.map((item) => {
            return {
              ...item,
              start: item.start.split(' ')[0],
              startTime: item.start.includes(' ')
                ? item.start.split(' ')[1]
                : '',
              key: item.id,
              color: item.backgroundColor || item.textColor,
            };
          });
          setAllEvents(newData);

          const groupedObj = _.groupBy(newData, 'start');
          const newGroupedObj = {};
          Object.keys(groupedObj).map((key) => {
            newGroupedObj[key] = {dots: groupedObj[key]};
          });

          setMarkedDates(newGroupedObj);

          const groupedEventsByType = _.groupBy(
            newData,
            'parentEventTypeSystemName',
          );

          // setTimeout(() => {
          // }, 10000);

          console.log('Calendar Events ', newGroupedObj, groupedEventsByType);

          setGroupedEvents({
            Personal: groupedEventsByType.Personal || [],
            Business: groupedEventsByType.Business || [],
            Public: groupedEventsByType.Public || [],
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  function onDayClick(date, state, marking) {
    // console.log('ONday clicked ', allEvents);

    setSelectedDate(date.dateString);

    const filteredData = allEvents.filter(
      (item) => item.start == date.dateString,
    );

    const groupedTypeEvents = _.groupBy(
      filteredData,
      'parentEventTypeSystemName',
    );

    console.log('Filtered Changed new list ', filteredData);

    setGroupedEvents({
      Personal: groupedTypeEvents.Personal || [],
      Business: groupedTypeEvents.Business || [],
      Public: groupedTypeEvents.Public || [],
    });

    setMarkedDates({
      ...markedDates,
    });
  }

  function onMonthChanged(date) {
    const cmdRange = getCurrentMonthStartAndEndDate(date);
    // console.log('Month changed first and last day ', cmdRange);
    setFilterOptions({
      ...filterOptions,
      startDate: cmdRange.firstDay,
      endDate: cmdRange.lastDay,
    });
  }

  function onFilterOptionChecked(type, checked) {
    if (checked) {
      if (type === 'Personal')
        filterOptions.EventTypeSystemNames.push(
          ...[
            'Personal_Appointment',
            'Personal_Goal',
            'Personal_Call',
            'Personal_Todo_AssignToMe',
            'Personal_Todo_AssignToOther',
          ],
        );
      else if (type === 'Personal_Todo')
        filterOptions.EventTypeSystemNames.push(
          ...['Personal_Todo_AssignToMe', 'Personal_Todo_AssignToOther'],
        );
      else if (type === 'Business')
        filterOptions.EventTypeSystemNames.push(
          ...['Business_DueDate', 'Business_Validities', 'Business_Meetings'],
        );
      else if (type === 'Public')
        filterOptions.EventTypeSystemNames.push(
          ...['Public_Holiday', 'Public_Guest'],
        );
      else filterOptions.EventTypeSystemNames.push(type);

      setFilterOptions({
        ...filterOptions,
      });
    } else {
      let newArray = [];
      if (type === 'Personal') {
        newArray = filterOptions.EventTypeSystemNames.filter(
          (item) =>
            item !== 'Personal_Appointment' &&
            item !== 'Personal_Goal' &&
            item !== 'Personal_Call' &&
            item !== 'Personal_Todo_AssignToMe' &&
            item !== 'Personal_Todo_AssignToOther',
        );
      } else if (type === 'Personal_Todo')
        newArray = filterOptions.EventTypeSystemNames.filter(
          (item) =>
            item !== 'Personal_Todo_AssignToMe' &&
            item !== 'Personal_Todo_AssignToOther',
        );
      else if (type === 'Business')
        newArray = filterOptions.EventTypeSystemNames.filter(
          (item) =>
            item !== 'Business_DueDate' &&
            item !== 'Business_Validities' &&
            item !== 'Business_Meetings',
        );
      else if (type === 'Public')
        newArray = filterOptions.EventTypeSystemNames.filter(
          (item) => item !== 'Public_Holiday' && item !== 'Public_Guest',
        );
      else {
        newArray = filterOptions.EventTypeSystemNames.filter(
          (item) => item !== type,
        );
      }

      setFilterOptions({
        ...filterOptions,
        EventTypeSystemNames: newArray,
      });
    }
  }

  function getChecked(type) {
    if (type === 'Personal') {
      return (
        filterOptions.EventTypeSystemNames.includes('Personal_Appointment') &&
        filterOptions.EventTypeSystemNames.includes('Personal_Goal') &&
        filterOptions.EventTypeSystemNames.includes('Personal_Call') &&
        filterOptions.EventTypeSystemNames.includes(
          'Personal_Todo_AssignToMe',
        ) &&
        filterOptions.EventTypeSystemNames.includes(
          'Personal_Todo_AssignToOther',
        )
      );
    } else if (type === 'Personal_Todo') {
      return (
        filterOptions.EventTypeSystemNames.includes(
          'Personal_Todo_AssignToMe',
        ) &&
        filterOptions.EventTypeSystemNames.includes(
          'Personal_Todo_AssignToOther',
        )
      );
    } else if (type === 'Business') {
      return (
        filterOptions.EventTypeSystemNames.includes('Business_DueDate') &&
        filterOptions.EventTypeSystemNames.includes('Business_Meetings') &&
        filterOptions.EventTypeSystemNames.includes('Business_Validities')
      );
    } else if (type === 'Public') {
      return (
        filterOptions.EventTypeSystemNames.includes('Public_Holiday') &&
        filterOptions.EventTypeSystemNames.includes('Public_Guest')
      );
    } else return filterOptions.EventTypeSystemNames.includes(type);
  }

  const RightView = () => (
    <IconOutline
      name="control"
      size={30}
      color={AppColors.PRIMARY_DARK}
      onPress={() => {
        setShowFilter(!showFilter);
      }}
    />
  );

  const entryAnimation = (value) =>
    Animated.timing(value, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    });

  const exitAnimation = (value) =>
    Animated.timing(value, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    });

  function onFabItemClick(name) {
    console.log(`Fab item selected button: ${name}`);
    let screen = null;
    if (name === 'fab_todo') screen = navScreenNames.NAV_ADD_TODO_SCREEN;
    else if (name === 'fab_goal') screen = navScreenNames.NAV_ADD_GOALS_SCREEN;
    else if (name === 'fab_appointment')
      screen = navScreenNames.NAV_ADD_APPOINTMENT_SCREEN;

    screen && navigateToGivenScreen(navigation, screen);
  }

  return (
    <BaseContainer
      toolbarTitle={screenNames.CALENDAR_SCREEN}
      isDrawer
      showToolbarRightIcon
      scrollable
      fab={{
        visibility: true,
        fabActions: actions,
        onFabItemClick,
        fabColor: AppColors.BTN_RED,
      }}
      loading={loading}
      toolbarRightIcon={RightView}>
      {/* <View style={{flex: 1, flexDirection: 'row', marginHorizontal: AppDimensions.NORMAL, marginVertical: AppDimensions.NORMAL, alignSelf: 'center'}}>
        <TouchableOpacity>
        <View style={{backgroundColor: 'white', borderColor:'grey', borderWidth: 1, borderRadius: moderateScale(5)}}>
          <Text style={{backgroundColor: 'white', marginHorizontal: AppDimensions.NORMAL}}>Days</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
        <View style={{backgroundColor: 'white', borderColor: 'grey', borderWidth: 1, borderRadius: moderateScale(5)}}>
          <Text style={{backgroundColor: 'white', marginHorizontal: AppDimensions.NORMAL}}>Weeks</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
        <View style={{backgroundColor: 'white', borderColor: 'grey', borderWidth: 1, borderRadius: moderateScale(5)}}>
          <Text style={{backgroundColor: 'white', marginHorizontal: AppDimensions.NORMAL}}>Months</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
        <View style={{backgroundColor: 'white', borderColor: 'grey', borderWidth: 1, borderRadius: moderateScale(5)}}>
          <Text style={{backgroundColor: 'white', marginHorizontal: AppDimensions.NORMAL}}>Year</Text>
        </View>
        </TouchableOpacity>
      </View> */}
      <View>
        <SegementedControlTab
          values={['Day', 'Week', 'Month', 'Year']}
          selectedIndex={2}
        />
      </View>
      <Calendar
        style={styles.calendarStyle}
        markedDates={markedDates}
        markingType={'multi-dot'}
        onMonthChange={(month) => {
          onMonthChanged(month.dateString);
        }}
        enableSwipeMonths={true}
        dayComponent={({date, state, marking}) => {
          return (
            <DayView
              date={date}
              state={state}
              marking={marking}
              onDayClick={onDayClick}
              selectedDate={selectedDate}
            />
          );
        }}
        theme={{
          'stylesheet.calendar.header': {
            dayTextAtIndex0: {
              color: 'red',
            },
            dayTextAtIndex6: {
              color: 'blue',
            },
          },
        }}
      />
      <BaseCard
        containerStyle={{
          marginTop: AppDimensions.NORMAL,
          flex: 1,
        }}>
        <CalendarTabRoute
          startDate={filterOptions.startDate}
          endDate={filterOptions.endDate}
          events={groupedEvents}
        />
      </BaseCard>
      {showFilter && (
        <BaseModal
          visibility={showFilter}
          collapsable
          hasCrossIcon={false}
          hasDropDownIcon={false}
          title="Filter Your Preference"
          hideOnEmptyAreaClicked
          animationType="fade"
          containerStyle={styles.modalContainerStyle}
          modalStyle={styles.modalStyle}
          entryAnimation={entryAnimation}
          exitAnimation={exitAnimation}
          animationInitialValue={200}
          onDismiss={() => setShowFilter(false)}
          verticleAnimation={false}>
          <View>
            <View style={styles.filterContainer}>
              {/* <Text style={styles.title}>Choose your Preferences</Text> */}
              <View
                style={{
                  paddingHorizontal: AppDimensions.NORMAL,
                  paddingVertical: AppDimensions.SMALL,
                }}>
                <Checkbox
                  checked={getChecked('Personal')}
                  onChange={(e) =>
                    onFilterOptionChecked('Personal', e.target.checked)
                  }>
                  Personal
                </Checkbox>
                {/* <View style={{marginStart: AppDimensions.LARGE}}>
                  <Checkbox
                    checked={getChecked('Personal_Call')}
                    onChange={(e) =>
                      onFilterOptionChecked('Personal_Call', e.target.checked)
                    }>
                    Call
                  </Checkbox>
                  <Checkbox
                    checked={getChecked('Personal_Appointment')}
                    onChange={(e) =>
                      onFilterOptionChecked(
                        'Personal_Appointment',
                        e.target.checked,
                      )
                    }>
                    Appointment
                  </Checkbox>
                  <Checkbox
                    checked={getChecked('Personal_Goal')}
                    onChange={(e) =>
                      onFilterOptionChecked('Personal_Goal', e.target.checked)
                    }>
                    Goal
                  </Checkbox>
                  <Checkbox
                    checked={getChecked('Personal_Todo')}
                    onChange={(e) =>
                      onFilterOptionChecked('Personal_Todo', e.target.checked)
                    }>
                    Todo
                  </Checkbox>
                  <View style={{marginStart: AppDimensions.LARGE}}>
                    <Checkbox
                      checked={getChecked('Personal_Todo_AssignToMe')}
                      onChange={(e) =>
                        onFilterOptionChecked(
                          'Personal_Todo_AssignToMe',
                          e.target.checked,
                        )
                      }>
                      Assign to Me
                    </Checkbox>
                    <Checkbox
                      checked={getChecked('Personal_Todo_AssignToOther')}
                      onChange={(e) =>
                        onFilterOptionChecked(
                          'Personal_Todo_AssignToOther',
                          e.target.checked,
                        )
                      }>
                      Assign to Others
                    </Checkbox>
                  </View>
                </View> */}

                <Checkbox
                  checked={getChecked('Business')}
                  onChange={(e) =>
                    onFilterOptionChecked('Business', e.target.checked)
                  }>
                  Business
                </Checkbox>
                {/* <View style={{marginStart: AppDimensions.LARGE}}>
                  <Checkbox
                    checked={getChecked('Business_DueDate')}
                    onChange={(e) =>
                      onFilterOptionChecked(
                        'Business_DueDate',
                        e.target.checked,
                      )
                    }>
                    Due Dates
                  </Checkbox>
                  <Checkbox
                    checked={getChecked('Business_Validities')}
                    onChange={(e) =>
                      onFilterOptionChecked(
                        'Business_Validities',
                        e.target.checked,
                      )
                    }>
                    Validities
                  </Checkbox>
                  <Checkbox
                    checked={getChecked('Business_Meetings')}
                    onChange={(e) =>
                      onFilterOptionChecked(
                        'Business_Meetings',
                        e.target.checked,
                      )
                    }>
                    Meetings
                  </Checkbox>
                </View> */}

                <Checkbox
                  checked={getChecked('Public')}
                  onChange={(e) =>
                    onFilterOptionChecked('Public', e.target.checked)
                  }>
                  Public
                </Checkbox>
                {/* <View style={{marginStart: AppDimensions.LARGE}}>
                  <Checkbox
                    checked={getChecked('Public_Holiday')}
                    onChange={(e) =>
                      onFilterOptionChecked('Public_Holiday', e.target.checked)
                    }>
                    Holiday
                  </Checkbox>
                  <Checkbox
                    checked={getChecked('Public_Guest')}
                    onChange={(e) =>
                      onFilterOptionChecked('Public_Guest', e.target.checked)
                    }>
                    Guest
                  </Checkbox>
                </View> */}
              </View>
            </View>
          </View>
        </BaseModal>
      )}
    </BaseContainer>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  calendarStyle: {},
  filterContainer: {
    height: '100%',
    width: '100%',
    alignSelf: 'flex-end',
    // backgroundColor: 'white',
  },
  title: {
    ...HEADING_TEXT_SIZE,
    backgroundColor: AppColors.ITEM_BG,
    paddingVertical: AppDimensions.NORMAL,
    textAlign: 'center',
    color: AppColors.PRIMARY_DARK,
  },
  modalContainerStyle: {
    height: '100%',
    width: '60%',
    position: 'absolute',
    right: 0,
    // borderWidth: 5,
    // borderColor: AppColors.TAG_ORANGE,
  },
  modalStyle: {
    backgroundColor: AppColors.SEMI_TRANSPARENT,
    marginBottom: moderateScale(60),
  },
  floatingBtn: {
    position: 'absolute',
    height: 56,
    width: 56,
    // backgroundColor: 'red',
    borderWidth: 1,
    zIndex: 100,
    bottom: 0,
    right: 50,
    left: 50,
  },
});
