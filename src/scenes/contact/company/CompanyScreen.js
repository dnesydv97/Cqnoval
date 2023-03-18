import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList, View} from 'react-native';
import {
  CircularIconButton,
  CompanyItem,
  EmptyView,
  SearchBox,
  TabContainer,
  Separator,
} from 'components';
import {navScreenNames} from 'constant';
import {
  findUniqueArray,
  navigateToGivenScreen,
  onError,
  showFailToast,
} from 'utils';
import {getFavOrSearchCompany} from 'services/remote/api/ContactApi';
import {useNavigation} from '@react-navigation/native';
import {AppColors, AppDimensions, WINDOW_HEIGHT} from 'styles';
import {ActivityIndicator} from 'react-native';

const initialState = {
  totalCount: 0,
  loaded: 0,
  list: [],
};

const CompanyScreen = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [mainListInfo, setMainListInfo] = useState(initialState);
  const [searchListInfo, setSearchListInfo] = useState(initialState);
  const [isSearchList, setSearchList] = useState(false);
  const [prevSearchWord, setPrevSearchWord] = useState('');
  const [currentSearchWord, setCurrentSearchWord] = useState('');
  const [isFavourite, setIsFavourite] = useState(true);

  useEffect(() => {
    getFavCompany();
  }, []);

  function onSearch(searchText, isFav) {
    setCurrentSearchWord(searchText);
    searchText ? setSearchList(true) : setSearchList(false);
    setIsFavourite(isFav);
    getFavCompany(searchText, 0, true, prevSearchWord !== searchText), isFav;
  }

  function getFavCompany(
    searchKeyword,
    skipCount,
    isFromSearch = false,
    isNewSearch = false,
  ) {
    setLoading(true);
    getFavOrSearchCompany(searchKeyword, skipCount)
      .then((response) => {
        setLoading(false);
        console.log('Company search result ', response);
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
      console.log('inside search', isNewSearch);
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
      console.log('not inside search', isNewSearch);
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

  const AddButton = () => (
    <CircularIconButton
      icon="plus"
      onPress={() =>
        navigateToGivenScreen(
          navigation,
          navScreenNames.NAV_COMPANY_DETAIL_SCREEN,
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
      <SearchBox
        onSearch={onSearch}
        containerStyle={{borderBottomWidth: StyleSheet.hairlineWidth}}
      />
      <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={[styles.flatListContainer,{marginBottom: AppDimensions.NORMAL}]}
          data={mainListInfo.list}
          keyExtractor={(item, index) => String(index)}
          renderItem={({index, item}) => <CompanyItem company={item} />}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          // ListEmptyComponent={
          //   <EmptyView message="Ooops!!!, There is nothing to Display." />
          // }
          onRefresh={() =>
            getFavCompany(
              currentSearchWord,
              0,
              currentSearchWord !== '',
              currentSearchWord !== prevSearchWord,
            )
          }
          initialNumToRender={10}
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
              getFavCompany(
                currentSearchWord,
                isSearchList ? searchListInfo.loaded : mainListInfo.loaded,
                currentSearchWord !== '',
                currentSearchWord !== prevSearchWord,
              );
            }
          }}
          // onEndReachedThreshold={0.5}
          ItemSeparatorComponent={() => (
            <Separator containerStyle={styles.divider} />
          )}
        />
      </View>
    </TabContainer>
  );
};

export default CompanyScreen;

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
