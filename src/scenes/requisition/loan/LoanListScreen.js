import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/core';
import {BaseContainer, LeaveItem, LoadMoreFlatList, TableRow} from 'components';
import {navScreenNames, screenNames} from 'constant';
import {AppColors} from 'styles';
import {
  dateFormats,
  getDateOnRequiredFormat,
  navigateToGivenScreen,
  onError,
} from 'utils';
import {getLoanList} from 'services';
import {ScrollView} from 'react-native';
import {RefreshControl} from 'react-native';

const LOAN_HEADER_ROW = ['S.N', 'Date', 'Amount', 'Status'];
const LOAN_COLUMN_SIZE = [40, 100, 120, 80];

function getTableRow(loanItem, index) {
  console.log('Loan item ', loanItem);
  let loanRow = [];
  if (loanItem) {
    loanRow = [
      index + 1,
      getDateOnRequiredFormat(
        loanItem?.creationTime,
        dateFormats.DD_MMM_YYYY_DASH,
      ),
      `NPR. ${loanItem.requestedAmount}`,
      loanItem.loanApplicationParticipantStatusDtos.find(
        (item) => item.isCurrentStatus,
      )?.loanApplicationStatusDto.displayName,
    ];
  }

  return loanRow;
}

const LoanListScreen = () => {
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
    obtainLoanList(0, filterOptions.SearchKeyword, filterOptions.Sorting);
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

  function obtainLoanList(SkipCount, SearchKeyword, Sorting) {
    setLoading(true);
    getLoanList(SkipCount, SearchKeyword, Sorting)
      .then((response) => {
        setLoading(false);
        console.log('Get All Loan list response ', response);
        if (response.status === 200) setLeaveList(response.data);
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  return (
    <BaseContainer
      toolbarTitle={screenNames.LOAN_LIST_SCREEN}
      isDrawer
      fab={{
        visibility: true,
        onFabClick: () =>
          navigateToGivenScreen(navigation, navScreenNames.NAV_LOAN_SCREEN),
        fabColor: AppColors.BTN_RED,
        fabRef,
      }}
      loading={loading}>
      <View style={styles.flatListContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() =>
                obtainLoanList(
                  filterOptions.SkipCount,
                  filterOptions.SearchKeyword,
                  filterOptions.Sorting,
                )
              }
            />
          }>
          <ScrollView horizontal>
            <View>
              <TableRow
                row={LOAN_HEADER_ROW}
                size={LOAN_COLUMN_SIZE}
                isHeader
              />
              {leaveList.items.map((item, index) => (
                <TableRow
                  row={getTableRow(item, index)}
                  size={LOAN_COLUMN_SIZE}
                  index={index}
                />
              ))}
            </View>
          </ScrollView>
        </ScrollView>

        {/* <LoadMoreFlatList
          data={leaveList.items}
          loading={loading}
          onLoadMore={() =>
            obtainMeetings(
              appointments.items.length,
              filterOptions.SearchKeyword,
              filterOptions.Sorting,
            )
          }
          SingleItemView={LeaveItem}
          showLoadMore={leaveList.totalCount > leaveList.items.length}
        /> */}
      </View>
    </BaseContainer>
  );
};

export default LoanListScreen;

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
  },
});
