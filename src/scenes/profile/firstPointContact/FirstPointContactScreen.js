import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {shallowEqual, useSelector} from 'react-redux';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import PropTypes from 'prop-types';
import {
  EqualSpaceHorizontalView,
  PickerView,
  ProgressModal,
  TextField,
  EditUpdateButton,
} from 'components';
import {
  AppDimensions,
  AppColors,
  HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
} from 'styles';
import {defaultValues, messages} from 'constant';
import {getPicketList, onError, showFailToast, showSuccessToast} from 'utils';
import {checkIsAdmin, isMe, updatePersonalDetail} from 'services';
import {updateProfile} from 'services/redux/profile/action';

const FirstPointContactScreen = ({userDetail}) => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({});

  const maritalStatusReducer = useSelector(
    (state) => state.maritalStatusReducer,
    shallowEqual,
  );

  useEffect(() => {
    userDetail && Object.keys(userDetail).length
      ? setProfileData(userDetail.employeePersonalDetailUpdateDto)
      : setProfileData({});
  }, [userDetail]);

  const onTextChange = (key) => (value) =>
    setProfileData({
      ...profileData,
      [key]: value,
    });

  const updateFirstPointProfile = () => {
    setLoading(true);
    updatePersonalDetail(profileData)
      .then(async (response) => {
        setLoading(false);
        console.log('Response First Update Profile', response);
        if (response.status === 200) {
          (await isMe(response.data.appUserId)) &&
            updateProfile('employeePersonalDetailUpdateDto', response.data);
          showSuccessToast(messages.PROFILE_UPDATE_SUCCESS);
        } else {
          showFailToast(messages.PROFILE_UPDATE_FAILED);
        }
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {!editMode && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopWidth: 0.4,
              paddingTop: AppDimensions.NORMAL,
              paddingBottom: AppDimensions.NORMAL,
            }}>
            <Text style={{fontSize: moderateScale(14), fontWeight: '400'}}>
              Name
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.employeeName}
            </Text>
          </View>
        )}
        {!editMode && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopWidth: 0.4,
              paddingTop: AppDimensions.NORMAL,
              paddingBottom: AppDimensions.NORMAL,
            }}>
            <Text style={{fontSize: moderateScale(14), fontWeight: '400'}}>
              Marital Status
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.maritalStatusSystemName}
            </Text>
          </View>
        )}
        {!editMode && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopWidth: 0.4,
              paddingTop: AppDimensions.NORMAL,
              paddingBottom: AppDimensions.NORMAL,
            }}>
            <Text style={{fontSize: moderateScale(14), fontWeight: '400'}}>
              Residence Contact
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.phoneResidence}
            </Text>
          </View>
        )}
        {!editMode && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopWidth: 0.4,
              paddingTop: AppDimensions.NORMAL,
              paddingBottom: AppDimensions.NORMAL,
            }}>
            <Text style={{fontSize: moderateScale(14), fontWeight: '400'}}>
              Personal Contact
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.phoneMobile}
            </Text>
          </View>
        )}
        {!editMode && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopWidth: 0.4,
              paddingTop: AppDimensions.NORMAL,
              paddingBottom: AppDimensions.NORMAL,
            }}>
            <Text style={{fontSize: moderateScale(14), fontWeight: '400'}}>
              Current Address
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.currentAddress}
            </Text>
          </View>
        )}
        {!editMode && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopWidth: 0.4,
              paddingTop: AppDimensions.NORMAL,
            }}>
            <Text style={{fontSize: moderateScale(14), fontWeight: '400'}}>
              Comment
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.comment}
            </Text>
          </View>
        )}
        {editMode && (
          <EqualSpaceHorizontalView>
            <TextField
              value={profileData.employeeName || defaultValues.STRING}
              onChangeText={onTextChange('employeeName')}
              label="Name"
              editable={editMode}
            />
            <PickerView
              items={getPicketList(
                maritalStatusReducer.data,
                'systemName',
                'displayName',
              )}
              value={profileData.maritalStatusSystemName}
              label="Relation"
              placeholder={{label: 'Select Status'}}
              onValueChange={onTextChange('maritalStatusSystemName')}
              editable={editMode}
            />
          </EqualSpaceHorizontalView>
        )}

        {editMode && (
          <EqualSpaceHorizontalView>
            <TextField
              value={profileData.phoneResidence}
              onChangeText={onTextChange('phoneResidence')}
              label="Phone Residence"
              editable={editMode}
            />
            <TextField
              style={styles.text}
              value={profileData.phoneMobile}
              onChangeText={onTextChange('phoneMobile')}
              label="Phone Mobile"
              editable={editMode}
            />
          </EqualSpaceHorizontalView>
        )}
        {editMode && (
          <TextField
            style={styles.text}
            value={profileData.currentAddress}
            onChangeText={onTextChange('currentAddress')}
            label="Contact Address"
            editable={editMode}
          />
        )}
        {editMode && (
          <TextField
            style={styles.text}
            value={profileData.comment}
            onChangeText={onTextChange('comment')}
            label="Any Comment/Requirements"
            editable={editMode}
          />
        )}
      </KeyboardAwareScrollView>

      <EditUpdateButton
        editMode={editMode}
        onPress={() => {
          editMode && updateFirstPointProfile();
          setEditMode(!editMode);
        }}
      />

      <ProgressModal loading={loading} />
    </View>
  );
};

FirstPointContactScreen.propType = {
  userDetail: PropTypes.object.isRequired,
};

export default FirstPointContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: moderateScale(40),
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    padding: AppDimensions.SMALL,
  },
});
