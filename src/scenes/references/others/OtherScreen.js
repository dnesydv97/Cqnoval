import { BaseCard, SearchBox } from 'components';
import { AppDimensions, AppColors } from 'styles';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { ViewBase, FlatList, StatusBar } from 'react-native';
import {
    onError,
    showFailToast,
    findUniqueArray,
    navigateToGivenScreen,
    navigateToGivenScreenWithParams,
} from 'utils';
import {
    BaseContainer,
    ReferenceSearchBox,
    OtherItem,
    LoadMore,
    EmptyView,
    FloatingActionButton,
} from 'components';
import { getFavOrSearchOther } from 'services/remote/api/ReferenceApi';
import { ActivityIndicator } from 'react-native';

const initialState = {
    totalCount: 0,
    loaded: 0,
    list: [],
};

const OtherScreen = () => {
    
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [mainInfoList, setMainInfoList] = useState(initialState);
    const [searchListInfo, setSearchListInfo] = useState(initialState);
    const [isSearchList, setSearchList] = useState(false);
    const [prevSearchWord, setPrevSearchWord] = useState('');
    const [currentSearchWord, setCurrentSearchWord] = useState('');
    
    useEffect(() => {
        getFavOther();
    }, []);

    function onSearch(searchText) {
        setCurrentSearchWord(searchText);
        searchText ? setSearchList(true) : setSearchList(false);
        getFavOther(searchText, 0, true, prevSearchWord !== searchText);
    }

    function getFavOther(
        searchKeyword,
        skipCount,
        isFromSearch = false,
        isNewSearch = false,
    ) {
        setLoading(true);
        getFavOrSearchOther(searchKeyword, skipCount)
            .then((response) => {
                setLoading(false);
                console.log('Other Search Result', response);
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
            if(isNewSearch) {
                console.log("Response Item From updateSearch", response.items);
                setSearchListInfo({
                    ...searchListInfo,
                    list: response.items,
                    totalCount: response.totalCount,
                    loaded: response.items.length,
                });
            } else {
                const uniqueList = findUniqueArray(
                    [...searchListInfo.list, ...response.items],
                    'referenceCode',
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
        <View style={{backgroundColor: AppColors.NORMAL_WHITE, flex: 1}}>
            <SearchBox
                onSearch={onSearch}
                containerStyle={{borderBottomWidth: StyleSheet.hairlineWidth}}
            />
            {console.log("Main Lists from Other Screen", mainInfoList)}
            {console.log("Search Lists from Tender Screen", searchListInfo)}
            <FlatList
                contentContainerStyle={
                    (isSearchList && !searchListInfo.list.length) ||
                    (!isSearchList && !mainInfoList.list.length)
                        ? styles.emptyViewStyle
                        : null
                }
                data={isSearchList ? searchListInfo.list : mainInfoList.list}
                keyExtractor={(item, index) => String(index)}
                renderItem={({index, item}) => <OtherItem other={item}/>}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={() => 
                    getFavOther(
                        currentSearchWord,
                        0,
                        currentSearchWord !== '',
                        currentSearchWord !== prevSearchWord,
                    )
                }
                initialNumToRender={50}
                ListFooterComponent={
                    footerVisibility() && (
                        <View 
                            style={{
                                paddingVertical: 20,
                                alignContent: 'center',
                                justifyContent: 'center',
                            }}>
                            <ActivityIndicator animating size="large"/>
                        </View>
                    )
                }
                onEndReached={() => {
                    if(
                        isSearchList
                            ? searchListInfo.totalCount > searchListInfo.loaded
                            : mainInfoList.totalCount > mainInfoList.loaded
                    ) {
                        getFavOther(
                            currentSearchWord,
                            isSearchList ? searchListInfo.loaded : mainInfoList.loaded,
                            currentSearchWord !== '',
                            currentSearchWord !== prevSearchWord,
                        );
                    }
                }}
            />
        </View>
    );
};

export default OtherScreen;

const styles = StyleSheet.create({

});