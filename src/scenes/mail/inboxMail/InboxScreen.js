import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  BaseContainer,
  SearchBox,
  PopMenuItem,
  FloatingActionButton,
} from 'components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {initialState, navScreenNames, screenNames} from 'constant';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AppColors, AppDimensions, HEADING_TEXT_SIZE} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import {IconOutline} from '@ant-design/icons-react-native';
import InboxTopTabRoute from 'navigations/InboxTopTabRoute';
import {navigateToGivenScreen, onError} from 'utils';
import {getInboxMails} from 'services';
import {Icons} from 'assets';

const fabActions = [
  {
    text: 'New Email',
    icon: Icons.iconMail,
    name: 'fab_new_email',
    position: 1,
  },
  {
    text: 'New Message',
    icon: Icons.iconChat,
    name: 'fab_new_internal',
    position: 2,
  },
];

const InboxScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {filter, mainFilter} = route?.params;
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSearchWord, setCurrentSearchWord] = useState('');
  const [isSearchList, setSearchList] = useState(false);
  const [isFavorite, setIsFavourite] = useState(false);

  function onSearch(searchText, isFav) {
    setCurrentSearchWord(searchText);
    searchText ? setSearchList(true) : setSearchList(false);
    setIsFavourite(isFav);
  }

  const onFabPressed = (key) => {
    switch (key) {
      case 'fab_new_email':
        navigateToGivenScreen(
          navigation,
          navScreenNames.NAV_MAIL_COMPOSE_SCREEN,
        );
        break;
      case 'fab_new_internal':
        navigateToGivenScreen(
          navigation,
          navScreenNames.NAV_COMPOSE_INTERNAL_SCREEN,
        );
        break;
      default:
        break;
    }
  };

  const MailView = () => (
    <IconOutline
      name="more"
      size={30}
      color={AppColors.PRIMARY_DARK}
      onPress={() => setShowFilter(!showFilter)}
    />
  );

  return (
    <BaseContainer
      toolbarTitle={'Mailbox / Inbox'}
      isDrawer
      loading={loading}
      containerStyle={{padding: moderateScale(2)}}
      toolbarRightIcon={MailView}
      // fab={{
      //   visibility: true,
      //   fabColor: AppColors.BTN_RED,
      //   fabActions: fabActions,
      //   onFabItemClick: onFabPressed,
      // }}
      >
      <View
        style={{
          flexDirection: 'row',
        }}>
        <SearchBox
          containerStyle={{flex: 1, marginBottom: AppDimensions.SMALLER, paddingHorizontal: AppDimensions.NORMAL}}
          onSearch={onSearch}
          onPress={onSearch}
        />
      </View>
      <InboxTopTabRoute
        setLoading={setLoading}
        mailType={mainFilter}
        subMailType={filter}
      />
      <FloatingActionButton
        localIcon={Icons.iconCompose}
        onPress={() =>
          navigateToGivenScreen(
            navigation,
            navScreenNames.NAV_MAIL_COMPOSE_SCREEN,
          )
        }
        containerStyle={{backgroundColor: AppColors.TAG_RED}}
      />

      {showFilter && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.slideContainer}
          onPress={() => setShowFilter(false)}>
          <View style={styles.filterContainer}>
            <Text style={styles.title}>Sort By</Text>
          </View>
        </TouchableOpacity>
      )}
    </BaseContainer>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: AppColors.LIST_ITEM_BG,
    borderRadius: 20,
    height: moderateScale(30),
  },
  pickerStyle: {
    paddingHorizontal: AppDimensions.NORMAL,
    // ...SMALL_TEXT_STYLE,
  },
  pickerLabelStyle: {
    // ...SMALL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    paddingVertical: AppDimensions.SMALLER,
  },
  slideContainer: {
    backgroundColor: AppColors.SEMI_TRANSPARENT,
    // flex: 1,
    position: 'relative',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    elevation: 10,
  },
  filterContainer: {
    width: '60%',
    height: '100%',
    alignSelf: 'flex-end',
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    // borderBottomLeftRadius: 4,
  },
  title: {
    ...HEADING_TEXT_SIZE,
    backgroundColor: AppColors.ITEM_BG,
    paddingVertical: AppDimensions.NORMAL,
    textAlign: 'center',
    color: AppColors.PRIMARY_DARK,
  },
});
