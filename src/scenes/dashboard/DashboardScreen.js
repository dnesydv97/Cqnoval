import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  BackHandler,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {navScreenNames} from 'constant';
import {
  dateFormats,
  getDateOnRequiredFormat,
  getDisplayValue,
  logout,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
  showLoadingToast,
} from 'utils';
import {IconOutline} from '@ant-design/icons-react-native';
import {
  AppColors,
  AppDimensions,
  LARGE_HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
} from 'styles';
import {Icons, Images} from 'assets';
import {shallowEqual, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import {getFullFileUrl} from 'scenes/contact/functions';
import {FlatList, TouchableOpacity} from 'react-native';
import {BaseCard, BaseContainer, LoadMoreFlatList, Separator, TenderItem, TodoItem} from 'components';
import {getTodoList} from 'services';
import {LeaveMessage} from 'scenes/mail/msgTypeComponents';
import {ScrollView} from 'react-native-gesture-handler';
import { Alert } from 'react-native';

const DashboardScreen = () => {
  const navigation = useNavigation();

  const [source, setSource] = useState(Images.profileAvatar);
  const [dashboardData, setDashboardData] = useState({
    items: [],
    totalCount: 0,
  });

  const backAction = () => {
    BackHandler.exitApp();
    return true;
  }

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  )

  const profileReducer = useSelector(
    (state) => state.profileReducer,
    shallowEqual,
  );

  useEffect(() => {
    getProfilePicture();
  }, [profileReducer]);

  useEffect(() => {
    getDashboardList();
  }, []);

  const onPress = (to) => {
    switch (key) {
      case btnKey.COMPANY:
        navigateToGivenScreenWithParams(
          navigation,
          navScreenNames.NAV_COMPANY_DETAIL_SCREEN,
        );
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
  
  async function getProfilePicture() {
    profileReducer.data?.employeePersonalDetailUpdateDto?.uploadedFileDtos
      ?.length &&
      setSource({
        uri: await getFullFileUrl(
          profileReducer.data.employeePersonalDetailUpdateDto
            .uploadedFileDtos[0].viewFileURL,
        ),
      });
  }

  async function getDashboardList() {
    Promise.all([getTodoList()])
      .then((response) => {
        console.log('Response for dashboard list', response);
        setDashboardData(response[0].data);
      })
      .catch((error) => {
        onError(error);
      });
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.topInfoContainer}>
        <TouchableOpacity
          onPress={() =>
            navigateToGivenScreenWithParams(
              navigation,
              navScreenNames.NAV_PROFILE_SCREEN,
              {
                userId: null,
              },
            )
          }
          style={styles.profileContainer}
          activeOpacity={0.8}>
          <Image
            style={styles.profile}
            source={source}
            defaultSource={Images.profileAvatar}
            onError={() => setSource(Images.profileAvatar)}
          />
        </TouchableOpacity>
        <View style={styles.userInfoContainer}>
          <Text style={styles.text}>
            {getDateOnRequiredFormat(
              new Date(),
              dateFormats.MMM_D_COMMA_YYYY,
              null,
            )}
          </Text>
          <Text style={styles.title}>
            <Text>Hello, </Text>
            <Text style={{...styles.title, color: AppColors.PRIMARY_DARK}}>
              {getDisplayValue(
                profileReducer.data?.employeePersonalDetailUpdateDto
                  ?.employeeName,
              )}
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.logoutContainer}
          onPress={() => logout(navigation)}>
          <IconOutline
            name={'logout'}
            size={30}
            style={styles.icon}
            color={AppColors.PRIMARY}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.emailInfoContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={Icons.iconMessages}
            resizeMode="center"
            style={{...styles.icon, marginHorizontal: AppDimensions.SMALL}}
          />
          <Text style={{fontSize: moderateScale(17)}}>Currently you have,</Text>
        </View>
        <View style={styles.emailCountContainer}>
          <View style={styles.emailCountItem}>
            <Text style={{...styles.title, color: AppColors.TAG_ORANGE}}>
              16
            </Text>
            <Text style={{...styles.text, color: AppColors.UTIL}}>
              New Emails
            </Text>
          </View>
          <View style={styles.emailCountItem}>
            <Text style={{...styles.title, color: AppColors.PRIMARY_DARK}}>
              26
            </Text>
            <Text style={{...styles.text, color: AppColors.UTIL}}>
              CC Emails
            </Text>
          </View>
          <View style={styles.emailCountItem}>
            <Text style={{...styles.title, color: AppColors.TAG_GREEN}}>6</Text>
            <Text style={{...styles.text, color: AppColors.UTIL}}>
              Pending Emails
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.emailInfoContainer}>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: AppColors.DISABLE,
            paddingVertical: AppDimensions.SMALL,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.title}>Today's To Do List</Text>
          <TouchableOpacity
            onPress={() =>
              navigateToGivenScreen(
                navigation,
                navScreenNames.NAV_ADD_TODO_SCREEN,
              )
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: AppColors.BACKGROUND_BLUE,
              borderRadius: AppDimensions.NORMAL,
              paddingHorizontal: AppDimensions.NORMAL,
            }}>
            <IconOutline name="plus" color={AppColors.PRIMARY_DARK} />
            <Text style={{...styles.text, color: AppColors.PRIMARY_DARK}}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...styles.emailInfoContainer,
            height: moderateScale(250),
            padding: 0,
          }}>
          <LoadMoreFlatList
            data={dashboardData.items}
            onLoadMore={() => {}}
            showLoadMore={false}
            SingleItemView={TodoItem}
          />
        </View>
      </View>
      <View style={styles.emailInfoContainer}>
          <View>
            <Text style={styles.title}>Tender</Text>
            <Separator/>
          </View>
          
      </View>
      <View style={styles.emailInfoContainer}>
        <View>
          <Text style={styles.title}>Leave</Text>
          <Separator/>
        </View>
        <LeaveMessage/>
      </View>
    </View>
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: AppDimensions.NORMAL,
  },
  topInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {},
  profile: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
  },
  icon: {
    height: moderateScale(35),
    width: moderateScale(35),
  },
  userInfoContainer: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  title: {
    ...LARGE_HEADING_TEXT_SIZE,
  },
  text: {
    ...NORMAL_TEXT_STYLE,
  },
  logoutContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  emailInfoContainer: {
    padding: AppDimensions.NORMAL,
    backgroundColor: AppColors.BACKGROUND_GRAY,
    borderRadius: AppDimensions.NORMAL,
    marginVertical: AppDimensions.NORMAL,
  },
  emailCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emailCountItem: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppDimensions.NORMAL,
  },
});
