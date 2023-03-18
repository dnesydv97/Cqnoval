import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import {navScreenNames, screenNames} from 'constant';
import {moderateScale} from 'react-native-size-matters';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AppDimensions, AppColors} from 'styles';
import { View, Text, StyleSheet, FlatList, StatusBar, Image, TouchableOpacity } from 'react-native';
import {
    BaseCard,
    BaseContainer,
    EditUpdateButton,
    EmptyView,
    LoadMoreFlatList,
    PickerView,
} from 'components';
import {
    updateTenderReference,
    getTenderExtensiondetail,
} from 'services';
import {
    dateFormats,
    getPickerItems,
    onError,
    showFailToast,
    showSuccessToast,
    isFormFilled,
    navigateToGivenScreen,
    navigateToGivenScreenWithParams,
    getDateOnRequiredFormat,
    getRemainingDays,
} from 'utils';
import _, {values} from 'lodash';
import {getFullFileUrl, handleDetailDocResponse} from 'scenes/contact/functions';
import ExtensionList from 'components/io/listItems/ExtensionList';
import { Icons } from 'assets';

const TenderExtensions = () => {
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const [expand, setExpand] = useState(false);
    const [tenderExtDetail, setTenderExtDetail] = useState({});
    const [tenderExtensionDto, setTenderExtensionDto] = useState([]);
    const [isSetupFinished, setisSetupFinished] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const {tenderRef, tenderRefCode} = route?.params;  
    const tenderExtId = tenderRef.id;
    const [preloadedData, setPreloadedData] = useState({});
    
    useEffect(() => {
        console.log("First Execute this useEffect");
        tenderExtId && getDetail();
        setEditMode(!tenderExtId);
    }, [tenderExtId, isSetupFinished]);
    
    console.log("Tender Reference Code", tenderRefCode)
    const getDetail = () => {
        getTenderExtensiondetail(tenderExtId)
            .then((response) => {
                console.log("Second Execution of getDetail", response);
                if(response.status === 200) {
                    updateDataForView(response.data);
                } else {
                    setTenderExtDetail({});
                    onError(response.message)
                }
            })
    }

    const updateDataForView = (data) => {
        console.log("Third Execution",data);
        setTenderExtDetail(data);
        let groupedLabels = _.chain(data.tenderExtensionDto)
            .groupBy('tenderExtId')
            .value();
            console.log("Fourth Execution", tenderExtDetail);
    }

    return (
        <BaseContainer
        toolbarTitle="Tender Extension"
        // showToolbarLeftIcon={tenderExtDetail.referenceCode}
        scrollable>
            <BaseCard>
            {console.log("Fifth Execution",tenderExtDetail)}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                    <Text>Reference Code</Text>
                    <Text>{`${tenderRefCode}`}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                    <Text>Invitation Dates</Text>
                    {tenderRef.openingDate!=null && (<Text>{`${getDateOnRequiredFormat(
                        tenderRef.openingDate,
                        dateFormats.DD_MMM_YYYY_DASH,
                    )}`}</Text>)}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                    <Text>Submission Dates</Text>
                    {tenderRef.submissionDate!= null && (<Text>{`${getDateOnRequiredFormat(
                        tenderRef.submissionDate,
                        dateFormats.DD_MMM_YYYY_DASH,    
                    )}`}</Text>)}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                    <Text>Openning Dates</Text>
                    {tenderRef.openingDate!=null && (<Text>{`${getDateOnRequiredFormat(
                        tenderRef.openingDate,
                        dateFormats.DD_MMM_YYYY_DASH,
                    )}`}</Text>)}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                    <Text>Bid Validity</Text>
                    {tenderRef.bidValidity!=null && (<Text>{`${getDateOnRequiredFormat(
                        tenderRef.bidValidity,
                        dateFormats.DD_MMM_YYYY_DASH,
                    )}`}</Text>)}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                    <Text>BG Validity</Text>
                    {tenderRef.bankGuranteeValidity!=null && (<Text>{`${getDateOnRequiredFormat(
                        tenderRef.bankGuranteeValidity,
                        dateFormats.DD_MMM_YYYY_DASH,
                    )}`}</Text>)}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                    <Text>Client Reference</Text>
                    {tenderRef.clientReference!=null && (<Text>{`${tenderRef.clientReference}`}</Text>)}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                    <Text>Tender Notice</Text>
                    <Text>EOI</Text>
                </View>
                <View style={{paddingTop: AppDimensions.MODERATE}}>
                    <Text>Extension List</Text>
                </View>
                
                <TouchableOpacity
                style={{backgroundColor: '#F5F5F5', paddingVertical: AppDimensions.NORMAL, fontSize: moderateScale(12), paddingLeft: moderateScale(15)}}
                onPress={() => setExpand(!expand)}>
                            
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  {!expand &&(<Text>
                    Time Extension
                  </Text>
                  )}
                  {expand &&(
                    <Text>
                        Time Extension
                    </Text>)}
                    {expand &&(
                        
                        <Image
                            source={Icons.upArrowIcon}
                            style={{height: '100%',
                            width: moderateScale(20),
                            padding: AppDimensions.NORMAL,}}
                        />
                    )}
                  {!expand &&(
                    <View style={{flexDirection: 'row'}}>
                        <Text>
                            12-Dec-2020
                        </Text>
                        <Image
                            source={Icons.upDownArrowIcon}
                            style={{height: '100%',
                            width: moderateScale(20),
                            padding: AppDimensions.NORMAL,}}
                        />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>Invitation Date</Text>
                        {tenderExtDetail.map((item,index) => (
                            <Text key={index}>
                                {`${getDateOnRequiredFormat(
                                    item.invitationDate,
                                    dateFormats.DD_MMM_YYYY_DASH,
                                )}`}</Text>
                        ))}
                    </View>)
                }
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>Submission Date</Text>
                        {tenderExtDetail.map((item,index) => (
                            <Text key={index}>
                                {`${getDateOnRequiredFormat(
                                    item.submissionDate,
                                    dateFormats.DD_MMM_YYYY_DASH,
                                )}`}</Text>
                        ))}
                    </View>)
                }
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>Opening Date</Text>
                        {tenderExtDetail.map((item,index) => (
                            <Text key={index}>
                                {`${getDateOnRequiredFormat(
                                    item.openingDate,
                                    dateFormats.DD_MMM_YYYY_DASH,
                                )}`}</Text>
                        ))}
                    </View>)
                }
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>Bid Validity</Text>
                        {tenderExtDetail.map((item,index) => (
                            <Text key={index}>
                                {`${getDateOnRequiredFormat(
                                    item.bidValidity,
                                    dateFormats.DD_MMM_YYYY_DASH,
                                )}`}</Text>
                        ))}
                    </View>)
                }
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>BG Validity</Text>
                        {tenderExtDetail.map((item,index) => (
                            <Text key={index}>
                                {`${getDateOnRequiredFormat(
                                    item.bankGuranteeValidity,
                                    dateFormats.DD_MMM_YYYY_DASH,
                                )}`}</Text>
                        ))}
                    </View>)
                }
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>Tender Notice</Text>
                        {tenderExtDetail.map((item,index) => (
                            <Text key={index}>{`${item.tenderFile}`}</Text>
                        ))}
                    </View>)
                }
            </BaseCard>
        </BaseContainer>
    );
};

export default TenderExtensions;