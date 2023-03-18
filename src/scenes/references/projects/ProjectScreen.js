import { navScreenNames } from 'constant';
import { color } from 'react-native-reanimated';
import React, {useState, useEffect} from 'react';
import { AppDimensions, AppColors } from 'styles';
import {useNavigation} from '@react-navigation/native';
import { moderateScale } from 'react-native-size-matters';
import { IconOutline } from '@ant-design/icons-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import { 
    navigateToGivenScreenWithParams, 
    findUniqueArray,
    onError,
    showFailToast,
    navigateToGivenScreen,
} from 'utils';
import {
    getFavOrSearchProject,
} from 'services/remote/api/ReferenceApi';
import { 
    BaseCard, 
    BaseContainer, 
    ReferenceSearchBox,
    ProjectItem, 
    LoadMore,
    EmptyView,
    FloatingActionButton,
    SearchBox,
} from 'components';
import { ActivityIndicator } from 'react-native';

const initialState = {
    totalCount : 0,
    loaded: 0,
    list: [],
};

const ProjectScreen = () => {
    const navigation = useNavigation();
    
    const [loading, setLoading] = useState(false);
    const [mainInfoList, setMainInfoList] = useState(initialState);
    const [searchListInfo, setSearchListInfo] = useState(initialState);
    const [isSearchList, setSearchList] = useState(false);
    const [prevSearchWord, setPrevSearchWord] = useState('');
    const [currentSearchWord, setCurrentSeachWord] = useState('');
    const [isFavorite, setIsFavorite] = useState(true);

    useEffect(() => {
        getFavProject();
    }, []);

    function onSearch(searchText, isFav) {
        setCurrentSeachWord(searchText);
        searchText ? setSearchList(true) : setSearchList(false);
        setIsFavorite(isFav);
        getFavProject(searchText, 0, true, prevSearchWord !== searchText), isFav; 
    }

    function getFavProject(
        searchKeyword,
        skipCount,
        isFromSearch = false,
        isNewSearch = false,
    ) {
        setLoading(true);
        getFavOrSearchProject(searchKeyword, skipCount)
            .then((response) => {
                setLoading(false);
                console.log('Project Search result', response);
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

    return (
        <View style={{backgroundColor: AppColors.NORMAL_WHITE, flex: 1}}>
            <SearchBox
                onSearch={onSearch}
                containerStyle={{borderBottomWidth: StyleSheet.hairlineWidth}}
            />
                {console.log("Main Lists from Project",mainInfoList)}
                {console.log("Search Lists from Project",searchListInfo)}
                <FlatList
                    contentContainerStyle={
                        (isSearchList && !searchListInfo.list.length) ||
                        (!isSearchList && !mainInfoList.list.length)
                            ? styles.emptyViewStyle
                            : null
                    }
                    data={
                        isSearchList 
                        ? searchListInfo.list 
                        : mainInfoList.list
                    }
                    keyExtractor={(item, index) => String(index)}
                    renderItem ={({index,item}) => <ProjectItem project={item}/>}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={() =>
                        getFavProject(
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
                            getFavProject(
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
}

const styles = StyleSheet.create({

});

export default ProjectScreen;