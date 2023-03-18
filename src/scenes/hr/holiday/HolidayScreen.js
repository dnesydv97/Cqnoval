import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {
  HolidayItem,
  BaseContainer,
  EqualSpaceHorizontalView,
  PickerView,
  LoadMoreFlatList,
  FloatingActionButton,
  BaseCard,
} from 'components';
import {navScreenNames, screenNames} from 'constant';
import {getAllFiscalYears, getHolidys} from 'services';
import {
  getPickerItems,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
} from 'utils';
import {AppColors, NORMAL_TEXT_STYLE} from 'styles';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const HolidayScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [fiscalYears, setFiscalYears] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRequiredData();
  }, []);

  useEffect(() => {
    selectedFiscalYear &&
      getHolidysByFiscalYear(0, selectedFiscalYear.fiscalYearId);
  }, [selectedFiscalYear, isFocused]);

  function getHolidysByFiscalYear(skipCount, fiscalYearId) {
    setLoading(true);
    getHolidys(skipCount, fiscalYearId)
      .then((response) => {
        setLoading(false);
        console.log('Response of holidays ', response);
        if (response.status === 200) setHolidays(response.data.items);
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  function updateSelectedFiscalYear(id) {
    const foundItem = fiscalYears.find((item) => item.fiscalYearId === id);
    foundItem && setSelectedFiscalYear(foundItem);
  }

  function getRequiredData() {
    getAllFiscalYears()
      .then((response) => {
        setLoading(false);
        console.log('Fiscal Years response ', response);
        if (response.status === 200) setFiscalYears(response.data);
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  function onItemPressed(item) {
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_ADD_HOLIDAY_SCREEN,
      {
        holidayId: item.id,
        minDate: selectedFiscalYear.fiscalStart,
        maxDate: selectedFiscalYear.fiscalEnd,
      },
    );
  }

  return (
    <BaseContainer
      isDrawer
      toolbarTitle={screenNames.HOLIDAY_SCREEN}
      >
      <BaseCard>
        <PickerView
          label="Fiscal Year"
          labelStyle={styles.labelStyle}
          value={
            (selectedFiscalYear && selectedFiscalYear.fiscalYearId) ||
            (fiscalYears.length && fiscalYears[0].fiscalYearId)
          }
          items={getPickerItems(fiscalYears, 'displayName', 'fiscalYearId')}
          onValueChange={updateSelectedFiscalYear}
          editable
        />
      </BaseCard>
      <LoadMoreFlatList
        data={holidays}
        loading={loading}
        onLoadMore={() => console.log('Load more clicked')}
        SingleItemView={HolidayItem}
        onItemClicked={onItemPressed}
        showLoadMore
      />
      {selectedFiscalYear && selectedFiscalYear.isCurrent && (
        <FloatingActionButton
          onPress={() =>
            navigateToGivenScreenWithParams(
              navigation,
              navScreenNames.NAV_ADD_HOLIDAY_SCREEN,
              {
                minDate: selectedFiscalYear.fiscalStart,
                maxDate: selectedFiscalYear.fiscalEnd,
              },
            )
          }
        />
      )}
    </BaseContainer>
  );
};

export default HolidayScreen;

const styles = StyleSheet.create({
  filterContainer: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStyle: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
  },
});
