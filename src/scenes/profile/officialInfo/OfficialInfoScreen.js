import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {moderateScale} from 'react-native-size-matters';
import PropTypes from 'prop-types';
import {EditUpdateButton, ProgressModal, TextField} from 'components';
import {AppDimensions, AppColors, NORMAL_TEXT_STYLE} from 'styles';
import {messages} from 'constant';
import {updateOfficialDetail, checkIsAdmin, isMe} from 'services';
import {onError, showFailToast, showSuccessToast} from 'utils';
import {updateProfile} from 'services/redux/profile/action';

const OfficialInfoScreen = ({userDetail}) => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkIsAdmin(setIsAdmin);
  }, []);

  useEffect(() => {
    userDetail && Object.keys(userDetail).length
      ? setProfileData(userDetail.employeeOfficialDetailUpdateDto)
      : setProfileData({});
  }, [userDetail]);

  const onTextChange = (key) => (value) =>
    setProfileData({
      ...profileData,
      [key]: value,
    });

  const updateOfficialProfile = () => {
    setLoading(true);
    updateOfficialDetail(profileData)
      .then(async (response) => {
        setLoading(false);
        console.log('Response Update Official Profile', response);
        if (response.status === 200) {
          (await isMe(response.data.appUserId)) &&
            updateProfile('employeeOfficialDetailUpdateDto', response.data);
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
              paddingTop: AppDimensions.MODERATE,
              paddingBottom: AppDimensions.NORMAL,
            }}>
            <Text style={{fontSize: moderateScale(14), fontWeight: '400'}}>
              Designation
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.designation}
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
              Supervisor
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.APROFILE_DETAIL_TEXT,
              }}>
              {profileData.supervisor}
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
              Department
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.department}
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
              Hired Date
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.hireDate}
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
              Are you Contract?
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.ifContract}
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
              Contract Period
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.contractPeriod}
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
              Initials of CQ
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.cqInitial}
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
              Email Address
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.department}
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
              Educational Qualification
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.lastEducation}
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
              Training or Certificates
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontWeight: '600',
                color: AppColors.PROFILE_DETAIL_TEXT,
              }}>
              {profileData.lastTraining}
            </Text>
          </View>
        )}

        {editMode && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: AppDimensions.NORMAL,
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
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.designation}
              onChangeText={onTextChange('designation')}
              // label="Designation"
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
              paddingBottom: AppDimensions.SMALLEST,
            }}>
            <Text
              style={{
                fontSize: moderateScale(14),
                paddingTop: AppDimensions.SMALL,
                fontWeight: '400',
              }}>
              Supervisor
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.supervisor}
              onChangeText={onTextChange('supervisor')}
              // label="Designation"
              placeholder="Supervisor"
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
              Are You On Contract?
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.ifContract}
              onChangeText={onTextChange('ifContract')}
              // label="Designation"
              placeholder="Are You On Contract?"
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
              Contract Period
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.contractPeriod}
              onChangeText={onTextChange('contractPeriod')}
              // label="Designation"
              placeholder="Contract Period"
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
              Department
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.department}
              onChangeText={onTextChange('department')}
              // label="Designation"
              placeholder="Department"
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
              Hired Date
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.hireDate}
              onChangeText={onTextChange('hireDate')}
              // label="Designation"
              placeholder="Hired Date"
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
              CQ Initial
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.cqInitial}
              onChangeText={onTextChange('cqInitial')}
              // label="Designation"
              placeholder="CQ Initial"
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
              Internal Phone Code.
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.internalPhoneCode}
              onChangeText={onTextChange('internalPhoneCode')}
              // label="Designation"
              placeholder="Internal Phone Code"
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
              Internal Phone Code.
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.internalPhoneCode}
              onChangeText={onTextChange('internalPhoneCode')}
              // label="Designation"
              placeholder="Internal Phone Code"
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
              Interviewed By
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.interviewedBy}
              onChangeText={onTextChange('interviewedBy')}
              // label="Designation"
              placeholder="Internal Phone Code"
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
              Till Date Experience
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.tillDateExperience}
              onChangeText={onTextChange('tillDateExperience')}
              // label="Designation"
              placeholder="Internal Phone Code"
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
              Training/Certification
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.lastTraining}
              onChangeText={onTextChange('lastTraining')}
              // label="Designation"
              placeholder="Internal Phone Code"
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
              Education Qualification
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.lastEducation}
              onChangeText={onTextChange('lastEducation')}
              // label="Designation"
              placeholder="Internal Phone Code"
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
              Vehicle Number
            </Text>
            <TextField
              inputTextStyle={{
                color: AppColors.ACCENT,
                textAlign: 'right',
                paddingVertical: AppDimensions.SMALLEST,
                fontSize: moderateScale(14),
              }}
              value={profileData.vehicleNumber}
              onChangeText={onTextChange('vehicleNumber')}
              // label="Designation"
              placeholder="Internal Phone Code"
              editable={editMode}
            />
          </View>
        )}
      </KeyboardAwareScrollView>
      {isAdmin && (
        <EditUpdateButton
          editMode={editMode}
          onPress={() => {
            editMode && updateOfficialProfile();
            setEditMode(!editMode);
          }}
        />
      )}
      <ProgressModal loading={loading} />
    </View>
  );
};

OfficialInfoScreen.propTypes = {
  userDetail: PropTypes.object.isRequired,
};

export default OfficialInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    padding: AppDimensions.SMALL,
  },
});
