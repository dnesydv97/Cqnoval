import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {BaseModal, LoadMoreFlatList, MessageItem, PickerView} from 'components';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
  SMALLEST_TEXT_STYLE,
  SMALL_TEXT_STYLE,
  WINDOW_HEIGHT,
} from 'styles';
import {ShowAllScreen, InternalOnlyScreen} from 'scenes';
import {
  dateFormats,
  getDateOnRequiredFormat,
  navigateToGivenScreenWithParams,
  onError,
} from 'utils';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {getInboxMails} from 'services';
import {navScreenNames} from 'constant';
import {Animated} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {Icons} from 'assets';
import {Image} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {getInboxMessages} from 'services/redux/mail/inbox/action';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

const Tab = createMaterialTopTabNavigator();

const EventItem = ({item}) => (
  <View
    style={{
      ...styles.listItemContainer,
      // borderWidth: 1,
      backgroundColor:
        item.backgroundColor.toLowerCase() || AppColors.LIST_ITEM_BG,
    }}>
    <Text style={{...NORMAL_TEXT_STYLE, color: item.textColor.toLowerCase()}}>
      {item.title}
    </Text>
    <Text style={{...SMALL_TEXT_STYLE, color: AppColors.UTIL}}>
      {getDateOnRequiredFormat(item.startDate, dateFormats.MMM_D_COMMA_YYYY)}
    </Text>
  </View>
);

const MailListViewScreen = (props) => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const inboxData = useSelector(
    (state) => state.inboxMailReducer,
    shallowEqual,
  );

  const {applicationType, setLoading, mailType, subMailType} = props;
  console.log('params in MailListViewScreen ', mailType, subMailType);

  const [inboxMails, setInboxMails] = useState({
    items: [],
    totalCount: 0,
  });
  const [internalMessages, setInternalMessages] = useState({
    isInternal: false,
    items: [],
  });
  const [longPressMode, setLongPressMode] = useState(false);

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

  useEffect(() => {
    setInternalMessages({
      ...internalMessages,
      isInternal: applicationType === 'QuickMessage',
    });

    // isFocused && fetchInboxMessages();
  }, [applicationType, subMailType, mailType]);

  useEffect(() => {
    console.log('Mail list view screen ', mailType, subMailType);
    applicationType !== 'QuickMessage' && fetchInboxMessages();
  }, [subMailType, mailType]);

  useEffect(() => {
    console.log('INbox reducer changed ', inboxData);
    setLoading(inboxData.isLoading);

    if (!inboxData.isLoading && inboxData.data) {
      setInboxMails(inboxData?.data[mailType][subMailType]);
      setInternalMessages({
        ...internalMessages,
        items: inboxData.data[mailType][subMailType].items.filter(
          (item) => item.applicationTypeSystemName === 'QuickMessage',
        ),
      });
    }
  }, [inboxData, isFocused]);

  function fetchInboxMessages(SkipCount = 0) {
    dispatch(getInboxMessages(null, mailType, subMailType, SkipCount));
  }

  function onLongPress(mailItem) {
    console.log('Long press on mail ', mailItem);
    setLongPressMode(true);
    markAsRead(mailItem);
  }

  function onPress(mailItem) {
    longPressMode
      ? markAsRead(mailItem)
      : navigateToGivenScreenWithParams(
          navigation,
          navScreenNames.NAV_EMAIL_DETAIL_SCREEN,
          {messageDetail: mailItem},
        );
  }

  function markAsRead(mailItem) {
    const items = inboxMails.items.map((item) => {
      return mailItem.id === item.id
        ? {...item, isSelected: !mailItem.isSelected}
        : item;
    });

    setInboxMails({
      ...inboxMails,
      items,
    });
  }

  function onLongMenuPressed(action) {
    console.log(
      'Selected Items ',
      inboxMails.items.filter((item) => item.isSelected),
    );
    if (action === 'Read') {
    } else if (action === 'Archieved') {
    } else if (action === 'Close') {
      setLongPressMode(false);
      const tempList = inboxMails.items.map((item) => {
        return {
          ...item,
          isSelected: false,
        };
      });

      setInboxMails({
        ...inboxMails,
        items: tempList,
      });
    }
  }

  const ActionButton = ({title, icon, disabled, onPress}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{alignItems: 'center', padding: AppDimensions.NORMAL}}
        onPress={() => !disabled && onPress && onPress(title)}>
        <Image
          style={{
            ...styles.icon,
            tintColor: disabled ? AppColors.DISABLE : 'white',
          }}
          source={icon}
        />
        <Text
          style={{
            ...styles.smallText,
            color: disabled ? AppColors.DISABLE : 'white',
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <LoadMoreFlatList
        data={
          internalMessages.isInternal
            ? internalMessages.items
            : inboxMails.items
        }
        onLoadMore={() => {
          fetchInboxMessages(inboxMails.items.length);
        }}
        showLoadMore={inboxMails.totalCount > inboxMails.items.length}
        SingleItemView={MessageItem}
        onItemClicked={onPress}
        helpingData={onLongPress}
        onRefresh={fetchInboxMessages}
      />
      {longPressMode && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: '40%',
            alignItems: 'center',
            backgroundColor: AppColors.PRIMARY,
            paddingVertical: AppDimensions.NORMAL,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
          <IconOutline
            size={25}
            name="close"
            onPress={() => onLongMenuPressed('Close')}
            color="white"
          />
          <ActionButton
            title="Read"
            icon={Icons.iconMessageOutline}
            onPress={() => onLongMenuPressed('Read')}
          />
          <ActionButton
            title="Archieved"
            icon={Icons.iconArchive}
            onPress={() => onLongMenuPressed('Archieved')}
          />
        </View>
      )}
    </View>
  );
};

const InboxTopTabRoute = (props) => {
  const {setLoading, mailType, subMailType} = props;

  return (
    <Tab.Navigator
      tabBarOptions={{
        showIcon: true,
        activeTintColor: AppColors.PRIMARY_TAB_COLOR,
        indicatorStyle: {
          backgroundColor: AppColors.PRIMARY_TAB_COLOR,
          height: 2,
          textTransform: 'capitalize',
        },
        tabStyle: {
          height: moderateScale(40),
          
        },
        style: {
          fontSize: moderateScale(18),
        },
        labelStyle: {
          height: moderateScale(22),
        },
      }}>
      <Tab.Screen
        name="AllMailInboxScreen"
        children={() => (
          <MailListViewScreen
            setLoading={setLoading}
            mailType={mailType}
            subMailType={subMailType}
            applicationType={null}
          />
        )}
        options={{tabBarLabel: 'All'}}
      />
      <Tab.Screen
        name="InternalMailInboxScreen"
        children={() => (
          <MailListViewScreen
            setLoading={setLoading}
            mailType={mailType}
            subMailType={subMailType}
            applicationType="QuickMessage"
          />
        )}
        options={{tabBarLabel: 'Internal'}}
      />
    </Tab.Navigator>
  );
};

export default InboxTopTabRoute;

const styles = StyleSheet.create({
  flatlistContainer: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  listItemContainer: {
    padding: AppDimensions.MODERATE,
    marginVertical: AppDimensions.SMALL,
    marginHorizontal: AppDimensions.SMALL,
    borderRadius: 10,
    justifyContent: 'center',
  },
  modalContainerStyle: {
    height: '100%',
    width: '60%',
    position: 'absolute',
    right: 0,
  },
  modalStyle: {
    backgroundColor: AppColors.SEMI_TRANSPARENT,
    marginBottom: moderateScale(55),
  },
  smallText: {
    ...SMALLER_TEXT_STYLE,
  },
  icon: {
    height: moderateScale(25),
    width: moderateScale(25),
    tintColor: 'black',
  },
});
