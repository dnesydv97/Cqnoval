import {navScreenNames} from 'constant';
import {color} from 'react-native-reanimated';
import React, {useEffect, useState} from 'react';
import {AppDimensions, AppColors} from 'styles';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from 'react-native-size-matters';
import {IconOutline} from '@ant-design/icons-react-native';
import {SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar} from 'react-native';
import {
    onError,
    showFailToast,
    findUniqueArray,
    navigateToGivenScreen,
    navigateToGivenScreenWithParams,
} from 'utils';
import {
    getFavOrSearchTender,
} from 'services/remote/api/ReferenceApi';
import {
    BaseCard,
    BaseContainer,
    ReferenceSearchBox,
    TenderItem,
    LoadMore,
    EmptyView,
    FloatingActionButton,
    Separator,
    SearchBox,
    TabContainer,
} from 'components';
import { ActivityIndicator } from 'react-native';

const initialState = {
    totalCount: 0,
    loaded: 0,
    list: [],
};

const TenderScreen = () => {
    const navigation = useNavigation();
    
    const [loading, setLoading] = useState(false);
    const [mainInfoList, setMainInfoList] = useState(initialState);
    const [searchListInfo, setSearchListInfo] = useState(initialState);
    const [isSearchList, setSearchList] = useState(false);
    const [prevSearchWord, setPrevSearchWord] = useState('');
    const [currentSearchWord, setCurrentSeachWord] = useState('');
    const [isFavorite, setIsFavourite] = useState(true);

    useEffect(() => {
        getFavTender();
    }, []);

    function onSearch(searchText, isFav) {
        setCurrentSeachWord(searchText);
        searchText ? setSearchList(true) : setSearchList(false);
        setIsFavourite(isFav);
        getFavTender(searchText, 0, true, prevSearchWord !== searchText), isFav; 
    }

    function getFavTender(
        searchKeyword,
        skipCount,
        isFromSearch = false,
        isNewSearch = false,
    ) {
        setLoading(true);
        getFavOrSearchTender(searchKeyword, skipCount)
            .then((response) => {
                setLoading(false);
                console.log('Tender Search result', response);
                if(response.status === 200) {
                    setPrevSearchWord(searchKeyword);
                    updateState(response.data, isFromSearch, searchKeyword, isNewSearch);
                } else showFailToast('There is something wrong in the request');
            })
            .catch((error) => {
                setLoading(false);
                onError(error);
            });
    }

    function updateState(response, isFromSearch, searchKeyword, isNewSearch) {
        if(isFromSearch && searchKeyword) {
            console.log('inside search', isNewSearch);
            if(isNewSearch) {
                console.log("Response Item From updateState",response.items);
                setSearchListInfo({
                    ...searchListInfo,
                    list: response.items,
                    totalCount: response.totalCount,
                    loaded: response.items.length,
                });
            } else {
                const unqiueList = findUniqueArray(
                    [...searchListInfo.list, ...response.items],
                    'referenceCode',
                );
                setSearchListInfo({
                    ...searchListInfo,
                    list: unqiueList,
                    totalCount: response.totalCount,
                    loaded: unqiueList.length,
                });
            }
        } else{
            setSearchList(false);
            if(isFromSearch) {
                setMainInfoList({
                    ...mainInfoList,
                    list: response.items,
                    totalCount: response.totalCount,
                    loaded: response.items.length,
                });
            } else {
                if(mainInfoList.loaded === 0) {
                    setMainInfoList({
                        ...mainInfoList,
                        list: response.items,
                        totalCount: response.totalCount,
                        loaded: response.items.length,
                    });
                } else {
                    const uniqueList = findUniqueArray(
                        [...mainInfoList.list, ...response.items],
                        'referenceCode',
                    );

                    setMainInfoList({
                        ...mainInfoList,
                        list: uniqueList,
                        totalCount: response.totalCount,
                        loaded: uniqueList.length,
                    });
                }
            }
        }
    }

    const footerVisibility = () => {
        return isSearchList
            ? searchListInfo.totalCount !== searchListInfo.loaded
            : mainInfoList.totalCount !== mainInfoList.loaded;
    };

    return(
        // <View style={{backgroundColor: AppColors.NORMAL_WHITE}}>
        <TabContainer>
            {console.log("Main Lists from Tender Screen", mainInfoList)}
            {console.log("Search Lists from Tender Screen", searchListInfo)}
            <SearchBox
                onSearch={onSearch}
                containerStyle={{borderBottomWidth: StyleSheet.hairlineWidth, top: -8.68}}
            />
            <FlatList
                contentContainerStyle={
                    [(isSearchList && !searchListInfo.list.length) ||
                    (!isSearchList && !mainInfoList.list.length)
                        ? styles.emptyViewStyle
                        : null,
                    {marginBottom: AppDimensions.NORMAL}]
                }
                data={isSearchList ? searchListInfo.list : mainInfoList.list}
                keyExtractor={(item, index) => String(index)}
                renderItem={({index, item}) => <TenderItem tender={item}/>}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={() => 
                    getFavTender(
                        currentSearchWord,
                        0,
                        currentSearchWord !== '',
                        currentSearchWord !== prevSearchWord,
                    )
                }
                // initialNumToRender={100}
                ListFooterComponent={
                    footerVisibility() && (
                        <View
                            style={{
                                paddingVertical: 20,
                                alignContent: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ActivityIndicator/>
                        </View>
                    )
                }
                onEndReached={() => {
                    if(
                        isSearchList
                            ? searchListInfo.totalCount > searchListInfo.loaded
                            : mainInfoList.totalCount > mainInfoList.loaded 
                    ) {
                        getFavTender(
                            currentSearchWord,
                            isSearchList ? searchListInfo.loaded : mainInfoList.loaded,
                            currentSearchWord !== '',
                            currentSearchWord !== prevSearchWord,
                        );
                    }
                }}
            />
        {/* // </View> */}
        </TabContainer>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    divider: {
        height: 1.5,
        width: '100%',
        backgroundColor: AppColors.LIGHT_GRAY,
    },
    rowContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      paddingVertical: AppDimensions.NORMAL,
      borderBottomWidth: 0.4,
    },
    noteContainer: {
          flexDirection: 'column',  
          paddingVertical: AppDimensions.NORMAL,
          borderBottomWidth: 0.4,
      },
      titleView: {
          marginHorizontal: AppDimensions.LARGE, 
          marginVertical: AppDimensions.SMALL,
      },
      titleText: {
          color: AppColors.NORMAL_BLACK, 
          fontSize: moderateScale(16), 
          fontWeight: 'bold',
      },
      rowTitleText: {
          fontSize: moderateScale(14), 
          color: AppColors.NORMAL_BLACK,
      },
      rowContentText: {
          color: AppColors.PROFILE_DETAIL_TEXT, 
          fontSize: moderateScale(14),
      },
      noteContent:{
          margin: AppDimensions.NORMAL,
          fontSize: moderateScale(14),
      },
      flatListContainer: {
          flex: 1, 
          borderBottomWidth: 0.4,
      },
      flatListView: {
          flexDirection: 'row', 
          width:'100%',
      },
      favIconStyle:{
          width: '8%',
          marginVertical: AppDimensions.SMALL, 
          marginBottom: AppDimensions.NORMAL, 
          marginHorizontal: moderateScale(0), 
          alignContent: 'center',
      },
      projectIdStyle: {
          margin: AppDimensions.SMALL, 
          marginBottom: AppDimensions.NORMAL, 
          marginHorizontal: moderateScale(10), 
          width: '15%', 
          alignItems: 'center',
      },
      projectIdText: {
          color:  AppColors.FIVE_DAYS_COLOR,
      },
      projectDescStyle: {
          flex: 1, 
          width:'90%', 
          alignSelf: 'center', 
          marginHorizontal: moderateScale(0), 
          marginBottom: AppDimensions.NORMAL,
      },
      projectDescText: { 
          flexWrap: 'wrap', 
        //   color: AppColors.FIVE_DAYS_COLOR,
      },
      projectDateView: {
          width: '25%', 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: AppDimensions.NORMAL,
      },
      projectDate: {
          fontSize: moderateScale(12),
        //   color: AppColors.FIVE_DAYS_COLOR,
      },
      projectDeadline: {
          fontSize: moderateScale(11),
          color: AppColors.FIVE_DAYS_COLOR,
      },
  });

  export default TenderScreen;
