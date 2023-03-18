import {useNavigation, useRoute} from '@react-navigation/native';
import { Icons } from 'assets';
import {BaseContainer, CircularIconButton, FloatingActionButton} from 'components';
import { navScreenNames } from 'constant';
import React, { useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { AppColors } from 'styles';
import { navigateToGivenScreen, navigateToGivenScreenWithParams } from 'utils';
import {PersonScreen} from '../person';

const CompanyPersons = () => {
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const {
    params: {companyName},
  } = route;
  return (
    <BaseContainer 
      toolbarTitle="Persons"
      loading={loading}>
      <PersonScreen companyName={companyName} />
      <FloatingActionButton
        onPress={()=> navigation.navigate('PersonDetailScreen')}
      />
    </BaseContainer>
  );
};

export default CompanyPersons;

const styles = StyleSheet.create({});
