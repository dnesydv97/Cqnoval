import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {BaseContainer, EmployeeItem} from 'components';
import {screenNames} from 'constant';
import {fetchAllUsers} from 'services/redux/employees/action';

const EmployeeScreen = () => {
  const dispatch = useDispatch();
  const employeeReducer = useSelector(
    (state) => state.usersReducer,
    shallowEqual,
  );

  function fetchEmployees() {
    if (
      !employeeReducer.isLoading &&
      !employeeReducer.isError &&
      employeeReducer.data
    ) {
      if (employeeReducer.data.items.length < employeeReducer.data.totalCount)
        dispatch(fetchAllUsers(employeeReducer.data.items.length));
    } else if (
      !employeeReducer.isLoading &&
      !employeeReducer.isError &&
      !employeeReducer.data
    )
      dispatch(fetchAllUsers());
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <BaseContainer isDrawer toolbarTitle={screenNames.EMPLOYEE_SCREEN}>
      <FlatList
        data={employeeReducer.data && employeeReducer.data.items}
        keyExtractor={(item, index) => String(index)}
        renderItem={({index, item}) => <EmployeeItem employee={item} />}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchEmployees}
        refreshing={employeeReducer.isLoading}
      />
    </BaseContainer>
  );
};

export default EmployeeScreen;

const styles = StyleSheet.create({});
