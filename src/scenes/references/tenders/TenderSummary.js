import PropTypes from 'prop-types';
import {navScreenNames, screenNames} from 'constant';
import {color} from 'react-native-reanimated';
import React, {useEffect, useState} from 'react';
import {AppDimensions, AppColors} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import {useNavigation, useRoute} from '@react-navigation/native';
import AutoComplete from 'react-native-autocomplete-input';
import ReferenceDetailTabRoute from 'navigations/ReferenceDetailTabRoute';
import {SafeAreaView, View, FlatList, Image, StyleSheet, Text, StatusBar, TouchableOpacity} from 'react-native';
import {
  AddMoreButton,
  BaseCard,
  BaseContainer,
  CircularIconButton,
  DocumentPurchase,
  EditUpdateButton,
  PickerView,
  PopMenuItem,
  TextField,
  DateTimePicker,
  DateRangePickerItem,
  DateTimeRangePicker,
} from 'components';
import { 
  updateTenderReference, 
  getTenderDetail,
  getAllSecondaryIncharge,
} from 'services';
import {
  dateFormats,
  getPickerItems,
  onError,
  showFailToast,
  showSuccessToast,
  isFormFilled,
  navigateToGivenScreen,
  navigateToGivenScreenWithParamsa,
  getDateOnRequiredFormat,
  getRemainingDays,
} from 'utils';
import {
  getSecondaryIncharge,
  getSecondaryInchargeLabelGroup,
} from '../functions';
import _, { values } from 'lodash';
import {getDefaultLabel, getFullFileUrl, handleDetailDocResponse} from 'scenes/contact/functions';
import { Checkbox } from '@ant-design/react-native';
import InnerCard from 'components/base/InnerCard';
import { IconOutline } from '@ant-design/icons-react-native';
import { Icons } from 'assets';
import Autocomplete from 'react-native-autocomplete-input';
import TenderTab from 'navigations/TenderTab';

const TenderSummary = () => {
  
  const initialData = {

  }
  const route = useRoute();
  const navigation = useNavigation();
  const {tenderId} = route?.params;
  console.log("Reference Code of Tender from Route", tenderId);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSetupFinished, setisSetupFinished] = useState(false);
  const [preloadedData, setPreloadedData] = useState({
    secondaryIncharge: [],
  });
  const [expand, setExpand] = useState(false);
  const [expandParticipation, setExpandParticipation] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [tenderInfo, setTenderInfo] = useState({
    tenderStageId: null,
  });
  const [
    tenderBasicSecondaryInchargeDtos, 
    setTenderBasicSecondaryInchargeDtos
  ] = useState([]);
  const [secondaryInchargeLabelGroupDtos, setSecondaryInchargeLabelGroupDtos] = useState([]);
  const [tenderDetail, setTenderDetail] = useState();
  const [uploaderGroup, setUploaderGroup] = useState({});
  const [logo, setLogo] = useState(null);
  const [count, setCount] = useState(0);
  const [ currentDate, setCurrentDate ] = useState('');
  const [documentPurchase, setDocumentPurchase] = useState([]);
  const [participant, setParticipant] = useState([]);

  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = ("0" + ((new Date()).getMonth() + 1)).slice(-2); //new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hour
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    setCurrentDate(
      year + '-' + month + '-' + date 
    );
  }, []);

  useEffect(() => {
    tenderId && getDetail();
    setEditMode(!tenderId);
    console.log('Tender Reference Id from TenderDetailScreen from useEffect:', tenderId);
  }, [tenderId, isSetupFinished]);


  useEffect(() => {
    getRequiredData();
  }, []);

  useEffect(() => {
    if(logo) getFullFileUrl(logo.viewFileURL, setLogoUrl);
  }, [logo]);

  function getRequiredData() {
    Promise.all([
      getAllSecondaryIncharge(),
    ])
      .then((response) => {
        const tempSecondaryLabelGroup = [];
        setPreloadedData({
          ...preloadedData,
          secondaryIncharge: response[0].data,
        });
        response[0].data.map((group) => {
          if(group.isMultipleValuedAllowed)
            tempSecondaryLabelGroup.push(getAllSecondaryIncharge(group, tenderId));
          else tempSecondaryLabelGroup.push(getAllSecondaryIncharge(group, tenderId));
        });
        setTenderBasicSecondaryInchargeDtos(tempSecondaryLabelGroup);
      })
    .catch(handleError);
  }

  console.log("Datas in secondary Incharge from preloaded Datas", preloadedData.secondaryIncharge)
  function editIcon() {
    return tenderId ? (
      <EditUpdateButton
        editMode={editMode}
        onPress={() => {
          editMode && submitNewTender(true);
          setEditMode(!editMode);
        }}
      />
    ) : (
      <TouchableOpacity>
        <View>
          <Text
          style={{width: '100%'}}
          type="primary"
          onPress={() => submitNewTender(false)}>
            Submit
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const getDetail = () => {
    setLoading(true);
    getTenderDetail(tenderId)
      .then((response) => {
        setLoading(false);
        console.log('Tender Detail response from tenderDetailScreen getDetail function', response);
        if(response.status === 200) {
          updateDataForView(response.data);
        } else {
          setTenderDetail({});
          onError(response.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setTenderDetail({});
        onError(error);
      });
  };

  const updateDataForView = (data) => {
    setTenderDetail(data);
    // setTenderBasicSecondaryInchargeDtos(data.tenderBasicSecondaryInchargeDtos);
    // let groupedLabels = _.chain(data.tenderSecondaryInchargeDtos)
    //   .groupBy('secondaryInchargeId')
    //   .value();

    // tenderSecondaryInchargeDtos.map((group) => {
    //   let tempLabels = groupedLabels[group.secondaryInchargeId] || [];
    //   group.secondaryInchargeLabelDtos.push(...tempLabels);
    // });

    handleDetailDocResponse(
      preloadedData.dynamicFileLabelTypes,
      data.uploadedFileDtos,
      setLogo,
      setUploaderGroup,
    );
  };

  const MoreItem = () => <IconOutline name="more" size={20}/> ;

  const popUpMenu = [
    {
      label: 'Edit',
    },
    {
      label: 'Delete',
    },
  ];

  const submitNewTender = (isUpdate = false) => {
    setLoading(true);
    const response = isFormFilled(tenderDetail);

    const tenderLabelsValidList = tempTenderGroupLabelList.filter(
      (Item) =>
      Item.tenderId !== '' && Item.title !== null,
    );

    const fileList = [];

    Object.keys(uploaderGroup).map((key) =>
      fileList.push(...uploaderGroup[key]),
    );

    const validFileList = fileList.filter((item) => item.viewFileURL !== '');
    validFileList.push(logo);
    const data = {
      ...tenderDetail,
      uploadedFileDtos: validFileList,
      isActive: true,
      isQuickEntry: false,
    };

    console.log("")
    isUpdate
      ? updateTenderReference(data, tenderId)
        .then((response) => {
          setLoading(false);
          console.log('Update Tender Detail', response);
          if(response.status === 200) {
            showSuccessToast('Tender is successfully updated.');
            updateDataForView(response.data);
          } else showFailToast('Failed to update Tender');
        })
        .catch((error) => {
          setLoading(false);
          showFailToast('Please Fill up all the information');
          onError(error);
        })
      : addTenderReference(data)
        .then((response) => {
          setLoading(false);
          console.log('Add Tender Response', response);
          if(response.status === 200) {
            showSuccessToast('Tender is successfully added.');
            navigateToGivenScreenWithParams(
              navigation,
              navScreenNames.NAV_TENDER_SCREEN,
              {
                isFavorite: false,
                tenderId: response.data.id,
                title: `${response.data.title}`
              },
            );
          } else showFailToast('Failed to add Tender from first if else');
        })
        .catch((error) => {
          setLoading(false);
          showFailToast('Failed tp add Tender from second if else');
          onError(error);
        });
  };
  
  function handleError(error) {
    setLoading(false);
    onError(error);
  }

  const onTenderExtensionPressed = () => {
    navigateToGivenScreen(
        navigation,
        navScreenNames.NAV_TENDER_EXTENSION
    );
  };
  
  const onTextChange = (key) => (value) =>
    setTenderDetail({
      ...tenderDetail,
      [key] : value,
    });
  
  return(
    <BaseContainer
      toolbarTitle={screenNames.TENDER_SCREEN}
      // toolbarRightIcon={editIcon}
      loading={loading}
      scrollable>
        <TenderTab/>
      <View style={styles.titleView}>
          <Text style={styles.titleText}>Basic</Text>
      </View>
      <BaseCard>
      {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Reference</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.referenceCode}`}</Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Stage</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.sectorName}`}</Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Type</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.title}`}</Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Sector</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.tenderStatus}`}</Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Primary Incharge</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.primaryInchargeName}`}</Text>
        </View>)}
        {console.log("Secondary Incharge from Dtos:", tenderDetail)}
        
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Secondary Incharge</Text>
          {tenderDetail?.tenderBasicSecondaryInchargeDtos.map((item, index) => (
            <Text style={[styles.rowContentText, {
              borderWidth: 0.2, 
              borderRadius: AppDimensions.NORMAL, 
              padding: AppDimensions.SMALL, 
              color: AppColors.NORMAL_WHITE, 
              backgroundColor: AppColors.ACCENT}]} key={index}>{`${item.secondaryInchargeName}`}</Text>
          ))}
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Title</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.title}`}</Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Project (if any)</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.title}`}</Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Client</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.clientName}`}</Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Budget</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.budgetCurrencySymbol}. ${tenderDetail?.budget}`}</Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Department</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.department}`}</Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Advance Document</Text>
          <Text style={styles.rowContentText}></Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Document Cost</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.documentCostCurrencySymbol}. ${tenderDetail?.documentCost}`}</Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Official Invitation</Text>
          <Checkbox
            checked={tenderDetail?.officialInvitation}
          />
        </View>)}
        {tenderDetail?.officialInvitation == true && !editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>BG Value</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.bankGuranteeCurrencySymbol}. ${tenderDetail?.bankGuranteeValue}`}</Text>
        </View>)}
        {tenderDetail?.officialInvitation == true && !editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Publication</Text>
          <Text style={styles.rowContentText}>{`${getDateOnRequiredFormat(
            tenderDetail?.publicationDate,
            dateFormats.DD_MMM_YYYY_DASH,
          )}`}</Text>
        </View>)}
        {(tenderDetail?.officialInvitation == true) && !editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Submission</Text>
          <Text style={styles.rowContentText}>{`${getDateOnRequiredFormat(
            tenderDetail?.submissionDate,
            dateFormats.MM_TEXT_DD_NUMBER_YYYY_NUMBER_HH_MM_12HRS_AM_PM,
          )}`}</Text>
        </View>)}
        {/* {console.log("Submission Date:", tenderDetail?.submissionDate)} */}
        {console.log("Today's Date::", currentDate)}
        {tenderDetail?.officialInvitation == true && !editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Bid Validity</Text>
          <Text style={styles.rowContentText}>{`${getDateOnRequiredFormat(
            tenderDetail?.bidValidity,
            dateFormats.MM_TEXT_DD_NUMBER_YYYY_NUMBER_HH_MM_12HRS_AM_PM,
          )}`}</Text>
        </View>)}
        {tenderDetail?.officialInvitation == true && !editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>BG Validity</Text>
          <Text style={styles.rowContentText}>{`${getDateOnRequiredFormat(
            tenderDetail?.bankGuranteeValidity,
            dateFormats.MM_TEXT_DD_NUMBER_YYYY_NUMBER_HH_MM_12HRS_AM_PM,
          )}`}</Text>
        </View>)}
        {tenderDetail?.officialInvitation == true && !editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Client Reference</Text>
          <Text style={styles.rowContentText}>{`${tenderDetail?.clientReference}`}</Text>
        </View>)}
        {tenderDetail?.officialInvitation == true && !editMode && (<View style={[styles.rowContainer,{flexDirection: 'column'}]}>
          <Text style={styles.rowTitleText}>Detail Description</Text>
          <Text style={[styles.rowContentText, {marginVertical: AppDimensions.NORMAL}]}>{`${tenderDetail?.detailDescription}`}</Text>
        </View>)}
        {!editMode && (<View style={styles.rowContainer}>
          <Text style={styles.rowTitleText}>Reference</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
            onPress={onTenderExtensionPressed}>
              <Text 
                style={[
                  styles.rowContentText, 
                  {
                    borderWidth: 0.7, 
                    marginHorizontal:moderateScale(10), 
                    paddingHorizontal: 5
                  }
                ]}> Add</Text>
            </TouchableOpacity>
            <Text style={[styles.rowContentText, {borderWidth: 0.7, borderRadius: 10, paddingHorizontal: 5}]} >Revision</Text>
          </View>
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Reference</Text>
          <TextField 
            placeholder="Reference"
            containerStyle={{width: '70%'}}
            editable={editMode}
            value={tenderDetail?.referenceCode}
            onChangeText={onTextChange('referenceCode')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Stage</Text>
          <TextField 
            placeholder="Stage"
            containerStyle={{width: '70%'}}
            editable={editMode}
            value={tenderDetail?.tenderStageName}
            onChangeText={onTextChange('referenceCode')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Type</Text>
          <TextField 
            placeholder="Type"
            containerStyle={{width: '70%'}}
            editable={editMode}
            value={tenderDetail?.tenderTypeName}
            onChangeText={onTextChange('tenderTypeName')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Sector</Text>
          <TextField 
            placeholder="Sector"
            containerStyle={{width: '70%'}}
            editable={editMode}
            value={tenderDetail?.sectorName}
            onChangeText={onTextChange('sectorName')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Primary Incharge</Text>
          {/* <TextField 
            placeholder="Primary Incharge"
            containerStyle={{width: '70%'}}
            editable={editMode}
            value={tenderDetail?.primaryInchargeName}
            onChangeText={onTextChange('primaryInchargeName')}
          /> */}
          <AutoComplete
            onChangeText={onTextChange('primaryInchargeName')}
            inputContainerStyle={{borderWidth: 0}}
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Secondary Incharge</Text>
            {/* <TextField 
              placeholder="Secondary Incharge"
              containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
              editable={editMode}
              value={tenderDetail?.secondaryIncharge}
              onChangeText={onTextChange('description')}
            /> */}
            <Autocomplete
              onChangeText={onTextChange('secondaryInchargeName')}
              inputContainerStyle={{borderWidth: 0}}
              containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Title</Text>
          {console.log("Modality Id From Project Detail", tenderDetail?.modalityId)}
          {console.log("Modality Array From Preloaded Data", preloadedData.modality)}
          <TextField 
            placeholder="Title"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.title}
            onChangeText={onTextChange('title')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Project (if any)</Text>
          <TextField 
            placeholder="Project"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.projectTitle}
            onChangeText={onTextChange('projectTitle')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Client</Text>
          <View style={{flexDirection: 'row'}}>
            <TextField
              placeholder="1,000,000"
              value={tenderDetail?.clientName}
              onChangeText={onTextChange('clientName')}
              containerStyle={{paddingVertical: AppDimensions.NORMAL}}
              editable={editMode}
            />
          </View>
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Budget</Text>
          <TextField 
            placeholder="Budget"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.budget}
            onChangeText={onTextChange('budget')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Department</Text>
          <TextField 
            placeholder="Department"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.department}
            onChangeText={onTextChange('department')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Advance Document</Text>
          <TextField 
            placeholder="Advance Document"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.description}
            onChangeText={onTextChange('description')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Document Cost</Text>
          <TextField 
            placeholder="Document Cost"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.documentCost}
            onChangeText={onTextChange('documentCost')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Official Invitation</Text>
          <TextField 
            placeholder="Official Invitation"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.officialInvitation}
            onChangeText={onTextChange('officialInvitation')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>BG Value</Text>
          <TextField 
            placeholder="BG Value"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.bankGuranteeValue}
            onChangeText={onTextChange('bankGuranteeValue')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Publication</Text>
          <TextField 
            placeholder="Publication"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.publicationDate}
            onChangeText={onTextChange('publicationDate')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Submission</Text>
          <TextField 
            placeholder="Submission"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.submissionDate}
            onChangeText={onTextChange('submissionDate')}
          />
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Bid Validity</Text>
          {/* <TextField 
            placeholder="Bid Validity"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.bidValidity}
            onChangeText={onTextChange('bidValidity')}
          /> */}
          {/* <DateRangePickerItem/> */}
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>BG Validity</Text>
          {/* <TextField 
            placeholder="BG Validity"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.bankGuranteeValidity}
            onChangeText={onTextChange('bankGuranteeValidity')}
          /> */}
          {/* <DateTimePicker/> */}
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Client Reference</Text>
          {/* <TextField 
            placeholder="Client Reference"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.clientReference}
            onChangeText={onTextChange('clientReference')}
          /> */}
          {/* <DateTimeRangePicker/> */}
        </View>)}
        {editMode && (<View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Detail Description</Text>
          <TextField 
            placeholder="Detail Description"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={tenderDetail?.detailDescription}
            onChangeText={onTextChange('detailDescription')}
          />
        </View>)}
        {editMode && (<View>
          <Text></Text>
        </View>)}
        {editMode && (<View>
          <Text></Text>
        </View>)}
      </BaseCard>
      {!editMode && (<TouchableOpacity
          onPress={() => setExpand(!expand)}>
        <View style={[styles.titleView, {
          flexDirection: 'row', 
          justifyContent: 'space-between'}]}>
          
            <Text style={styles.titleText}>Document Purchase</Text>
            <View style={{flexDirection: 'row'}}>
              <Checkbox/>
              <Image
                source={Icons.upDownArrowIcon}
              />
            </View>
        </View>
      </TouchableOpacity>)}
      {expand && !editMode && (<BaseCard>
        <InnerCard>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.3, paddingVertical: AppDimensions.NORMAL}}>
            <Text style={{color: AppColors.ACCENT}}>Tongtech China</Text>
            <View style={{flexDirection: 'row'}}>
              <Text>
                L1
              </Text>
              <Text>
                :
              </Text>
            </View>
          </View>
          <View style={{marginVertical: AppDimensions.NORMAL}}>
            <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '50%'}}>Document Purchase:</Text>
                <Text style={{width: '50%'}}>2021-12-03</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '50%'}}>Through:</Text>
                <Text style={{width: '50%'}}>ISPL</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '50%'}}>Claim:</Text>
                <Text style={{width: '50%'}}>Yes</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>  
              <CircularIconButton
                icon="plus"
                iconSize={15}
                containerStyle={styles.roundButton}  
              />
              <TouchableOpacity>
                <Text style={{fontSize: moderateScale(16), color: AppColors.ADD_BUTTON_COLOR, marginHorizontal: AppDimensions.NORMAL, marginVertical: AppDimensions.NORMAL}}>Add Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        </InnerCard>
      </BaseCard>)}
      {!editMode && (<View style={[styles.titleView, {borderBottomWidth: 0.4, borderTopWidth: 0.4, marginVertical: AppDimensions.SMALL, paddingVertical: AppDimensions.NORMAL}]}>
          <Text style={styles.titleText}>ROTTO</Text>
      </View>)}
      {!editMode && (<TouchableOpacity
      onPress={() => setExpandParticipation(!expandParticipation)}>
      <View style={[styles.titleView, {flexDirection: 'row', justifyContent: 'space-between'}]}>
          <Text style={styles.titleText}>Participation</Text>
          <View style={{flexDirection: 'row'}}>
            <Checkbox/>
            <Image
              source={Icons.upDownArrowIcon}
            />
          </View> 
      </View>
      </TouchableOpacity>)}
      {expandParticipation && !editMode && (<BaseCard>
        <InnerCard>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.3, paddingVertical: AppDimensions.NORMAL}}>
            <Text style={{color: AppColors.ACCENT}}>Tongtech China</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{backgroundColor: AppColors.LABEL_COLOR, borderWidth: 0.4, borderRadius: AppDimensions.MODERATE, paddingHorizontal: AppDimensions.NORMAL, paddingVertical: AppDimensions.SMALLER}}>
                <Text style={{color: AppColors.NORMAL_WHITE}}>
                  L1
                </Text>
              </View>
              <TouchableOpacity>
                <PopMenuItem
                  ButtonComponent={MoreItem}
                  menuItems={popUpMenu}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginVertical: AppDimensions.NORMAL}}>
            <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '50%'}}>Company:</Text>
                <Text style={{width: '50%'}}>2021-12-03</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '50%'}}>Stage:</Text>
                <Text style={{width: '50%'}}>ISPL</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '50%'}}>Through:</Text>
                <Text style={{width: '50%'}}>Yes</Text>
              </View>
            </View>
            <TouchableOpacity
            onPress={() => setShowMore(!showMore)}>
              {!showMore && (<View>
                <Text>
                  Show More
                </Text>
              </View>)}
            </TouchableOpacity>
            {showMore && (
              <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '50%'}}>Bid Price:</Text>
                  <Text style={{width: '50%'}}>Yes</Text>
                </View>
              </View>
            )}
            {showMore && (
              <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '50%'}}>Validity:</Text>
                  <Text style={{width: '50%'}}>Yes</Text>
                </View>
              </View>
            )}
            {showMore && (
              <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '50%'}}>Rank:</Text>
                  <Text style={{width: '50%'}}>Yes</Text>
                </View>
              </View>
            )}
            {showMore && (
              <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '50%'}}>Bid Security:</Text>
                  <Text style={{width: '50%'}}>Yes</Text>
                </View>
              </View>
            )}
            {showMore && (
              <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '50%'}}>Type:</Text>
                  <Text style={{width: '50%'}}>Yes</Text>
                </View>
              </View>
            )}
            {showMore && (
              <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '50%'}}>Arranged By:</Text>
                  <Text style={{width: '50%'}}>Yes</Text>
                </View>
              </View>
            )}
            {showMore && (
              <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '50%'}}>Issued Bank:</Text>
                  <Text style={{width: '50%'}}>Yes</Text>
                </View>
              </View>
            )}
            {showMore && (
              <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '50%'}}>Reference No.:</Text>
                  <Text style={{width: '50%'}}>Yes</Text>
                </View>
              </View>
            )}
            {showMore && (
              <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '50%'}}>Value:</Text>
                  <Text style={{width: '50%'}}>Yes</Text>
                </View>
              </View>
            )}
            {showMore && (
              <View style={{flexDirection: 'row', marginVertical: AppDimensions.NORMAL, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '50%'}}>Validity:</Text>
                  <Text style={{width: '50%'}}>Yes</Text>
                </View>
              </View>
            )}
            {showMore && (
              <TouchableOpacity
              onPress={() => setShowMore(!showMore)}>
                <View>
                  <Text>Show Less</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </InnerCard>
      </BaseCard>)}
        {!editMode && (<View>
          <Text></Text>
        </View>)}
        {editMode && (<BaseCard>
        
      </BaseCard>)}
    </BaseContainer>
  )
}

TenderSummary.propTypes = {
  tenderId: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  rowContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: AppDimensions.NORMAL,
    borderBottomWidth: 0.4,
  },
  editableRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: AppDimensions.SMALLEST,
    borderBottomWidth: 0.4,
  },  
  noteContainer: {
    flexDirection: 'column',  
    paddingVertical: AppDimensions.NORMAL,
    borderBottomWidth: 0.4,
  },
  titleView: {
    marginHorizontal: AppDimensions.LARGE, 
    marginVertical: AppDimensions.SMALL,
  },
  titleText: {
    color: AppColors.PRIMARY_DARK_REF_TEXT, 
    fontSize: moderateScale(16), 
    fontWeight: 'bold',
  },
  roundButton: {
    borderWidth: 0.5,
    borderColor: AppColors.ADD_BUTTON_COLOR,
    marginVertical: AppDimensions.NORMAL,
    height: moderateScale(20),
    width: moderateScale(20),
  },
  rowTitleText: {
    fontSize: moderateScale(14), 
    color: AppColors.NORMAL_BLACK,
  },
  rowContentText: {
    color: AppColors.PROFILE_DETAIL_TEXT, 
    fontSize: moderateScale(14),
  },
  noteContent:{
    margin: AppDimensions.NORMAL,
    fontSize: moderateScale(14),
  },
});

export default TenderSummary;