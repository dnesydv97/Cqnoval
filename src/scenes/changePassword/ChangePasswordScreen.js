import {Button, InputItem} from '@ant-design/react-native';
import {BaseContainer} from 'components';
import {screenNames} from 'constant';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {showSuccessToast} from 'utils';

const ChangePasswordScreen = () => {
  const [changePasswordData, setChangePasswordData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const onTextChange = (key) => (value) =>
    setChangePasswordData({
      ...changePasswordData,
      [key]: value,
    });

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSuccessToast('Success, Password changed.');
    }, 2000);
  };

  return (
    <BaseContainer
      loading={loading}
      toolbarTitle={screenNames.CHANGE_PASSWORD_SCREEN}>
      <InputItem
        clear
        value={changePasswordData.email}
        onChange={onTextChange('email')}
        placeholder="Email">
        Email
      </InputItem>
      <InputItem
        clear
        value={changePasswordData.newPassword}
        onChange={onTextChange('newPassword')}
        placeholder="New Password">
        New Password
      </InputItem>
      <InputItem
        clear
        value={changePasswordData.confirmPassword}
        onChange={onTextChange('confirmPassword')}
        placeholder="Confirm Password">
        Confirm Password
      </InputItem>
      <Button type="primary" onPress={submit}>
        Submit
      </Button>
    </BaseContainer>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({});
