import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {LoadMoreFlatList} from 'components';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {dateFormats, getDateOnRequiredFormat} from 'utils';
import {moderateScale} from 'react-native-size-matters';

const Tab = createMaterialTopTabNavigator();

function getEventDate(startDate, startTime, endDate) {
  if (startTime && endDate.includes(' ')) {
    const startDateTime = `${startDate} ${startTime}`;
    const endD = endDate.split(' ')[0];

    if (startDate === endD) {
      return `${getDateOnRequiredFormat(
        startDateTime,
        dateFormats.hour_min_12_hr_meridian,
      )} \n${getDateOnRequiredFormat(
        endDate,
        dateFormats.HH_MM_12HRS_AM_PM_MM_TEXT_DD_NUMBER,
      )}`;
    } else {
      return `${getDateOnRequiredFormat(
        startDateTime,
        dateFormats.HH_MM_12HRS_AM_PM_MM_TEXT_DD_NUMBER,
        dateFormats.YYYY_MM_DD_S_HH_MM_DASH,
      )} \n${getDateOnRequiredFormat(
        endDate,
        dateFormats.HH_MM_12HRS_AM_PM_MM_TEXT_DD_NUMBER,
        dateFormats.YYYY_MM_DD_S_HH_MM_DASH,
      )}`;
    }
  } else {
    return startDate === endDate
      ? 'All Day'
      : `${getDateOnRequiredFormat(
          startDateTime,
          dateFormats.MMM_D_COMMA_YYYY,
        )} - ${getDateOnRequiredFormat(endDate, dateFormats.MMM_D_COMMA_YYYY)}`;
  }
}

const EventItem = ({item}) => {
  // console.log('Event Item in EventItem ', item);
  return (
    <View
      style={{
        ...styles.listItemContainer,
        justifyContent: 'center',
        marginBottom: AppDimensions.SMALLER,
        // backgroundColor:
        //   item.backgroundColor.toLowerCase() || AppColors.LIST_ITEM_BG,
      }}>
      <View style={styles.eventDateContainer}>
        <View style={styles.typeContainer}>
          <Text style={{...styles.dateText, color: AppColors.PRIMARY_TEXT}}>
            {item.eventTypeSystemName.split('_')[1]}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 0.9}}>
          <Text
            style={{
              ...NORMAL_TEXT_STYLE,
              fontWeight: '600',
              // color: item.textColor.toLowerCase(),
              paddingVertical: AppDimensions.SMALL,
            }}
            numberOfLines={1}>
            {item.title}
          </Text>
          <Text
            style={{
              ...SMALL_TEXT_STYLE,
              fontWeight: '300',
              color: AppColors.PRIMARY_TEXT,
              paddingBottom: AppDimensions.SMALL,
            }}
            numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <Text
          style={{
            ...styles.dateText,
            flex: 0.5,
            textAlign: 'right',
            paddingHorizontal: AppDimensions.SMALL,
          }}>
          {getEventDate(item.start, item.startTime, item.end)}
        </Text>
      </View>
    </View>
  );
};

const PersonalView = ({events}) => (
  <View style={styles.flatlistContainer}>
    <LoadMoreFlatList
      data={events}
      onLoadMore={() => {}}
      SingleItemView={EventItem}
    />
  </View>
);

const CalendarTabRoute = ({events}) => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: true,
        showIcon: true,
        activeTintColor: AppColors.ACCENT,
        indicatorStyle: {
          backgroundColor: AppColors.ACCENT,
          height: 0.5,
        },
        tabStyle: {
          height: moderateScale(40),
        },
        labelStyle: {
          height: moderateScale(22),
        },
      }}>
      <Tab.Screen
        name="CalenderAllEvent"
        children={() => (
          <PersonalView
            events={[...events.Personal, ...events.Business, ...events.Public]}
          />
        )}
        options={{tabBarLabel: 'All'}}
      />
      <Tab.Screen
        name="CalenderPersonalEvent"
        children={() => <PersonalView events={events.Personal} />}
        options={{tabBarLabel: 'Personal'}}
      />
      <Tab.Screen
        name="CalenderBusinessEvent"
        children={() => <PersonalView events={events.Business} />}
        options={{tabBarLabel: 'Business'}}
      />
      <Tab.Screen
        name="CalenderPublicEvent"
        children={() => <PersonalView events={events.Public} />}
        options={{tabBarLabel: 'Public'}}
      />
    </Tab.Navigator>
  );
};

export default CalendarTabRoute;

const styles = StyleSheet.create({
  flatlistContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  listItemContainer: {
    padding: AppDimensions.SMALL,
    marginVertical: AppDimensions.SMALL,
    marginHorizontal: AppDimensions.SMALLEST,
    borderRadius: 10,
    backgroundColor: AppColors.NORMAL_WHITE,
    shadowColor: AppColors.LIGHT_GRAY,
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
  },
  eventDateContainer: {
    // paddingVertical: AppDimensions.SMALLER,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: AppColors.LIGHT_GRAY,
  },
  typeContainer: {
    backgroundColor: AppColors.LIGHT_GRAY,
    marginStart: AppDimensions.SMALL,
    paddingHorizontal: AppDimensions.SMALL,
    borderRadius: AppDimensions.NORMAL,
  },
  dateText: {
    ...SMALL_TEXT_STYLE,
    color: AppColors.PRIMARY_DARK,
    paddingVertical: AppDimensions.SMALLER,
  },
});
