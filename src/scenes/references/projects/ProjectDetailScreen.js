import PropTypes from 'prop-types';
import { navScreenNames } from 'constant';
import { TouchableOpacity } from 'react-native';
import { color } from 'react-native-reanimated';
import React, {useEffect, useState} from 'react';
import { AppDimensions, AppColors } from 'styles';
import { moderateScale } from 'react-native-size-matters';
import {useNavigation, useRoute} from '@react-navigation/native';
import ReferenceDetailTabRoute from 'navigations/ReferenceDetailTabRoute';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import { 
  BaseCard, 
  BaseContainer, 
  EditUpdateButton, 
  PickerView, 
  TextField,
  CurrencyItem,
} from 'components';
import {
  getAllProject,
  getProjectDetail,
  addProjectReference,
  updateProjectReference,
  getProjectStatus,
  getProjectSector,
  getProjectModality,
} from 'services';
import {
  getPickerItems,
  onError,
  showFailToast,
  showSuccessToast,
  isFormFilled,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
} from 'utils';
import {
  getProjectDetailByProjectId,
  getProject,
  getCurrencyLabel,
  getFundingAgencyForProject,
  getModality,
  getSectorForProject,
  getStatus,
} from '../functions';
import _ from 'lodash';
import { getFullFileUrl, handleDetailDocResponse } from 'scenes/contact/functions';
import { updateProjectDetail } from 'services/redux/references/action';


const ProjectDetailScreen = () => {

  const route = useRoute();
  const navigation = useNavigation();
  const {projectId} = route?.params;
  console.log("Reference Code from Route", projectId);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSetupFinished, setisSetupFinished] = useState(false);
  const [preloadedData, setPreloadedData] = useState({
    currency: [],
    fundingAgency: [],
    projectStatus: [],
    sector: [],
    modality: [],
  });
  const [projectInfo, setProjectInfo] = useState({
    projectStatusId: null,
    projectStatusDtos: null,
    projectSectorDtos: [],
    projectFundingAgencyDtos: [],

  })
  {
    console.log("Funding Agency:")
  }
  const [projectDetail, setProjectDetail] = useState({});
  const [
    currencyDtos,
    setCurrenctDtos,
  ] = useState([]);
  const [
    referenceProjectLabelGroupDtos,
    setReferenceProjectLabelGroupDtos,
  ] = useState([]);
  const [
    contactCompanyAddressDataDtos,
    setContactCompanyAddressDataDtos,
  ] = useState([]);
  const [uploaderGroup, setUploaderGroup] = useState({});
  const [logo, setLogo] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    projectId && getDetail();
    setEditMode(!projectId);
    console.log('Project Reference Id from ProjectDetailScreen useEffect:', projectId);
  }, [projectId, isSetupFinished]);

  useEffect(() => {
    getRequiredData();
  }, []);

  useEffect(() => {
    if (logo) getFullFileUrl(logo.viewFileURL, setLogoUrl);
  }, [logo]);

  function getRequiredData() {
    Promise.all([
      getCurrencyLabel(),
      getFundingAgencyForProject(),
      getProjectStatus(),
      getProjectSector(),
      getProjectModality(),
    ])
      .then((response) => {
        console.log('Required Data Response from ProjectDetailScreen from getRequiredData', response);
        setPreloadedData({
          ...preloadedData,
          currency: response[0].data,
          fundingAgency: response[1].data,
          projectStatus: response[2].data,
          sector: response[3].data,
          modality: response[4].data,
        });
      })
      .catch(handleError);
  }

  console.log("Currency Dtos Data:", projectDetail.currencyDtos);
  console.log("Funding Agencies Data:", projectDetail.projectFundingAgencyDtos);
  console.log("Sector Data:", projectDetail.projectSectorDtos);

  const getDetail = () => {
    setLoading(true);
    getProjectDetail(projectId)
      .then((response) => {
        setLoading(false);
        console.log('Project Detail Response from ProjectDetailScreen getDetail function', response);
        if(response.status === 200) {
          updateDataForView(response.data);
        } else {
          setProjectDetail({});
          onError(response.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setProjectDetail({});
        onError(error);
      });
  };

  const updateDataForView = (data) => {
    setProjectDetail(data);

    console.log("Current Dtos Data", data.currencyDtos);
    setCurrenctDtos(data.currencyDtos);
    let currencyLabels = _.chain(data.currencyDtos)
      .groupBy('CurrencyId')
      .value();

    currencyDtos.map((group) => {
      let tempCurrency = groupedLabels[group.CurrencyId] || [];
      group.currencyDtos.push(...tempCurrency);
    });

    setContactCompanyAddressDataDtos(data.contactCompanyGroupAddressDtos);
    let groupedLabels = _.chain(data.referenceProjectLabelGroupDtos)
      .groupBy('contactLabelGroupId')
      .value();
    
    referenceProjectLabelGroupDtos.map((group) => {
      let tempLabels = groupedLabels[group.contactLabelGroupId] || [];
      group.referenceProjectLabelDtos.push(...tempLabels);
    });

    handleDetailDocResponse(
      preloadedData.dynamicFileLabelTypes,
      data.uploadedFileDtos,
      setLogo,
      setUploaderGroup,
    );
  };

  function getModalityById(id) {
    const modalityItem = preloadedData.modality.find(
      (item) => item.id === modalityId,
    );
    return modalityItem;
  }

  const submitNewProject = (isUpdate = false) => {
    setLoading(true);
    const response = isFormFilled(projectDetail);
    const tempProjectGroupLabelList = [];
    referenceProjectLabelGroupDtos.map((item) => {
      tempProjectGroupLabelList.push.apply(
        tempProjectGroupLabelList,
        item.referenceProjectLabelDtos,
      );
    });

    const projectLabelsValidList = tempProjectGroupLabelList.filter(
      (item) => 
        item.projectId !== '' && item.title !== null,
    );

    const fileList = [];

    Object.keys(uploaderGroup).map((key) => 
      fileList.push(...uploaderGroup[key]),
    );

    const validFileList = fileList.filter((item) =>item.viewFileURL !== '');
    validFileList.push(logo);
    const data = {
      ...projectDetail,
      referenceProjectLabelDtos: projectLabelsValidList,
      uploadedFileDtos: validFileList,
      isActive: true,
      isQuickEntry: false,
    };

    console.log('Data for server', data);
    console.log('Data for server', JSON.stringify(data));

    isUpdate
      ? updateProjectReference(data, projectId)
        .then((response) => {
          setLoading(false);
          console.log('Update Project Detail', response);
          if(response.status === 200) {
            showSuccessToast('Project is Successfully Updated.');
            updateDataForView(response.data);
          } else showFailToast('Failed to update project.');
        })
        .catch((error) => {
          setLoading(false);
          showFailToast('Please Fill up all the information');
          onError(error);
        })
      : addProjectReference(data) 
        .then((response) => {
          setLoading(false);
          console.log('Add Project Response', response);
          if(response.status === 200) {
            showSuccessToast('Project is successfully added.');
            navigateToGivenScreenWithParams(
              navigation,
              navScreenNames.NAV_PROJECT_SCREEN,
              {
                isFavorite: false,
                projectId: response.data.id,
                title: `${response.data.title}`
              },
            );
          } else showFailToast('Failed to add project from first if else');
        })
        .catch((error) => {
          setLoading(false);
          showFailToast('Failed to add Project from second if else');
          onError(error);
        });
    
  };

  function handleError(error) {
    setLoading(false);
    onError(error);
  }

  function editIcon() {
      return projectId? (
        <EditUpdateButton
          editMode={editMode}
          onPress={() => {
            editMode && submitNewProject(true);
            setEditMode(!editMode);
          }}
        />
      ) : (
        <TouchableOpacity>
          <View>
            <Text
              style={{width: '100%'}}
              type="primary"
              onPress={() => submitNewProject(false)}>
              Submit
            </Text>
          </View>
        </TouchableOpacity>
      )
  }

  const onTextChange = (key) => (value) => 
    setProjectDetail({
      ...projectDetail,
      [key]: value,
    });


  return (
    <BaseContainer
    toolbarTitle={navScreenNames.NAV_PROJECT_DETAIL_SCREEN}
    // toolbarRightIcon={editIcon}
    // showToolbarRightIcon
    scrollable>
      <View style={styles.titleView}>
          <Text style={styles.titleText}>Basic</Text>
      </View>
      {!editMode && (<BaseCard>
        <View style={styles.rowContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.rowTitleText}>Reference</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={styles.rowContentText}>{`${projectDetail.referenceCode}`}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.rowTitleText}>Sector</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={styles.rowContentText}>{`${projectDetail.sectorName}`}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.rowTitleText}>Title</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={styles.rowContentText}>{`${projectDetail.title}`}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.rowTitleText}>Status</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={styles.rowContentText}>{`${projectDetail.projectStatus}`}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.rowTitleText}>Client</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={styles.rowContentText}>{`${projectDetail.clientName}`}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.rowTitleText}>Description</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={[styles.rowContentText, {marginVertical: AppDimensions.NORMAL}]}>{`${projectDetail.description}`}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.rowTitleText}>Modality</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={styles.rowContentText}>{`${projectDetail.modalityName}`}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.rowTitleText}>Funding Agency</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={styles.rowContentText}>{`${projectDetail.fundingAgencies}`}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.rowTitleText}>Project Cost</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={styles.rowContentText}>{`${projectDetail.currencyName}${projectDetail.projectCost}`}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.rowTitleText}>Overview</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={[styles.rowContentText, {marginVertical: AppDimensions.NORMAL}]}>{`${projectDetail.overview}`}</Text>
          </View>
        </View>
        <View style={[styles.rowContainer,{flexDirection: 'column'}]}>
          <Text style={styles.rowTitleText}>Technical Features</Text>
          <Text style={[styles.rowContentText, {marginVertical: AppDimensions.NORMAL}]}>{`${projectDetail.technicalFeatures}`}</Text>
        </View>
        <View>
          <Text></Text>
        </View>
        <View>
          <Text></Text>
        </View>
      </BaseCard>)}
      {editMode && (<BaseCard>
        <View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Reference</Text>
          <TextField 
            placeholder="Reference"
            containerStyle={{width: '70%'}}
            editable={editMode}
            value={projectDetail.referenceCode}
            onChangeText={onTextChange('referenceCode')}
          />
        </View>
        <View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Sector</Text>
          {/* <TextField 
            placeholder="Sector"
            containerStyle={{width: '70%'}}
            editable
          /> */}
          <PickerView
            placeholder={{label: 'Sector'}}
            containerStyle={{flex: 1, paddingVertical: AppDimensions.MODERATE}}
            editable
          />
        </View>
        <View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Title</Text>
          <TextField 
            placeholder="Title"
            containerStyle={{width: '70%'}}
            editable={editMode}
            value={projectDetail.title}
            onChangeText={onTextChange('title')}
          />
        </View>
        <View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Status</Text>
          {/* <TextField 
            placeholder="Status"
            containerStyle={{width: '70%'}}
            editable
          /> */}
          <PickerView
            placeholder={{label: 'Project Status'}}
            value={projectInfo.projectStatusId}
            items={getPickerItems(preloadedData.projectStatus, 'status', 'id')}
            // onValueChange={onTextChange('projec')}
            containerStyle={{flex: 1, paddingVertical: AppDimensions.MODERATE}}
            editable
          />
        </View>
        <View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Client</Text>
          {/* <TextField 
            placeholder="Client"
            containerStyle={{width: '70%'}}
            editable
          /> */}
          <PickerView
            placeholder={{label: 'Client'}}
            containerStyle={{flex: 1,  paddingVertical: AppDimensions.NORMAL}}
            editable
          />
        </View>
        <View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Description</Text>
          <TextField 
            placeholder="Description"
            containerStyle={{width: '70%', paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
            value={projectDetail.description}
            onChangeText={onTextChange('description')}
          />
        </View>
        <View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Modality</Text>
          {/* <TextField 
            placeholder="Modality"
            containerStyle={{width: '70%'}}
            editable
          /> */}
          {console.log("Modality Id From Project Detail", projectDetail.modalityId)}
          {console.log("Modality Array From Preloaded Data", preloadedData.modality)}
          <PickerView
            placeholder={{label: 'Modality'}}
            value={projectDetail.modalityId}
            items={getPickerItems(projectDetail.modality, 'modalityName', 'modalityId')}
            onValueChange={onTextChange('modality')}
            containerStyle={{flex: 1, paddingVertical: AppDimensions.NORMAL}}
            editable={editMode}
          />
{/* 
          <PickerView
            placeholder={{label: 'Modality'}}
            containerStyle={{flex: 1, paddingVertical: AppDimensions.NORMAL}}
            editable
          /> */}
        </View>
        {console.log("Project Cost", projectDetail.projectCost)}
        <View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Funding Agency</Text>
          <PickerView
            placeholder={{label: 'Funding Agency'}}
            containerStyle={{flex: 1, paddingVertical: AppDimensions.MODERATE}}
            editable
          />
        </View>
        <View style={styles.editableRowContainer}>
          <Text style={[styles.rowTitleText, {width: '45%', fontSize: moderateScale(16)}]}>Project Cost</Text>
          <View style={{flexDirection: 'row'}}>
            {console.log("Currency Id", preloadedData)}
            <PickerView
              placeholder={{label: 'USD'}}
              items={getPickerItems(projectDetail.currencyDtos, 'name', 'id')}
              value={projectDetail.currencyDtos}
              containerStyle={{flex: 0.5, paddingVertical: AppDimensions.MODERATE}}
              editable={editMode}
            />
            {console.log("Project Cost", projectDetail.currencyDtos)}
            <TextField
              placeholder="1,000,000"
              value={projectDetail.projectCost}
              onChangeText={onTextChange('projectCost')}
              containerStyle={{paddingVertical: AppDimensions.NORMAL}}
              editable={editMode}
            />
          </View>
        </View>
        <View style={{paddingVertical: AppDimensions.NORMAL,flexDirection: 'column', borderBottomWidth: 0.4}}>
          <Text style={{fontSize: moderateScale(16)}}>OverView</Text>
          <TextField
            placeholder="Overview"
            numberOfLines={4}
            editable={editMode}
            value={projectDetail.overview}
            onChangeText={onTextChange('overview')}
          />
        </View>
        <View style={{paddingVertical: AppDimensions.NORMAL,flexDirection: 'column', borderBottomWidth: 0.4}}>
          <Text style={{fontSize: moderateScale(16)}}>Technical Features</Text>
          <TextField
            placeholder="Technical Features"
            numberOfLines={4}
            editable={editMode}
            value={projectDetail.technicalFeatures}
            onChangeText={onTextChange('technicalFeatures')}
          />
        </View>
        <View>
          <Text></Text>
        </View>
        <View>
          <Text></Text>
        </View>
      </BaseCard>)}
    </BaseContainer>
  );
}

ProjectDetailScreen.protoTypes = {
  projectId: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  rowContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
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

export default ProjectDetailScreen;