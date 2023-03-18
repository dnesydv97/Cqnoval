import {InputItem} from '@ant-design/react-native';
import {Icons, Images} from 'assets';
import {TextField} from 'components';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {AppDimensions, NORMAL_TEXT_STYLE} from 'styles';

const BasicInfoScreen = () => {
  const [profileData, setProfileData] = useState({
    name: 'Yuba Raj Oli',
    email: 'yuba.oli@amniltech.com',
    dob: '2052-02-12',
    gender: 'Male',
    maritalStatus: 'Unmarried',
    spouseName: 'N/A',
    spouseProfession: 'N/A',
    childrensName: 'N/A',
    designation: 'Supervisor',
    permanentAddress: 'Lanti Salyan, Nepal',
    currentAddress: 'Maitidevi, Kathmandu Nepal',
    phoneMobile: '9849774795',
    phoneResidence: '9866905922',
    anniversaryDate: '2077-03-04',
    hobbies: 'Singing, Dancing, Cooking',
    bloodGroup: 'A+',
    allergies: 'N/A',
  });

  const onTextChange = (key) => (value) =>
    setProfileData({
      ...profileData,
      [key]: value,
    });

  return (
    <View style={styles.container}>
      <View style={styles.topInfoContainer}>
        <Image style={styles.icon} source={Images.logo} />
        <TextField
          value={profileData.name}
          onChange={onTextChange('name')}
          placeholder="Full Name"
        />
        <TextField
          value={profileData.phoneMobile}
          onChange={onTextChange('phoneMobile')}
          placeholder="Mobile"
        />
        <TextField
          value={profileData.email}
          onChange={onTextChange('email')}
          placeholder="Email"
        />
        <TextField
          value={profileData.currentAddress}
          onChange={onTextChange('currentAddress')}
          placeholder="Current Address"
        />
      </View>

      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <TextField
          style={styles.text}
          value={profileData.dob}
          onChange={onTextChange('dob')}
          label="Date Of Birth"
        />
        <TextField
          style={styles.text}
          value={profileData.gender}
          onChange={onTextChange('gender')}
          label="Gender"
        />
        <TextField
          style={styles.text}
          value={profileData.bloodGroup}
          onChange={onTextChange('bloodGroup')}
          label="Blood Group"
        />
        <TextField
          style={styles.text}
          value={profileData.allergies}
          onChange={onTextChange('allergies')}
          label="Allergies"
        />
        <TextField
          style={styles.text}
          value={profileData.hobbies}
          onChange={onTextChange('hobbies')}
          label="Hobbies"
        />
        <TextField
          style={styles.text}
          value={profileData.maritalStatus}
          onChange={onTextChange('maritalStatus')}
          label="Marital Status"
        />
        <TextField
          style={styles.text}
          value={profileData.spouseName}
          onChange={onTextChange('spouseName')}
          label="Spouse Name"
        />
        <TextField
          style={styles.text}
          value={profileData.spouseProfession}
          onChange={onTextChange('spouseProfession')}
          label="Spouse Profession"
        />
        <TextField
          style={styles.text}
          value={profileData.childrensName}
          onChange={onTextChange('childrensName')}
          label="Children Name"
        />
        <TextField
          style={styles.text}
          value={profileData.permanentAddress}
          onChange={onTextChange('permanentAddress')}
          label="Permanent Address"
        />
        <TextField
          style={styles.text}
          value={profileData.phoneResidence}
          onChange={onTextChange('phoneResidence')}
          label="Phone (Residence)"
        />
        <TextField
          style={styles.text}
          value={profileData.anniversaryDate}
          onChange={onTextChange('anniversaryDate')}
          label="Anniversary Date"
        />
        <TextField
          style={styles.text}
          value={profileData.spouseName}
          onChange={onTextChange('spouseName')}
          label="Spouse Name"
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default BasicInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topInfoContainer: {
    alignItems: 'center',
    marginBottom: AppDimensions.NORMAL,
  },
  icon: {
    height: moderateVerticalScale(80),
    width: moderateScale(80),
    // alignSelf: 'center',
    marginTop: AppDimensions.NORMAL,
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    padding: AppDimensions.SMALL,
    // borderColor: 'red',
    // borderWidth: 1,
  },
});
