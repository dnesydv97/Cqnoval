import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {
  BaseCard,
  BaseContainer,
  TextField,
  EditUpdateButton,
  ContactItem,
  AddressItem,
  MoreDocumnetPicker,
  ImagePickerItem,
  CircularIconButton,
} from 'components';
import {navScreenNames, screenNames} from 'constant';
import {
  getContactPersonDetail,
  getAllContactLabelGroups,
  getAllContactLabels,
  getAllCountries,
  getAllSearchTags,
  getAllCitiesByCountryId,
  addContactPerson,
  updateContactPerson,
  getDynamicFileLabelTypes,
  getFavOrSearchCompany,
} from 'services';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  LARGE_HEADING_TEXT_SIZE,
  SUB_HEADING_TEXT_STYLE,
} from 'styles';
import {
  getPickerItems,
  navigateToGivenScreenWithParams,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import _ from 'lodash';
import {
  getDefaultUploader,
  getFullAddress,
  getFullFileUrl,
  getInitialUploaderGroup,
  handleDetailDocResponse,
  sendFileToServer,
} from '../functions';
import Autocomplete from 'react-native-autocomplete-input';
import AddButton from '../AddButton';

function getLabelGroup(group, personId) {
  return {
    contactLabelGroupId: group.id,
    contactLabelGroupName: group.name,
    contactComapnyPersonLabelDtos: [],
    isMultipleValuedAllowed: group.isMultipleValuedAllowed,
  };
}
function getAddressGroup(group, personId) {
  return {
    contactLabelGroupId: group.id,
    contactLabelGroupName: group.name,
    addressId: '',
    contactCompanyId: '',
    contactPersonId: personId,
    contactLabelId: '',
    countryId: '',
    cityId: '',
    streetName: '',
    poBox: '',
    stateProvince: '',
    postalCodeZip: '',
    isPrimaryAddress: false,
    isMultipleValuedAllowed: true,
  };
}

const PersonDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {personId} = route?.params;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSetupFinished, setisSetupFinished] = useState(false);
  const [addressLabelGroupId, setAddressLabelGroupId] = useState(null);
  const [preloadedData, setPreloadedData] = useState({
    countries: [],
    contactLabelGroups: [],
    contactLabels: [],
    cities: [],
    tags: [],
    dynamicFileLabelTypes: [],
  });

  const [searchedCompanies, setSearchedCompanies] = useState([]);
  const [companyQuery, setCompanyQuery] = useState('');
  const [personDetail, setPersonDetail] = useState({});
  const [
    contactCompanyLabelGroupDtos,
    setContactCompanyLabelGroupDtos,
  ] = useState([]);
  const [
    contactCompanyAddressDataDtos,
    setContactCompanyAddressDataDtos,
  ] = useState([]);
  const [uploaderGroup, setUploaderGroup] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [profileUrl, setProfileUrl] = useState('');
  const [valueMS, setValueMS] = useState([]);
  const onChangeMS = (value) => {
    setValueMS(value);
  };

  useEffect(() => {
    getRequiredData();
  }, []);

  useEffect(() => {
    personId && getDetail();
    setEditMode(!personId);
  }, [personId, isSetupFinished]);

  useEffect(() => {
    if (profilePic) getFullFileUrl(profilePic.viewFileURL, setProfileUrl);
  }, [profilePic]);

  useEffect(() => {
    companyQuery && searchCompany();
  }, [companyQuery]);

  function editIcon() {
    return personId ? (
      <EditUpdateButton
        editMode={editMode}
        onPress={() => {
          editMode && submitNewPerson(true);
          setEditMode(!editMode);
        }}
      />
    ) : (
      <TouchableOpacity>
        <View>
          <Text
            style={{width: '100%'}}
            type="primary"
            onPress={() => submitNewPerson(false)}>
            Save
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function getRequiredData() {
    Promise.all([
      getAllCountries(),
      getAllContactLabelGroups(),
      getAllContactLabels(),
      getAllSearchTags(),
      getDynamicFileLabelTypes('Contact'),
    ])
      .then((response) => {
        const tempLabelGroup = [];
        const tempAddressGroup = [];
        console.log('Required Data Response ', response);
        setPreloadedData({
          ...preloadedData,
          countries: response[0].data,
          contactLabelGroups: response[1].data,
          contactLabels: response[2].data,
          tags: response[3].data,
          dynamicFileLabelTypes: response[4].data,
        });

        getInitialUploaderGroup(
          response[4].data,
          setProfilePic,
          setUploaderGroup,
        );

        response[1].data.map((group) => {
          if (group.isMultipleValuedAllowed)
            tempAddressGroup.push(getAddressGroup(group, personId));
          else tempLabelGroup.push(getLabelGroup(group, personId));
        });
        setContactCompanyLabelGroupDtos(tempLabelGroup);
        setAddressLabelGroupId(
          tempAddressGroup.length
            ? tempAddressGroup[0].contactLabelGroupId
            : null,
        );
        setisSetupFinished(true);
      })
      .catch(handleError);
  }

  const getDetail = () => {
    setLoading(true);
    getContactPersonDetail(personId)
      .then((response) => {
        setLoading(false);
        console.log('Contact Person Detail Response: ', response);
        if (response.status === 200) {
          updateDataForView(response.data);
        } else {
          setPersonDetail({});
          onError(response.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setPersonDetail({});
        onError(error);
      });
  };

  const updateDataForView = (data) => {
    setPersonDetail(data);
    setContactCompanyAddressDataDtos(data.contactPersonGroupAddressDtos);

    let groupedLabels = _.chain(data.contactPersonGroupLabelDtos)
      .groupBy('contactLabelGroupId')
      .value();

    contactCompanyLabelGroupDtos.map((group) => {
      let tempLabels = groupedLabels[group.contactLabelGroupId] || [];
      group.contactComapnyPersonLabelDtos.push(...tempLabels);
    });

    // setContactCompanyLabelGroupDtos([...contactCompanyLabelGroupDtos]);
    setValueMS(data.tagNames ? data.tagNames.split(',') : []);
    handleDetailDocResponse(
      preloadedData.dynamicFileLabelTypes,
      data.uploadedFileDtos,
      setProfilePic,
      setUploaderGroup,
    );
  };

  const submitNewPerson = (isUpdate = false) => {
    setLoading(true);
    const tempCompanyGroupLabelList = [];
    contactCompanyLabelGroupDtos.map((item) => {
      tempCompanyGroupLabelList.push.apply(
        tempCompanyGroupLabelList,
        item.contactComapnyPersonLabelDtos,
      );
    });

    const personLabelsValidList = tempCompanyGroupLabelList.filter(
      (item) =>
        item.contactLabelId !== '' && item.contactLabelDataValue !== null,
    );
    const personAddressValidList = contactCompanyAddressDataDtos.filter(
      (item) =>
        item.contactLabelId !== '' &&
        item.countryId !== null &&
        item.cityId !== null,
    );

    const fileList = [];

    Object.keys(uploaderGroup).map((key) =>
      fileList.push(...uploaderGroup[key]),
    );

    const validFileList = fileList.filter((item) => item.viewFileURL !== '');
    profilePic &&
      profilePic.viewFileURL !== '' &&
      profilePic.displayFileName !== '' &&
      validFileList.push(profilePic);

    const data = {
      ...personDetail,
      contactPersonGroupLabelDtos: personLabelsValidList,
      contactPersonGroupAddressDtos: personAddressValidList,
      uploadedFileDtos: validFileList,
      tagNames: valueMS.toString(),
      isActive: true,
      isQuickEntry: false,
    };

    console.log('Person data to be sent to server ', data);

    isUpdate
      ? updateContactPerson(data, personId)
          .then((response) => {
            setLoading(false);
            console.log('Update Person response ', response);
            if (response.status === 200) {
              showSuccessToast('Person is Sucessfully Updated.');
              updateDataForView(response.data);
            } else showFailToast('Failed to add person.');
          })
          .catch((error) => {
            setLoading(false);
            showFailToast('Failed to add person.');
            onError(error);
          })
      : addContactPerson(data)
          .then((response) => {
            setLoading(false);
            console.log('Add Person response ', response);
            if (response.status === 200) {
              showSuccessToast('Person is Sucessfully Added.');
              navigateToGivenScreenWithParams(
                navigation,
                navScreenNames.NAV_PERSON_SCREEN,
                {
                  id: response.data.id,
                  fullName: `${response.data.firstName} ${response.data.middleName} ${response.data.lastName}`,
                },
              );
            } else showFailToast('Failed to add person.');
          })
          .catch((error) => {
            setLoading(false);
            showFailToast('Failed to add person.');
            onError(error);
          });
  };

  function handleError(error) {
    setLoading(false);
    onError(error);
  }

  const onTextChange = (key) => (value) =>
    setPersonDetail({
      ...personDetail,
      [key]: value,
    });

  const onItemAdd = (contactLabelGroupId, type) => {
    if (type === 'address') {
      contactCompanyAddressDataDtos.push({
        contactLabelGroupId,
        contactLabelId: '',
        contactLabelName: '',
        contactLabelDataValue: '',
        contactPersonId: personId,
      });
      setContactCompanyAddressDataDtos([...contactCompanyAddressDataDtos]);
    } else if (type === 'contact') {
      contactCompanyLabelGroupDtos.map((item) => {
        if (item.contactLabelGroupId === contactLabelGroupId) {
          item.contactComapnyPersonLabelDtos.push({
            contactLabelId: '',
            contactLabelName: '',
            contactLabelDataValue: '',
            contactPersonId: personId,
          });
          setContactCompanyLabelGroupDtos([...contactCompanyLabelGroupDtos]);
        }
      });
    }
  };

  const onItemDel = (contactLabelGroupId, index, type) => {
    if (index !== -1) {
      if (type === 'address') {
        contactCompanyAddressDataDtos.splice(index, 1);
        setContactCompanyAddressDataDtos([...contactCompanyAddressDataDtos]);
      } else if (type === 'contact') {
        contactCompanyLabelGroupDtos.map((item) => {
          if (item.contactLabelGroupId === contactLabelGroupId) {
            item.contactComapnyPersonLabelDtos.splice(index, 1);
            setContactCompanyLabelGroupDtos([...contactCompanyLabelGroupDtos]);
          }
        });
      } else if (type === 'document') {
        const tempArray = uploaderGroup[contactLabelGroupId];
        if (
          !!tempArray[index] &&
          !!tempArray[index].viewFileURL &&
          !!tempArray[index].displayFileName
        )
          tempArray[index].isActive = false;

        setUploaderGroup({
          ...uploaderGroup,
          [contactLabelGroupId]: tempArray,
        });
      }
    }
  };

  function onLabelChanged(contactLabelGroupId, labelIndex, contactLabelId) {
    const contactLabelItem = preloadedData.contactLabels.find(
      (item) => item.id === contactLabelId,
    );
    contactCompanyLabelGroupDtos.map((item, index) => {
      if (item.contactLabelGroupId === contactLabelGroupId) {
        item.contactComapnyPersonLabelDtos[
          labelIndex
        ].contactLabelId = contactLabelId;
        contactLabelItem
          ? (item.contactComapnyPersonLabelDtos[labelIndex].contactLabelName =
              contactLabelItem.name)
          : null;

        setContactCompanyLabelGroupDtos([...contactCompanyLabelGroupDtos]);
      }
    });
  }

  function onValueChanged(contactLabelGroupId, index, value) {
    contactCompanyLabelGroupDtos.map((item) => {
      if (item.contactLabelGroupId === contactLabelGroupId) {
        item.contactComapnyPersonLabelDtos[index].contactLabelDataValue = value;
        setContactCompanyLabelGroupDtos([...contactCompanyLabelGroupDtos]);
      }
    });
  }

  function onAddressChanged(index, key, value) {
    if (key === 'countryId') getCitiesByCountryId(value);
    contactCompanyAddressDataDtos[index][key] = value;
    setContactCompanyAddressDataDtos([...contactCompanyAddressDataDtos]);
  }

  function getLabels(contactLabelGroupId) {
    const labels = [];
    preloadedData.contactLabels.map((item) => {
      if (item.contactLabelGroupId === contactLabelGroupId)
        return labels.push({
          label: item.name,
          value: item.id,
        });
    });
    return labels;
  }

  function getCitiesByCountryId(CountryId) {
    setLoading(true);
    getAllCitiesByCountryId(CountryId)
      .then((response) => {
        console.log('Response of cities ', response);
        setLoading(false);
        if (response.status === 200)
          setPreloadedData({
            ...preloadedData,
            cities: response.data,
          });
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  function onDocumentUploaded(uploaderGroupName, responseObj) {
    const tempArray = uploaderGroup[uploaderGroupName];
    tempArray.unshift(responseObj);
    setUploaderGroup({
      ...uploaderGroup,
      [uploaderGroupName]: tempArray,
    });
  }

  function searchCompany() {
    getFavOrSearchCompany(companyQuery, 0)
      .then((response) => {
        console.log('Search companies response ', response);
        if (response.status === 200) setSearchedCompanies(response.data.items);
      })
      .catch((error) => {
        setSearchedCompanies([]);
        onError(error);
      });
  }

  return (
    <BaseContainer
      toolbarTitle={personId ? ' ' : 'New Person'}
      toolbarRightIcon={editIcon}
      scrollable>
      <View>
        <View style={styles.imageContainer}>
          <ImagePickerItem
            isRound
            onImageSelected={sendFileToServer(
              'Profile',
              setLoading,
              preloadedData.dynamicFileLabelTypes,
              setProfilePic,
              onDocumentUploaded,
            )}
            imageUri={profileUrl}
          />
        </View>
        {!editMode && (
          <View style={styles.topInfoContainer}>
            <View style={styles.nameStarContainer}>
              <Text style={styles.nameStyle}>{`${personDetail.firstName} ${
                personDetail.middleName ? personDetail.middleName + ' ' : ''
              }${personDetail.lastName}`}</Text>
              <Text style={styles.nicknameContainer}>
                "{`${personDetail.nickName}`}"
              </Text>
              <Text
                style={
                  styles.designationNameContainer
                }>{`${personDetail.designationName} - ${personDetail.departmentName}`}</Text>
              <Text style={styles.designationNameContainer}>{`${
                personDetail.companyName ?? 'Company'
              }`}</Text>
            </View>
          </View>
        )}
        {editMode && (
          <BaseCard containerStyle={styles.baseCardContainer}>
            <View>
              <TextField
                placeholder="First Name"
                editable={editMode}
                value={personDetail.firstName}
                onChangeText={onTextChange('firstName')}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Middle Name"
                editable={editMode}
                value={personDetail.middleName}
                onChangeText={onTextChange('middleName')}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Last Name"
                editable={editMode}
                value={personDetail.lastName}
                onChangeText={onTextChange('lastName')}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Nick Name"
                editable={editMode}
                value={personDetail.nickName}
                onChangeText={onTextChange('nickName')}
                containerStyle={{
                  ...styles.textFieldContainer,
                  borderBottomWidth: 0,
                }}
              />
            </View>
          </BaseCard>
        )}
        {editMode && (
          <BaseCard containerStyle={styles.baseCardContainer}>
            <View>
              <Autocomplete
                renderTextInput={(props) => (
                  <TextInput
                    {...props}
                    style={{
                      ...props.style,
                      ...styles.autoCompleteInputText,
                    }}
                  />
                )}
                inputContainerStyle={{
                  borderWidth: 0,
                  ...styles.textFieldContainer,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
                data={
                  searchedCompanies?.length === 1 &&
                  searchedCompanies[0].contactCompanyName === companyQuery
                    ? [] // Close suggestion list in case movie title matches query
                    : searchedCompanies
                }
                placeholder="Company Name"
                value={companyQuery || personDetail.companyName}
                onChangeText={setCompanyQuery}
                flatListProps={{
                  keyboardShouldPersistTaps: 'always',
                  keyExtractor: (_, idx) => idx,
                  renderItem: ({item}) => {
                    let companyName = item.contactCompanyName;
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          onTextChange('companyName')(companyName);
                          setCompanyQuery(companyName);
                        }}
                        activeOpacity={0.7}
                        style={{padding: AppDimensions.SMALL}}>
                        <Text style={{...NORMAL_TEXT_STYLE}}>
                          {companyName}
                        </Text>
                      </TouchableOpacity>
                    );
                  },
                }}
              />
              <TextField
                placeholder="Designation"
                editable={editMode}
                value={personDetail.designationName}
                onChangeText={onTextChange('designationName')}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Department"
                editable={editMode}
                value={personDetail.departmentName}
                onChangeText={onTextChange('departmentName')}
                containerStyle={[
                  styles.textFieldContainer,
                  {borderBottomWidth: 0},
                ]}
              />
            </View>
          </BaseCard>
        )}
        <View>
          {contactCompanyLabelGroupDtos.map((group, index) => {
            return group.contactComapnyPersonLabelDtos.filter(
              (item) => item.contactLabelDataValue !== null,
            ).length > 0 || editMode ? (
              <BaseCard
                key={String(index)}
                containerStyle={styles.baseCardContainer}>
                {group.contactComapnyPersonLabelDtos
                  .filter((item) => editMode || !!item.contactLabelDataValue)
                  .map((item, index) => {
                    console.log('Contact Item ', item);
                    return (
                      <View>
                        <ContactItem
                          key={String(index)}
                          labels={getLabels(group.contactLabelGroupId)}
                          labelValue={item.contactLabelId}
                          value={item.contactLabelDataValue}
                          valuePlaceholder="Type Here"
                          addMoreMsg={group.contactLabelGroupName}
                          labelInputContainer={{width: '100%'}}
                          valueInputContainer={{
                            width: editMode ? '60%' : '100%',
                          }}
                          onLabelChanged={(label) =>
                            onLabelChanged(
                              group.contactLabelGroupId,
                              index,
                              label,
                            )
                          }
                          hasAddMore={
                            index ===
                            group.contactComapnyPersonLabelDtos.length - 1
                          }
                          onValueChanged={(value) =>
                            onValueChanged(
                              group.contactLabelGroupId,
                              index,
                              value,
                            )
                          }
                          onAdd={() =>
                            onItemAdd(group.contactLabelGroupId, 'contact')
                          }
                          onRemove={() =>
                            onItemDel(
                              group.contactLabelGroupId,
                              index,
                              'contact',
                            )
                          }
                          editable={editMode}
                          itemIndex={index}
                          isLastItem={
                            group.contactComapnyPersonLabelDtos.filter(
                              (item) => !!item.contactLabelDataValue,
                            ).length -
                              1 ===
                            index
                          }
                        />
                      </View>
                    );
                  })}
                {editMode && (
                  <AddButton
                    title={`Add ${group.contactLabelGroupName}`}
                    onPress={() =>
                      onItemAdd(group.contactLabelGroupId, 'contact')
                    }
                  />
                )}
              </BaseCard>
            ) : null;
          })}
        </View>

        {(editMode ||
          !!contactCompanyAddressDataDtos.filter(
            (item) =>
              editMode ||
              (!!item.streetName &&
                !!item.cityName &&
                !!item.stateProvince &&
                !!item.countryName),
          ).length) && (
          <BaseCard containerStyle={styles.baseCardContainer}>
            {contactCompanyAddressDataDtos
              .filter(
                (item) =>
                  editMode ||
                  (!!item.streetName &&
                    !!item.cityName &&
                    !!item.stateProvince &&
                    !!item.countryName),
              )
              .map((item, index) => {
                return (
                  <AddressItem
                    key={String(index)}
                    labels={getLabels(item.contactLabelGroupId, preloadedData)}
                    countryList={getPickerItems(
                      preloadedData.countries,
                      'name',
                      'id',
                    )}
                    fullAddress={getFullAddress(
                      item.streetName,
                      item.cityName,
                      item.postalCodeZip,
                      item.stateProvince,
                      item.countryName,
                    )}
                    cities={getPickerItems(preloadedData.cities, 'name', 'id')}
                    labelValue={item.contactLabelId}
                    streetValue={item.streetName}
                    cityValue={item.cityId}
                    postalValue={item.postalCodeZip}
                    stateValue={item.stateProvince}
                    countryValue={item.countryId}
                    checked={item.isPrimaryAddress}
                    hasAddMore={
                      index === contactCompanyAddressDataDtos.length - 1
                    }
                    labelInputContainer={{width: '100%'}}
                    valueInputContainer={{width: '60%'}}
                    onStreetChanged={(value) =>
                      onAddressChanged(index, 'streetName', value)
                    }
                    onLabelChanged={(label) =>
                      onAddressChanged(index, 'contactLabelId', label)
                    }
                    onCountryChanged={(value) =>
                      onAddressChanged(index, 'countryId', value)
                    }
                    onCityChanged={(value) =>
                      onAddressChanged(index, 'cityId', value)
                    }
                    onPostalChanged={(value) =>
                      onAddressChanged(index, 'postalCodeZip', value)
                    }
                    onStateChanged={(value) =>
                      onAddressChanged(index, 'stateProvince', value)
                    }
                    onChecked={(event) =>
                      onAddressChanged(
                        index,
                        'isPrimaryAddress',
                        event.target.checked,
                      )
                    }
                    onAdd={() => onItemAdd(item.contactLabelGroupId, 'address')}
                    onRemove={() => onItemDel('', index, 'address')}
                    editable={editMode}
                    itemIndex={index}
                    isLastItem={
                      contactCompanyAddressDataDtos.filter(
                        (item) =>
                          !!item.streetName &&
                          !!item.cityName &&
                          !!item.stateProvince &&
                          !!item.countryName,
                      ).length -
                        1 ===
                      index
                    }
                  />
                );
              })}
            {editMode && (
              <AddButton
                title="Add Address"
                onPress={() => onItemAdd(addressLabelGroupId, 'address')}
              />
            )}
          </BaseCard>
        )}
        <BaseCard containerStyle={styles.baseCardContainer}>
          {!editMode && !!personDetail.dateOfBirth && (
            <View style={styles.nonEditableContainer}>
              <Text style={styles.nonEditableHeading}>birthday</Text>
              <Text
                style={
                  styles.nonEditableText
                }>{`${personDetail.dateOfBirth}`}</Text>
            </View>
          )}
          {editMode && (
            <View style={styles.birthdayLabel}>
              <Text style={styles.labelContainer}>birthday</Text>
              <TextField
                placeholder="DD/MM/YYYY"
                editable
                value={personDetail.dateOfBirth}
                onChangeText={onTextChange('dateOfBirth')}
              />
            </View>
          )}
          {!editMode && !!personDetail.maritalStatusName && (
            <View style={styles.nonEditableContainer}>
              <Text style={styles.nonEditableHeading}>civil status</Text>
              <Text
                style={
                  styles.nonEditableText
                }>{`${personDetail.maritalStatusName}`}</Text>
            </View>
          )}
          {editMode && (
            <View style={styles.labelTopContainer}>
              <Text style={styles.labelContainer}>civil status</Text>
              <TextField
                placeholder="civil status"
                value={personDetail.civilStatus}
                onChangeText={onTextChange('civilStatus')}
                editable
              />
            </View>
          )}
          {!editMode && personDetail.genderName && (
            <View style={styles.nonEditableContainer}>
              <Text style={styles.nonEditableHeading}>gender</Text>
              <Text
                style={
                  styles.nonEditableText
                }>{`${personDetail.genderName}`}</Text>
            </View>
          )}
          {editMode && (
            <View style={styles.labelTopContainer}>
              <Text style={styles.labelContainer}>gender</Text>
              <TextField
                placeholder="select your gender"
                containerStyle={{}}
                editable
                value={personDetail.genderName}
                onChangeText={onTextChange('genderName')}
              />
            </View>
          )}
          {!editMode && !!personDetail.hobbies && (
            <View>
              <Text style={styles.nonEditableHeading}>hobbies</Text>
              <Text
                style={
                  styles.nonEditableText
                }>{`${personDetail.hobbies}`}</Text>
            </View>
          )}
          {!editMode && !!personDetail.anniversaryDate && (
            <View>
              <Text style={styles.nonEditableHeading}>anniversary</Text>
              <Text
                style={
                  styles.nonEditableText
                }>{`${personDetail.anniversaryDate}`}</Text>
            </View>
          )}
          {editMode && (
            <View style={[styles.nonEditableContainer, {flexDirection: 'row'}]}>
              <Text style={styles.labelContainer}>hobbies</Text>
              <TextField
                placeholder="your hobbies"
                containerStyle={{}}
                editable
                value={personDetail.hobbies}
                onChangeText={onTextChange('hobbies')}
              />
            </View>
          )}
          {editMode && (
            <View
              style={[
                styles.nonEditableContainer,
                {flexDirection: 'row', borderBottomWidth: 0},
              ]}>
              <Text style={styles.labelContainer}>anniversary</Text>
              <TextField
                placeholder="anniversary"
                containerStyle={{}}
                editable
                value={personDetail.anniversaryDate}
                onChangeText={onTextChange('anniversaryDate')}
              />
            </View>
          )}
        </BaseCard>
        {(editMode ||
          (!!personDetail.uploadedFileDtos?.length && !!setProfilePic &&
            personDetail.uploadedFileDtos.length > 1)) && (
          <BaseCard containerStyle={styles.baseCardContainer}>
            {Object.keys(uploaderGroup).map((key, index) => {
              let uploaders = uploaderGroup[key];
              console.log('Documenst ', uploaders);
              return (
                <>
                  {uploaders.map((item, index) =>
                    item.isActive && 
                      (editMode ? true : item.viewFileURL ? true : false) ? 
                        (
                          //Need to optimize this section
                          <MoreDocumnetPicker
                            key={String(index)}
                            editable={editMode}
                            uri={item.viewFileURL}
                            name={item.displayFileName}
                            isLastItem={index === uploaders.length - 1}
                            onMinusPressed={() =>
                              onItemDel(key, index, 'document')
                            }
                            onItemSelected={sendFileToServer(
                              key,
                              setLoading,
                              preloadedData.dynamicFileLabelTypes,
                              setProfileUrl,
                              onDocumentUploaded,
                            )}
                          />
                        ) : null,
                  )}
                </>
              );
            })}
          </BaseCard>
        )}

        {(editMode || !!personDetail.notes) && (
          <BaseCard containerStyle={styles.baseCardContainer}>
            {!editMode ? (
              <View>
                <Text style={styles.nonEditableHeading}>Notes</Text>
                <TextField
                  editMode={editMode}
                  value={personDetail.notes}
                  multiline
                  inputTextStyle={{
                    ...styles.nonEditableText,
                  }}
                />
              </View>
            ) : (
              <View style={{flexDirection: 'column', borderBottomWidth: 0.4}}>
                <Text style={styles.noteLabel}>Notes</Text>
                <TextField
                  placeholder="notes"
                  editable={editMode}
                  value={personDetail.notes}
                  onChangeText={onTextChange('notes')}
                  multiline={true}
                  numberOfLines={4}
                  containerStyle={{marginLeft: 5}}
                />
              </View>
            )}
          </BaseCard>
        )}
      </View>
    </BaseContainer>
  );
};

PersonDetailScreen.propTypes = {
  personId: PropTypes.string,
};

export default PersonDetailScreen;

const styles = StyleSheet.create({
  basicCardTopView: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: AppDimensions.NORMAL,
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseCardContainer: {
    marginBottom: AppDimensions.MODERATE,
  },
  textFieldContainer: {
    height: moderateScale(44),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.LIGHT_GRAY,
  },
  topInfoContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: AppDimensions.MODERATE,
    marginVertical: AppDimensions.NORMAL,
  },
  profilePic: {
    height: moderateVerticalScale(80),
    width: moderateScale(80),
    borderRadius: moderateVerticalScale(80 / 2),
    marginEnd: AppDimensions.NORMAL,
  },
  basicCardBody: {
    paddingVertical: AppDimensions.NORMAL,
    flex: 1,
    flexDirection: 'column',
  },
  basicCardFooter: {
    borderTopWidth: 1,
    alignItems: 'center',
  },
  abbrContainer: {
    marginHorizontal: AppDimensions.LARGE,
  },
  headerText: {
    ...LARGE_HEADING_TEXT_SIZE,
    paddingHorizontal: AppDimensions.MODERATE,
    paddingVertical: AppDimensions.SMALL,
    color: AppColors.TITLE,
  },
  headingText: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: AppDimensions.MODERATE,
    color: AppColors.ACCENT,
  },
  text: {
    width: '45%',
    fontSize: 18,
  },
  bottomBorder: {
    borderBottomWidth: 0,
  },
  noBottomBorder: {
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  nonEditableHeading: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    flex: 0.7,
    fontWeight: 'bold',
    marginHorizontal: AppDimensions.NORMAL,
    paddingVertical: AppDimensions.SMALL,
  },
  nonEditableText: {
    color: AppColors.ACCENT,
    marginHorizontal: AppDimensions.SMALL,
    paddingBottom: AppDimensions.NORMAL,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  roundButton: {
    borderWidth: 0.5,
    borderColor: AppColors.TAG_GREEN,
    marginVertical: AppDimensions.NORMAL,
    height: moderateScale(20),
    width: moderateScale(20),
  },
  nameStarContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameStyle: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: moderateScale(17),
  },
  nicknameContainer: {
    color: '#828282',
    fontSize: moderateScale(13),
  },
  designationNameContainer: {
    color: '#4F4F4F',
    fontSize: moderateScale(15),
    fontWeight: '500',
  },
  nonEditableContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.LIGHT_GRAY,
  },
  labelContainer: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    fontWeight: 'bold',
    width: moderateScale(90),
    marginHorizontal: AppDimensions.MODERATE,
    marginVertical: AppDimensions.NORMAL,
  },
  labelTopContainer: {
    flexDirection: 'row',
    borderBottomWidth: 0.4,
  },
  noteLabel: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    textAlign: 'auto',
    alignContent: 'flex-start',
    fontWeight: 'bold',
    marginHorizontal: AppDimensions.NORMAL,
  },
  birthdayLabel: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.UTIL,
  },
  autoCompleteInputText: {
    ...NORMAL_TEXT_STYLE,
    height: '100%',
    textAlignVertical: 'center',
    paddingHorizontal: AppDimensions.SMALL,
  },
});
