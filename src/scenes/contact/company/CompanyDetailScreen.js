import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {
  BaseCard,
  BaseContainer,
  TextField,
  EditUpdateButton,
  ContactItem,
  AddressItem,
  MoreDocumnetPicker,
  ImagePickerItem,
  PickerView,
} from 'components';
import {messages, navScreenNames, screenNames} from 'constant';
import {
  getAllContactLabelGroups,
  getAllContactLabels,
  getAllCountries,
  getAllSearchTags,
  getContactCompanyDetail,
  updateContactCompany,
  addContactCompany,
  getDynamicFileLabelTypes,
  getAllContactSources,
  addRemoveContactCompanyAsFav,
} from 'services';
import {AppColors, AppDimensions, NORMAL_TEXT_STYLE} from 'styles';
import {
  getPickerItems,
  navigateToGivenScreenWithParams,
  onError,
  showFailToast,
  showSuccessToast,
  isFormFilled,
} from 'utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import _ from 'lodash';
import {
  getCitiesByCountryId,
  sendFileToServer,
  getLabels,
  getFullFileUrl,
  getLabelGroup,
  getAddressGroup,
  getDefaultUploader,
  getInitialUploaderGroup,
  handleDetailDocResponse,
  getFullAddress,
} from '../functions';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import AddButton from '../AddButton';
import VerticleSeparator from './VerticleSeparator';
import SowSelector from './SowSelector';

const CompanyDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {companyId, isFavourite} = route?.params;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSetupFinished, setisSetupFinished] = useState(false);
  const [isFav, setIsFav] = useState(isFavourite);
  const [logoUrl, setLogoUrl] = useState('');
  const [preloadedData, setPreloadedData] = useState({
    countries: [],
    contactLabelGroups: [],
    contactLabels: [],
    cities: [],
    tags: [],
    dynamicFileLabelTypes: [],
    contactSources: [],
  });
  const [sow, setSow] = useState([]);
  const [companyDetail, setCompanyDetail] = useState({});
  const [
    contactCompanyLabelGroupDtos,
    setContactCompanyLabelGroupDtos,
  ] = useState([]);
  const [
    contactCompanyAddressDataDtos,
    setContactCompanyAddressDataDtos,
  ] = useState([]);
  const [addressLabelGroupId, setAddressLabelGroupId] = useState(null);
  const [uploaderGroup, setUploaderGroup] = useState({});
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    companyId && getDetail();
    setEditMode(!companyId);
  }, [companyId, isSetupFinished]);

  useEffect(() => {
    getRequiredData();
  }, []);

  useEffect(() => {
    if (logo) getFullFileUrl(logo.viewFileURL, setLogoUrl);
  }, [logo]);

  useEffect(() => {
    setIsFav(isFavourite);
  }, [isFavourite]);

  function getRequiredData() {
    Promise.all([
      getAllCountries(),
      getAllContactLabelGroups(),
      getAllContactLabels(),
      getAllSearchTags(),
      getDynamicFileLabelTypes('Contact'),
      getAllContactSources(),
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
          contactSources: response[5].data,
        });

        response[1].data.map((group) => {
          if (group.isMultipleValuedAllowed)
            tempAddressGroup.push(getAddressGroup(group, companyId));
          else tempLabelGroup.push(getLabelGroup(group, companyId));
        });
        getInitialUploaderGroup(response[4].data, setLogo, setUploaderGroup);

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
    getContactCompanyDetail(companyId)
      .then((response) => {
        setLoading(false);
        console.log('Contact Company Detail Response: ', response);
        if (response.status === 200) {
          updateDataForView(response.data);
        } else {
          setCompanyDetail({});
          onError(response.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setCompanyDetail({});
        onError(error);
      });
  };

  const updateDataForView = (data) => {
    setCompanyDetail(data);
    setContactCompanyAddressDataDtos(data.contactCompanyGroupAddressDtos);
    let groupedLabels = _.chain(data.contactCompanyGroupLabelDtos)
      .groupBy('contactLabelGroupId')
      .value();

    contactCompanyLabelGroupDtos.map((group) => {
      let tempLabels = groupedLabels[group.contactLabelGroupId] || [];
      group.contactComapnyPersonLabelDtos.push(...tempLabels);
    });
    handleDetailDocResponse(
      preloadedData.dynamicFileLabelTypes,
      data.uploadedFileDtos,
      setLogo,
      setUploaderGroup,
    );
  };

  const submitNewCompany = (isUpdate = false) => {
    setLoading(true);
    const response = isFormFilled(companyDetail);
    console.log(response);
    const tempCompanyGroupLabelList = [];
    contactCompanyLabelGroupDtos.map((item) => {
      tempCompanyGroupLabelList.push.apply(
        tempCompanyGroupLabelList,
        item.contactComapnyPersonLabelDtos,
      );
    });

    const companyLabelsValidList = tempCompanyGroupLabelList.filter(
      (item) => !!item.contactLabelId && !!item.contactLabelDataValue,
    );
    const companyAddressValidList = contactCompanyAddressDataDtos.filter(
      (item) => !!item.contactLabelId && !!item.countryId && !!item.cityId,
    );

    const fileList = [];

    Object.keys(uploaderGroup).map((key) =>
      fileList.push(...uploaderGroup[key]),
    );

    const validFileList = fileList.filter(
      (item) => item.viewFileURL !== '' && item.displayFileName !== '',
    );
    logo &&
      logo.viewFileURL !== '' &&
      logo.displayFileName !== '' &&
      validFileList.push(logo);

      let newString = sow.join(', ');
    // let newString = sow.join(', ').replaceAll('  ', ''); while using this code Marshmellow Os in android doesnot support
  

    const data = {
      ...companyDetail,
      contactCompanyGroupLabelDtos: companyLabelsValidList,
      contactCompanyGroupAddressDtos: companyAddressValidList,
      uploadedFileDtos: validFileList,
      scopeOfWork: newString,
      isActive: true,
      isQuickEntry: false,
    };

    console.log('Company Data for server ', data);

    isUpdate
      ? updateContactCompany(data, companyId)
          .then((response) => {
            setLoading(false);
            console.log('Update Company response ', response);
            if (response.status === 200) {
              showSuccessToast('Company is Sucessfully Updated.');
              updateDataForView(response.data);
            } else showFailToast('Failed to add company.');
          })
          .catch((error) => {
            console.log('Update Company response ', response);
            setLoading(false);
            showFailToast('Please fill up all information.');
            onError(error);
          })
      : addContactCompany(data)
          .then((response) => {
            setLoading(false);
            console.log('Add Company response ', response);
            if (response.status === 200) {
              showSuccessToast('Company is Sucessfully Added.');
              navigateToGivenScreenWithParams(
                navigation,
                navScreenNames.NAV_COMPANY_SCREEN,
                {
                  isFavorite: false,
                  contactCompanyId: response.data.id,
                  contactCompanyName: `${response.data.firstName} ${response.data.middleName} ${response.data.lastName}`,
                },
              );
            } else showFailToast('Failed to add company.');
          })
          .catch((error) => {
            setLoading(false);
            showFailToast('Failed to add company.');
            onError(error);
          });
  };

  function handleError(error) {
    setLoading(false);
    onError(error);
  }

  function editIcon() {
    return companyId ? (
      <EditUpdateButton
        editMode={editMode}
        onPress={() => {
          editMode && submitNewCompany(true);
          setEditMode(!editMode);
        }}
      />
    ) : (
      <EditUpdateButton
        editMode={true}
        onPress={() => submitNewCompany(false)}
      />
    );
  }

  const onTextChange = (key) => (value) =>
    setCompanyDetail({
      ...companyDetail,
      [key]: value,
    });

  const onItemAdd = (contactLabelGroupId, type) => {
    if (type === 'address') {
      contactCompanyAddressDataDtos.push({
        contactLabelGroupId,
        contactLabelId: '',
        contactLabelName: '',
        contactLabelDataValue: '',
        contactCompanyId: companyId,
      });
      setContactCompanyAddressDataDtos([...contactCompanyAddressDataDtos]);
    } else if (type === 'contact') {
      contactCompanyLabelGroupDtos.map((item) => {
        if (item.contactLabelGroupId === contactLabelGroupId) {
          item.contactComapnyPersonLabelDtos.push({
            contactLabelId: '',
            contactLabelName: '',
            contactLabelDataValue: '',
            contactCompanyId: companyId,
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
    if (key === 'countryId')
      getCitiesByCountryId(value, setLoading, setPreloadedData, preloadedData);

    contactCompanyAddressDataDtos[index][key] = value;
    setContactCompanyAddressDataDtos([...contactCompanyAddressDataDtos]);
  }

  function onDocumentUploaded(uploaderGroupName, responseObj) {
    const tempArray = uploaderGroup[uploaderGroupName];
    tempArray.unshift(responseObj);
    setUploaderGroup({
      ...uploaderGroup,
      [uploaderGroupName]: tempArray,
    });
  }

  const onFavPressed = (value) => {
    setLoading(true);
    addRemoveContactCompanyAsFav(companyId)
      .then((response) => {
        setLoading(false);
        console.log('Add Remove Company To Favourite response', response);
        if (response.status === 200) {
          setIsFav(value);
        } else showFailToast(messages.FAILED_TO_ADD_FAV);
      })
      .catch((error) => {
        onError(error);
        setLoading(false);
      });
  };

  const onPersonsClicked = () =>
    navigation.navigate(navScreenNames.NAV_COMPANY_PERSONS_SCREEN, {
      companyName: companyDetail.companyName,
    });

  return (
    <BaseContainer
      toolbarTitle={companyId ? '' : 'New Company'}
      toolbarRightIcon={editIcon}
      loading={loading}
      scrollable>
      <View>
        <View style={styles.imageContainer}>
          <ImagePickerItem
            isRound={false}
            onImageSelected={sendFileToServer(
              'Profile',
              setLoading,
              preloadedData.dynamicFileLabelTypes,
              setLogo,
              onDocumentUploaded,
            )}
            imageUri={logoUrl}
          />
        </View>
        {!editMode && (
          <View style={styles.topInfoContainer}>
            {`${companyDetail.companyName}` != '' && (
              <>
                <View style={styles.nameStarContainer}>
                  <Text style={styles.nameStyle}>
                    {`${companyDetail.companyName}`}
                  </Text>
                  <View style={styles.starContainer}>
                    {isFav ? (
                      <IconFill
                        name="star"
                        size={moderateScale(30)}
                        onPress={() => onFavPressed(false)}
                        color={AppColors.FAV_LIST_COLOR}
                      />
                    ) : (
                      <IconOutline
                        name="star"
                        onPress={() => onFavPressed(true)}
                        size={moderateScale(30)}
                        color={AppColors.UTIL}
                      />
                    )}
                  </View>
                </View>
                <Text style={[styles.nameStyle, styles.zeroPadding]}>
                  {`(${companyDetail?.companyAbbrevation || '...'})`}
                </Text>
              </>
            )}
            <View style={styles.nameStarContainer}>
              {`${companyDetail.scopeOfWork}` != '' && (
                <Text style={styles.normalText}>
                  {`${companyDetail.scopeOfWork}`}
                </Text>
              )}
              <TouchableOpacity
                onPress={onPersonsClicked}
                style={styles.personIcon}>
                <IconOutline
                  name="team"
                  onPress={onPersonsClicked}
                  size={moderateScale(25)}
                  color={AppColors.ACCENT}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {editMode && (
          <BaseCard containerStyle={styles.baseCardContainer}>
            <View>
              <TextField
                placeholder="Company"
                editable={editMode}
                value={companyDetail.companyName}
                onChangeText={onTextChange('companyName')}
                inputTextContainerStyle={{
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
              <TextField
                placeholder="Abbreviation"
                editable={editMode}
                value={companyDetail.companyAbbrevation}
                onChangeText={onTextChange('companyAbbrevation')}
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
                    return (
                      <ContactItem
                        key={String(index)}
                        labels={getLabels(
                          group.contactLabelGroupId,
                          preloadedData,
                        )}
                        labelValue={item.contactLabelId}
                        addMoreMsg={group.contactLabelGroupName}
                        value={item.contactLabelDataValue}
                        isLastItem={
                          group.contactComapnyPersonLabelDtos.filter(
                            (item) => !!item.contactLabelDataValue,
                          ).length -
                            1 ===
                          index
                        }
                        valuePlaceholder="Type Here"
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
                          onItemDel(group.contactLabelGroupId, index, 'contact')
                        }
                        editable={editMode}
                        itemIndex={index}
                      />
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

        <BaseCard containerStyle={styles.baseCardContainer}>
          {editMode && (
            <View style={styles.editRow}>
              <Text style={styles.editRowLabel}>SOW</Text>
              <VerticleSeparator style={{height: '100%'}} />
              <SowSelector
                editable={editMode}
                onTagsChanged={setSow}
                initialTags={companyDetail.scopeOfWork}
              />
            </View>
          )}
          {!editMode && (
            <View>
              <Text style={styles.viewRowLabel}>Source</Text>
              <Text style={styles.viewRowValue}>{`${companyDetail.contactSourceId}`}</Text>
            </View>
          )}

          {editMode && (
            <View style={styles.editRow}>
              <Text style={styles.editRowLabel}>Source</Text>
              <VerticleSeparator />
              <PickerView
                items={getPickerItems(
                  preloadedData.contactSources,
                  'name',
                  'id',
                )}
                containerStyle={styles.sourceContainer}
                onValueChange={onTextChange('contactSourceId')}
                value={companyDetail.contactSourceId}
                editable
              />
            </View>
          )}

          {!editMode && !!companyDetail.tagNames && (
            <View>
              <Text style={styles.viewRowLabel}>tags</Text>
              <Text
                style={styles.viewRowValue}>{`${companyDetail.tagNames}`}</Text>
            </View>
          )}

          {editMode && (
            <View style={styles.editRow}>
              <Text style={styles.editRowLabel}>tags</Text>
              <VerticleSeparator />
              <TextField
                placeholder="tag names"
                value={companyDetail.tagNames}
                onChangeText={onTextChange('tagNames')}
                multiline={true}
                editable={editMode}
                containerStyle={{
                  paddingHorizontal: AppDimensions.NORMAL,
                  width: '60%',
                }}
              />
            </View>
          )}
        </BaseCard>
        {(editMode ||
          (!!companyDetail.uploadedFileDtos?.length && !!setLogo)) && (
          <BaseCard containerStyle={styles.baseCardContainer}>
            {console.log('Documenst pre ', uploaderGroup)}
            {Object.keys(uploaderGroup).map((key, index) => {
              let uploaders = uploaderGroup[key];
              {
                console.log('Documenst ', uploaders);
              }
              return (
                <>
                  {uploaders.map((item, index) =>
                    item.isActive &&
                    (editMode ? true : item.viewFileURL ? true : false) ? (
                      <MoreDocumnetPicker
                        key={String(index)}
                        editable={editMode}
                        uri={item.viewFileURL}
                        name={item.displayFileName}
                        isLastItem={index === uploaders.length - 1}
                        onMinusPressed={() => onItemDel(key, index, 'document')}
                        onItemSelected={sendFileToServer(
                          key,
                          setLoading,
                          preloadedData.dynamicFileLabelTypes,
                          setLogo,
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

        {(editMode || !!companyDetail.notes) && (
          <BaseCard containerStyle={styles.baseCardContainer}>
            {!editMode ? (
              <View>
                <Text style={styles.viewRowLabel}>Notes</Text>
                <TextField
                  editable={editMode}
                  value={companyDetail.notes}
                  multiline
                  inputTextStyle={{
                    ...styles.viewRowValue,
                    ...styles.zeroPadding,
                  }}
                  onChangeText={onTextChange('notes')}
                />
              </View>
            ) : (
              <View style={styles.editColumn}>
                <Text style={styles.editColumnLabel}>Notes</Text>
                <TextField
                  placeholder="Type here"
                  editable={editMode}
                  multiline={true}
                  numberOfLines={4}
                  inputTextContainerStyle={styles.zeroPadding}
                  inputTextStyle={styles.zeroPadding}
                  value={companyDetail.notes}
                  onChangeText={onTextChange('notes')}
                />
              </View>
            )}
          </BaseCard>
        )}
      </View>
    </BaseContainer>
  );
};

CompanyDetailScreen.propTypes = {
  companyId: PropTypes.string,
};

export default CompanyDetailScreen;

const styles = StyleSheet.create({
  baseCardContainer: {
    marginVertical: AppDimensions.NORMAL,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: AppDimensions.NORMAL,
  },
  topInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: AppDimensions.NORMAL,
  },
  nameStarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  nameStyle: {
    color: AppColors.ACCENT,
    fontWeight: 'bold',
    fontSize: moderateScale(17),
    textAlign: 'center',
    width: '90%',
    paddingLeft: AppDimensions.LARGE,
  },
  starContainer: {
    alignSelf: 'flex-end',
  },
  personIcon: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: moderateScale(25),
    width: moderateScale(25),
  },
  viewRowLabel: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    fontWeight: 'bold',
    marginHorizontal: AppDimensions.NORMAL,
    marginVertical: AppDimensions.SMALL,
  },
  viewRowValue: {
    color: AppColors.ACCENT,
    paddingHorizontal: AppDimensions.NORMAL,
  },
  editColumn: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  },
  editColumnLabel: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    fontWeight: 'bold',
    width: '40%',
  },
  editRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  editRowLabel: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    fontWeight: 'bold',
    width: '40%',
    padding: AppDimensions.NORMAL,
  },
  normalText: {
    ...NORMAL_TEXT_STYLE,
    textAlign: 'center',
    textAlign: 'center',
    width: '90%',
    paddingLeft: AppDimensions.LARGE,
  },
  zeroPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sourceContainer: {
    padding: AppDimensions.NORMAL,
  },
});
