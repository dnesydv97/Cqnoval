import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  BaseContainer,
  SearchBox,
  PopMenuItem,
  FloatingActionButton,
  ContactSearch,
} from 'components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {initialState, navScreenNames, screenNames} from 'constant';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AppColors, AppDimensions, HEADING_TEXT_SIZE} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import {
  findUniqueArray,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
  showFailToast,
} from 'utils';
import {getFavOrSearchCompanyPerson, getInboxMails} from 'services';
import {Icons} from 'assets';
import ContactTabRoute from 'navigations/ContactTabRoute';

const actions = [
  {
    text: 'Company',
    icon: Icons.iconContactAdd,
    name: 'fab_company',
    position: 1,
  },
  {
    text: 'Person',
    icon: Icons.iconPersonAdd,
    name: 'fab_person',
    position: 2,
  },
];

const ContactScreen = () => {
  const navigation = useNavigation();

  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainListInfo, setMainListInfo] = useState(initialState);
  const [isSearchList, setSearchList] = useState(false);
  const [searchListInfo, setSearchListInfo] = useState(initialState);
  const [currentSearchWord, setCurrentSearchWord] = useState('');
  const [prevSearchWord, setPrevSearchWord] = useState('');

  useEffect(() => {
    getCompanyPerson('', 0);
  }, []);

  function onSearch(searchText) {
    setCurrentSearchWord(searchText);
    searchText ? setSearchList(true) : setSearchList(false);
    getFavOrSearchCompanyPerson(
      searchText,
      0,
      true,
      prevSearchWord !== searchText,
    );
  }

  function getCompanyPerson(
    searchKeyword,
    skipCount,
    isFromSearch = false,
    isNewSearch = false,
  ) {
    setLoading(true);
    getFavOrSearchCompanyPerson(searchKeyword, skipCount)
      .then((response) => {
        setLoading(false);
        console.log(
          'Company or the person that you are searching for',
          response,
        );
        if (response.status === 200) {
          setPrevSearchWord(searchKeyword);
          updateState(response.data, isFromSearch, searchKeyword, isNewSearch);
        } else showFailToast('There is something wrong with the request.');
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  function updateState(response, isFromSearch, searchKeyword, isNewSearch) {
    if (isFromSearch && searchKeyword) {
      if (isNewSearch) {
        setSearchListInfo({
          ...searchListInfo,
          list: response.items,
          totalCount: response.totalCount,
          loaded: response.items.length,
        });
      } else {
        const uniqueList = findUniqueArray(
          [...searchListInfo.list, ...response.items],
          'contactPersonId',
          'contactCompanyId',
        );
        setSearchListInfo({
          ...searchListInfo,
          list: uniqueList,
          totalCount: response.totalCount,
          loaded: uniqueList.length,
        });
      }
    } else {
      setSearchList(false);
      if (isFromSearch) {
        setMainListInfo({
          ...mainListInfo,
          list: response.items,
          totalCount: response.totalCount,
          loaded: response.items.length,
        });
      } else {
        if (mainListInfo.loaded === 0) {
          setMainListInfo({
            ...mainListInfo,
            list: response.items,
            totalCount: response.totalCount,
            loaded: response.items.length,
          });
        } else {
          const uniqueList = findUniqueArray(
            [...mainListInfo.list, ...response.items],
            'contactPersonId',
            'contactCompanyId',
          );
          setMainListInfo({
            ...mainListInfo,
            list: uniqueList,
            totalCount: response.totalCount,
            loaded: uniqueList.length,
          });
        }
      }
    }
  }

  function onFabItemClick(name) {
    console.log(`Fab Item Selected button:  ${name}`);
    if (name === 'fab_company')
      navigateToGivenScreenWithParams(
        navigation,
        navScreenNames.NAV_COMPANY_DETAIL_SCREEN,
        {companyId: null},
      );
    else if (name === 'fab_person')
      navigateToGivenScreenWithParams(
        navigation,
        navScreenNames.NAV_PERSON_DETAIL_SCREEN,
        {personId: null},
      );
  }

  return (
    <BaseContainer
      toolbarTitle="Contact"
      containerStyle={{padding: moderateScale(2)}}
      showToolbarLeftIcon={false}
      loading={loading}
      fab={{
        visibility: true,
        fabActions: actions,
        onFabItemClick,
        fabColor: AppColors.BTN_RED,
      }}>
      {/* <SearchBox
        onSearch={onSearch}
        onPress={onSearch}
        containerStyle={{marginBottom: AppDimensions.SMALLER}}
      /> */}
      <ContactTabRoute />
    </BaseContainer>
  );
};

export default ContactScreen;
