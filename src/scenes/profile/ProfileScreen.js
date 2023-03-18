import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import PropTypes from 'prop-types';
import {Icons} from 'assets';
import {
  BaseCard,
  BaseContainer,
  EqualSpaceHorizontalView,
  PickerView,
  TextField,
  EditUpdateButton,
  ImagePickerItem,
} from 'components';
import {defaultValues, messages, screenNames} from 'constant';
import ProfileTabs from 'navigations/ProfileTabRoute';
import {
  checkIsAdmin,
  getDynamicFileLabelTypes,
  getUserDetailById,
  getUserId,
  isMe,
  updatePersonalDetail,
} from 'services';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {
  getDisplayValue,
  getPicketList,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {updateProfile} from 'services/redux/profile/action';
import {
  getFullFileUrl,
  getInitialUploaderGroup,
  handleDetailDocResponse,
  sendFileToServer,
} from 'scenes/contact/functions';

const ProfileScreen = () => {
  const route = useRoute();
  const {userId} = route?.params;

  const profileReducer = useSelector(
    (state) => state.profileReducer,
    shallowEqual,
  );
  const genderReducer = useSelector(
    (state) => state.gendersReducer,
    shallowEqual,
  );
  const maritalStatusReducer = useSelector(
    (state) => state.maritalStatusReducer,
    shallowEqual,
  );

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState();
  const [personalProfile, setPersonalProfile] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploaderGroup, setUploaderGroup] = useState({});
  const [dynamicFileLabelTypes, setDynamicFileLabelTypes] = useState([]);

  useEffect(() => {
    fetchDynamicFileTypes();
  }, []);

  useEffect(() => {
    // console.log('Profile Picture object ', profilePic);
    if (profilePic) getFullFileUrl(profilePic.viewFileURL, setProfileUrl);
  }, [profilePic]);

  useEffect(() => {
    if (userId) getUserDetail();
    else {
      setProfileData(profileReducer.data);
    }
  }, [userId, profileReducer]);

  useEffect(() => {
    profileData && Object.keys(profileData).length
      ? setPersonalProfile(profileData.employeePersonalDetailUpdateDto)
      : setPersonalProfile({});

    dynamicFileLabelTypes.length &&
      profileData?.employeePersonalDetailUpdateDto?.uploadedFileDtos?.length &&
      handleDetailDocResponse(
        dynamicFileLabelTypes,
        profileData?.employeePersonalDetailUpdateDto?.uploadedFileDtos,
        setProfilePic,
        null,
        'For Profile Picture',
      );
    dynamicFileLabelTypes.length &&
      profileData?.uploadedFileDtos?.length &&
      handleDetailDocResponse(
        dynamicFileLabelTypes,
        profileData?.uploadedFileDtos || [],
        null,
        setUploaderGroup,
        'For Documents',
      );
  }, [profileData, dynamicFileLabelTypes]);

  function editIcon() {
    return isMe ? (
      <EditUpdateButton
        editMode={editMode}
        onPress={() => {
          editMode && updatePersonalProfile(false);
          setEditMode(!editMode);
        }}
      />
    ) : (
      <TouchableOpacity>
        <View>
          <Text
            style={{width: '100%'}}
            type="primary"
            onPress={() => updatePersonalProfile()}>
            Submit
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function fetchDynamicFileTypes() {
    getDynamicFileLabelTypes('Profile')
      .then((response) => {
        if (response.status === 200) {
          setDynamicFileLabelTypes(response.data);
        }
      })
      .catch(onError);
  }

  const getUserDetail = () => {
    setLoading(true);
    getUserDetailById(userId)
      .then((response) => {
        setLoading(false);
        console.log('User Detail Response: ', response);
        if (response.status === 200) {
          setProfileData(response.data);
        } else {
          setProfileData({});
          onError(response.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setProfileData({});
        onError(error);
      });
  };

  const onTextChange = (key) => (value) =>
    setPersonalProfile({
      ...personalProfile,
      [key]: value,
    });

  const updatePersonalProfile = async () => {
    setLoading(true);
    let data = {...personalProfile};
    data.uploadedFileDtos = [profilePic];
    updatePersonalDetail(data)
      .then(async (response) => {
        setLoading(false);
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

  function onDocumentUploaded(uploaderGroupName, responseObj) {
    const tempArray = uploaderGroup[uploaderGroupName];
    tempArray.push(responseObj);
    setUploaderGroup({
      ...uploaderGroup,
      [uploaderGroupName]: tempArray,
    });
  }

  const BasicInfoView = () => (
    <View style={{marginBottom: AppDimensions.NORMAL}}>
      <BaseCard>
        <View style={styles.basicCardTopView}>
          <View style={{flexDirection: 'row'}}>
            <ImagePickerItem
              onImageSelected={sendFileToServer(
                'ProfilePicture',
                setLoading,
                dynamicFileLabelTypes,
                setProfilePic,
                onDocumentUploaded,
              )}
              imageUri={profileUrl}
            />
          </View>
          {/* <Image style={styles.profilePic} source={Images.logo} /> */}
          {!editMode && (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: AppDimensions.NORMAL,
              }}>
              <TextField
                inputTextStyle={{
                  ...HEADING_TEXT_SIZE,
                  color: AppColors.NORMAL_BLACK,
                }}
                value={personalProfile.employeeName}
                onChangeText={onTextChange('employeeName')}
                containerStyle={{marginVertical: 0}}
                editable={editMode}
              />
            </View>
          )}
          {/* <Text style={{paddingHorizontal: AppDimensions.SMALLER}}>
              {getDisplayValue(personalProfile.designation)}
            </Text> */}
        </View>
        <View style={styles.basicCardBody}>
          {/* <EqualSpaceHorizontalView> */}
          {editMode && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 0.4,
                paddingBottom: AppDimensions.SMALLEST,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  paddingTop: AppDimensions.SMALL,
                  fontWeight: '400',
                }}>
                Full Name
              </Text>
              <TextField
                inputTextStyle={{
                  color: AppColors.ACCENT,
                  paddingVertical: AppDimensions.SMALLEST,
                  fontSize: moderateScale(14),
                }}
                value={personalProfile.employeeName}
                onChangeText={onTextChange('employeeName')}
                containerStyle={{}}
                editable={editMode}
              />
            </View>
          )}
          {editMode && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 0.4,
                paddingBottom: AppDimensions.SMALLEST,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  paddingTop: AppDimensions.SMALL,
                  fontWeight: '400',
                }}>
                Designation
              </Text>
              <TextField
                inputTextStyle={{
                  color: AppColors.ACCENT,
                  paddingVertical: AppDimensions.SMALLEST,
                  fontSize: moderateScale(14),
                }}
                value={personalProfile.designation}
                onChangeText={onTextChange('designation')}
                placeholder="Designation"
                editable={editMode}
              />
            </View>
          )}
          {editMode && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 0.4,
                paddingBottom: AppDimensions.NORMAL,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  paddingTop: AppDimensions.SMALL,
                  fontWeight: '400',
                }}>
                Gender
              </Text>
              <View style={{width: '25%', paddingTop: AppDimensions.SMALL}}>
                <PickerView
                  items={getPicketList(
                    genderReducer.data,
                    'systemName',
                    'displayName',
                  )}
                  pickerStyle={{
                    color: AppColors.ACCENT,
                    fontSize: moderateScale(14),
                  }}
                  value={personalProfile.genderSystemName}
                  // label="Gender"
                  placeholder={{label: 'Select Gender'}}
                  onValueChange={onTextChange('genderSystemName')}
                  editable={editMode}
                />
              </View>
            </View>
          )}
          {editMode && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 0.4,
                paddingBottom: AppDimensions.NORMAL,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  paddingTop: AppDimensions.SMALL,
                  fontWeight: '400',
                }}>
                Marital Status
              </Text>
              <View style={{width: '25%', paddingTop: AppDimensions.SMALL}}>
                <PickerView
                  items={getPicketList(
                    maritalStatusReducer.data,
                    'systemName',
                    'displayName',
                  )}
                  value={personalProfile.maritalStatusSystemName}
                  // label="Marital Status"
                  pickerStyle={{
                    color: AppColors.ACCENT,
                    fontSize: moderateScale(14),
                  }}
                  placeholder={{label: 'Select Status'}}
                  onValueChange={onTextChange('maritalStatusSystemName')}
                  editable={editMode}
                />
              </View>
            </View>
          )}
          {editMode && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 0.4,
                paddingBottom: AppDimensions.SMALLEST,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  paddingTop: AppDimensions.SMALL,
                  fontWeight: '400',
                }}>
                Blood Group
              </Text>
              <TextField
                inputTextStyle={{
                  color: AppColors.ACCENT,
                  paddingVertical: AppDimensions.SMALLEST,
                  fontSize: moderateScale(14),
                }}
                value={personalProfile.bloodGroup}
                onChangeText={onTextChange('bloodGroup')}
                editable={editMode}
              />
            </View>
          )}
          {editMode && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 0.4,
                paddingBottom: AppDimensions.SMALLEST,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  paddingTop: AppDimensions.SMALL,
                  fontWeight: '400',
                }}>
                Residence Contact
              </Text>
              <TextField
                inputTextStyle={{
                  color: AppColors.ACCENT,
                  paddingVertical: AppDimensions.SMALLEST,
                  fontSize: moderateScale(14),
                }}
                value={personalProfile.phoneResidence}
                // label="Residence"
                onChangeText={onTextChange('phoneResidence')}
                editable={editMode}
              />
            </View>
          )}
          {editMode && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 0.4,
                paddingBottom: AppDimensions.SMALLEST,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  paddingTop: AppDimensions.SMALL,
                  fontWeight: '400',
                }}>
                Personal Contact
              </Text>
              <TextField
                inputTextStyle={{
                  color: AppColors.ACCENT,
                  paddingVertical: AppDimensions.SMALLEST,
                  fontSize: moderateScale(14),
                }}
                value={personalProfile.phoneMobile}
                // label="Phone"
                onChangeText={onTextChange('phoneMobile')}
                editable={editMode}
              />
            </View>
          )}
          {editMode && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 0.4,
                paddingBottom: AppDimensions.SMALLEST,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  paddingTop: AppDimensions.SMALL,
                  fontWeight: '400',
                }}>
                Current Address
              </Text>
              <TextField
                inputTextStyle={{
                  color: AppColors.ACCENT,
                  paddingVertical: AppDimensions.SMALLEST,
                  fontSize: moderateScale(14),
                }}
                value={personalProfile.currentAddress}
                // label="Current Address"
                onChangeText={onTextChange('currentAddress')}
                editable={editMode}
              />
            </View>
          )}
          {editMode && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 0.4,
                paddingBottom: AppDimensions.SMALLEST,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  paddingTop: AppDimensions.SMALL,
                  fontWeight: '400',
                }}>
                Permanent Address
              </Text>
              <TextField
                inputTextStyle={{
                  color: AppColors.ACCENT,
                  paddingVertical: AppDimensions.SMALLEST,
                  fontSize: moderateScale(14),
                }}
                value={personalProfile.permanentAddress}
                // label="Current Address"
                onChangeText={onTextChange('permanentAddress')}
                editable={editMode}
              />
            </View>
          )}
          {editMode && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 0.4,
                paddingBottom: AppDimensions.SMALLEST,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  paddingTop: AppDimensions.SMALL,
                  fontWeight: '400',
                }}>
                Hobbies
              </Text>
              <TextField
                inputTextStyle={{
                  color: AppColors.ACCENT,
                  paddingVertical: AppDimensions.SMALLEST,
                  fontSize: moderateScale(14),
                }}
                value={personalProfile.hobbies}
                // label="Hobbies"
                onChangeText={onTextChange('hobbies')}
                editable={editMode}
              />
            </View>
          )}
          {editMode && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 0.4,
                paddingBottom: AppDimensions.SMALLEST,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  paddingTop: AppDimensions.SMALL,
                  fontWeight: '400',
                }}>
                Allergies
              </Text>
              <TextField
                inputTextStyle={{
                  color: AppColors.ACCENT,
                  paddingVertical: AppDimensions.SMALLEST,
                  fontSize: moderateScale(14),
                }}
                value={personalProfile.allergy}
                // label="Allergies"
                onChangeText={onTextChange('allergy')}
                editable={editMode}
              />
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
                Gender
              </Text>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  fontWeight: '600',
                  color: AppColors.ACCENT,
                }}>
                {personalProfile.genderSystemName}
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
                  color: AppColors.ACCENT,
                }}>
                {personalProfile.maritalStatusSystemName}
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
                Blood Group
              </Text>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  fontWeight: '600',
                  color: AppColors.ACCENT,
                }}>
                {personalProfile.bloodGroup}
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
                  color: AppColors.ACCENT,
                }}>
                {personalProfile.phoneResidence}
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
                  color: AppColors.ACCENT,
                }}>
                {personalProfile.phoneMobile}
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
                  color: AppColors.ACCENT,
                }}>
                {personalProfile.currentAddress}
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
                Permanent Address
              </Text>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  fontWeight: '600',
                  color: AppColors.ACCENT,
                }}>
                {personalProfile.permanentAddress}
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
                Hobbies
              </Text>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  fontWeight: '600',
                  color: AppColors.ACCENT,
                }}>
                {personalProfile.hobbies}
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
                Allergies
              </Text>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  fontWeight: '600',
                  color: AppColors.ACCENT,
                }}>
                {personalProfile.allergy}
              </Text>
            </View>
          )}
          {/* </EqualSpaceHorizontalView> */}
        </View>
      </BaseCard>
    </View>
  );

  return (
    <BaseContainer
      toolbarTitle={screenNames.PROFILE_SCREEN}
      loading={loading}
      scrollable
      showToolbarLeftIcon
      toolbarRightIcon={editIcon}
      // showToolbarLeftIcon={false}
    >
      {BasicInfoView()}
      <BaseCard>
        <ProfileTabs
          userDetail={profileData}
          docData={{dynamicFileLabelTypes, uploaderGroup, onDocumentUploaded}}
        />
      </BaseCard>
    </BaseContainer>
  );
};

ProfileScreen.propTypes = {
  userId: PropTypes.string,
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {},
  basicCardTopView: {
    // flexDirection: 'row',
    // borderBottomWidth: 1,
    paddingVertical: AppDimensions.NORMAL,
    borderColor: AppColors.LIGHT_GRAY,
    alignItems: 'center',
  },
  profilePic: {
    height: moderateVerticalScale(104),
    width: moderateScale(104),
    borderRadius: moderateVerticalScale(80 / 2),
    backgroundColor: AppColors.ACCENT,
  },
  basicCardBody: {
    paddingVertical: AppDimensions.NORMAL,
  },
  basicCardFooter: {
    borderTopWidth: 1,
    borderColor: AppColors.LIGHT_GRAY,
    alignItems: 'center',
  },
});
