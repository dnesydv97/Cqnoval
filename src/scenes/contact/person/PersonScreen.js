import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList, View, ActivityIndicator} from 'react-native';
import {
  BaseContainer,
  CircularIconButton,
  EmptyView,
  PersonItem,
  SearchBox,
  LoadMore,
  TabContainer,
  Separator,
} from 'components';
import PropTypes from 'prop-types';
import {navScreenNames, screenNames} from 'constant';
import {getFavOrSearchCompanyPerson, getFavOrSearchPerson} from 'services';
import {
  findUniqueArray,
  navigateToGivenScreen,
  onError,
  showFailToast,
} from 'utils';
import {useNavigation} from '@react-navigation/native';
import {moderateVerticalScale} from 'react-native-size-matters';
import {AppColors} from 'styles';

const initialState = {
  totalCount: 0,
  loaded: 0,
  list: [],
};
const PersonScreen = ({companyName}) => {
  const [loading, setLoading] = useState(false);
  const [mainListInfo, setMainListInfo] = useState(initialState);
  const [searchListInfo, setSearchListInfo] = useState(initialState);
  const [isSearchList, setSearchList] = useState(false);
  const [prevSearchWord, setPrevSearchWord] = useState('');
  const [currentSearchWord, setCurrentSearchWord] = useState('');
  const [isFavourite, setIsFavourite] = useState(!companyName);

  const navigation = useNavigation();

  useEffect(() => {
    getFavPerson('', 0);
  }, []);

  function onSearch(searchText, isFav) {
    // getFavPerson(searchText, 0);
    setIsFavourite(isFav);
    setCurrentSearchWord(searchText);
    searchText ? setSearchList(true) : setSearchList(false);
    getFavPerson(searchText, 0, true, prevSearchWord !== searchText);
  }

  function getFavPerson(
    searchKeyword,
    skipCount,
    isFromSearch = false,
    isNewSearch = false,
  ) {
    setLoading(true);
    getFavOrSearchPerson(companyName ? companyName : searchKeyword, skipCount)
      .then((response) => {
        setLoading(false);
        console.log('Person search result ', response);
        if (response.status === 200) {
          setPrevSearchWord(searchKeyword);
          updateState(response.data, isFromSearch, searchKeyword, isNewSearch);
        } else showFailToast('There is something wrong with request.');
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

  const AddButton = () => (
    <CircularIconButton
      icon="plus"
      onPress={() =>
        navigateToGivenScreen(
          navigation,
          navScreenNames.NAV_PERSON_DETAIL_SCREEN,
        )
      }
    />
  );

  const footerVisibility = () => {
    console.log(isSearchList, searchListInfo, mainListInfo);
    return isSearchList
      ? searchListInfo.totalCount !== searchListInfo.loaded
      : mainListInfo.totalCount !== mainListInfo.loaded;
  };

  return (
    <TabContainer>
      {!companyName && (
        <SearchBox
          onSearch={onSearch}
          onPress={onSearch}
          containerStyle={{borderBottomWidth: StyleSheet.hairlineWidth}}
        />
      )}
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={
          isSearchList
            ? searchListInfo.list
            : isFavourite.list
            ? mainListInfo.list.filter((item) => item.isFavorite)
            : mainListInfo.list.sort((a, b) =>
                a.personFullName < b.personFullName
                  ? -1
                  : Number(a.personFullName > b.personFullName),
              )
        }
        keyExtractor={(item, index) => String(index)}
        renderItem={({index, item}) => <PersonItem person={item} />}
        showsVerticalScrollIndicator={false}
        // ListEmptyComponent={<EmptyView message="Ooops!!! Nothing to Display" />}
        refreshing={loading}
        ListFooterComponent={
          footerVisibility() && (
            <View
              style={{
                paddingVertical: 20,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator animating size="large" />
            </View>
          )
        }
        onEndReached={() => {
          if (
            isSearchList
              ? searchListInfo.totalCount > searchListInfo.loaded
              : mainListInfo.totalCount > mainListInfo.loaded
          ) {
            getFavPerson(
              currentSearchWord,
              isSearchList ? searchListInfo.loaded : mainListInfo.loaded,
              currentSearchWord !== '',
              currentSearchWord !== prevSearchWord,
            );
          }
        }}
        // onEndReachedThreshold={1.5}
        ItemSeparatorComponent={() => (
          <Separator containerStyle={styles.divider} />
        )}
      />
    </TabContainer>
  );
};

export default PersonScreen;

const styles = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  divider: {
    height: 1.5,
    width: '100%',
    backgroundColor: AppColors.LIGHT_GRAY,
  },
});
