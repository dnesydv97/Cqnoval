import {BaseContainer} from 'components';
import {screenNames} from 'constant';
import React from 'react';
import {View, Text} from 'react-native';
const BusinessDueDateScreen = () => {
  return (
    <BaseContainer isDrawer toolbarTitle={screenNames.BUSINESS_DUE_DATE_SCREEN}>
      <Text> This is Business Date Due Page.</Text>
    </BaseContainer>
  );
};
export default BusinessDueDateScreen;
