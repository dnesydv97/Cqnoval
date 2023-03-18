import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/core';
import {BaseContainer, LeaveItem, LoadMoreFlatList} from 'components';
import {navScreenNames, screenNames} from 'constant';
import {AppColors} from 'styles';
import {navigateToGivenScreen, onError} from 'utils';
import {getAllLeaveList} from 'services';

const LeaveListScreen = () => {
  const navigation = useNavigation();
  const fabRef = useRef(null);
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [leaveList, setLeaveList] = useState({
    items: [],
    totalCount: 0,
  });

  const [filterOptions, setFilterOptions] = useState({
    SkipCount: 0,
    SearchKeyword: null,
    Sorting: null,
  });

  useEffect(() => {
    obtainLeaveList(0, filterOptions.SearchKeyword, filterOptions.Sorting);
  }, [filterOptions]);

  useEffect(() => {
    fabRef && !isFocused && fabRef.current.reset();
  }, [fabRef, isFocused]);

  const onFilterOptionChanged = (key) => (value) => {
    setFilterOptions({
      ...filterOptions,
      [key]: value,
    });
  };

  function obtainLeaveList(SkipCount, SearchKeyword, Sorting) {
    setLoading(true);
    getAllLeaveList(SkipCount, SearchKeyword, Sorting)
      .then((response) => {
        setLoading(false);
        console.log('Get All leave list response ', response);
        if (response.status === 200) {
          setLeaveList({
            ...setLeaveList,
            items: [...leaveList.items, ...response.data.items],
            totalCount: response.data.totalCount,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  return (
    <BaseContainer
      toolbarTitle={screenNames.LEAVE_LIST_SCREEN}
      isDrawer
      fab={{
        visibility: true,
        onFabClick: () =>
          navigateToGivenScreen(navigation, navScreenNames.NAV_LEAVE_SCREEN),
        fabColor: AppColors.BTN_RED,
        fabRef,
      }}
      loading={loading}>
      <View style={styles.flatListContainer}>
        <LoadMoreFlatList
          data={leaveList.items}
          loading={loading}
          onLoadMore={() =>
            obtainLeaveList(
              leaveList.items.length,
              filterOptions.SearchKeyword,
              filterOptions.Sorting,
            )
          }
          onRefresh={() =>
            obtainLeaveList(
              leaveList.items.length,
              filterOptions.SearchKeyword,
              filterOptions.Sorting,
            )
          }
          SingleItemView={LeaveItem}
          showLoadMore={leaveList.totalCount > leaveList.items.length}
        />
      </View>
    </BaseContainer>
  );
};

export default LeaveListScreen;

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
    // borderWidth: 1,
  },
});
