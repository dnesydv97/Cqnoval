import {useNavigation} from '@react-navigation/native';
import {Icons} from 'assets';
import {BaseCard, BaseContainer} from 'components';
import {messages, navScreenNames} from 'constant';
import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity, StatusBar} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {
  dateFormats,
  getDateFromFullSystemDate,
  getDisplayValue,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
  showFailToast,
  showSuccessToast,
  getDateOnRequiredFormat,
} from 'utils';
import PropTypes from 'prop-types';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import {getFullFileUrl} from 'scenes/contact/functions';

const ExtensionList = ({tenderExtension}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [logo, setLogo] = useState(null);
  const [expand, setExpand] = useState(false);

  console.log('Data in Tender Extension From TenderExtensionGetDetail', tenderExtension);
  useEffect(() => {
    if(logo) getFullFileUrl(logo.viewFileURL, setLogoUrl);
  }, [logo]);

  return(
    <BaseContainer>  
      <TouchableOpacity
                style={{backgroundColor: '#F5F5F5', paddingVertical: AppDimensions.NORMAL, fontSize: moderateScale(12), paddingLeft: moderateScale(15)}}
                onPress={() => setExpand(!expand)}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  {!expand &&(<Text>
                    Time Extension
                  </Text>)}
                  {expand &&(<Text>
                    Time Extension
                  </Text>)}
                  {!expand &&(<Text style={{paddingRight: moderateScale(10)}}>
                    12-Dec-2020
                  </Text>)}
                </View>
              </TouchableOpacity>
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>Invitation Date</Text>
                        <Text>12-Dec-2021</Text>
                    </View>)
                }
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>Submission Date</Text>
                        <Text>12-Dec-2021</Text>
                    </View>)
                }
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>Openning Date</Text>
                        <Text>12-Dec-2021</Text>
                    </View>)
                }
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>Bid Validity</Text>
                        <Text>12-Dec-2021</Text>
                    </View>)
                }
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>BG Validity</Text>
                        <Text>12-Dec-2021</Text>
                    </View>)
                }
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>Client Reference</Text>
                        <Text>12-Dec-2021</Text>
                    </View>)
                }
                {expand &&(
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.4, paddingVertical: AppDimensions.NORMAL}}>
                        <Text>Tender Notice</Text>
                        <Text>12-Dec-2021</Text>
                    </View>)
                }
    </BaseContainer>
  );
};

ExtensionList.propTypes = {
  tenderExtension: PropTypes.shape({
    tenderBasicId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
};

export default ExtensionList;