import {useNavigation} from '@react-navigation/native';
import {Icons} from 'assets';
import {BaseCard, BaseContainer} from 'components';
import {messages, navScreenNames} from 'constant';
import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
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
    navigateToGivenScreenWithParams,
    onError,
    showFailToast,
    showSuccessToast,
    getDateOnRequiredFormat,
} from 'utils';
import PropTypes from 'prop-types';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import { StatusBar } from 'react-native';
import { getFullFileUrl } from 'scenes/contact/functions';
import { isNull, values } from 'lodash';
import { addRemoveReferenceTenderAsFav } from 'services';

const TenderItem = ({tender}) => {
    const navigation = useNavigation();
    const [isFav, setFav] = useState(tender.isFavorite);
    const [loading, setLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');
    const [logo, setLogo] = useState(null);

    console.log('Data in Tender Item', tender);
    useEffect(() => {
        setFav(tender.isFavorite);
    }, [tender]);

    useEffect(() => {
        if(logo) getFullFileUrl(logo.viewFileURL, setLogoUrl);
    }, [logo]);

    const onTenderPressed = () => {
        navigateToGivenScreenWithParams(
            navigation,
            navScreenNames.NAV_TENDER_DETAIL_SCREEN,
            {tenderId: tender.id},
            console.log("Tender Id sent from Tender Item", tender.id)
        );
    };

    const onFavPressed = (value) => {
        setLoading(true);
        addRemoveReferenceTenderAsFav(tender.id)
            .then((response) => {
                setLoading(false);
                if(response.status === 200) {
                    setFav(value);
                } else showFailToast(messages.FAILED_TO_ADD_FAV);
            })
            .catch((error) => {
                onError(error);
                setLoading(false);
            });
    };

    return (
        <TouchableOpacity
            style={styles.flatListContainer}
            onPress={onTenderPressed}>
            <View style={styles.flatListView}>
                <View style={styles.projectIdStyle}>
                    <Text style={styles.projectIdText}>{tender.type || 'T'}{tender.slNo || '2020'}</Text>
                    <Text>{tender.slNo||54}</Text>
                </View>
                <View style={styles.projectDescStyle}>
                    <Text numberOfLines={2} style={styles.projectDescText}>{tender.title}</Text>
                </View> 
                <View style={{flexDirection: 'column', width: '25%'}} numberOfLines={2}>
                    {tender.submissionDate!=null && (<Text>{`${getDateOnRequiredFormat(
                            tender.submissionDate,
                            dateFormats.DD_MMM_YYYY_DASH,
                        )}`}
                    </Text>)}
                    {tender.remainingDays!= '0' && (<Text>(in {tender.remainingDays} days)</Text>)}
                </View>
                <View style={styles.favIconStyle}>    
                    {/* <IconFill
                        name="star"
                        size={25}
                        color={AppColors.FAV_LIST_COLOR}
                    /> */}
                    {loading ? (
                        <IconOutline
                            name="loading-3-quarters"
                            size={25}
                            color="grey"
                            style={styles.icon}
                        />
                    ) : isFav ? (
                        <IconFill
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                            style={styles.icon}
                            onPress={() => onFavPressed(false)}
                        />
                    ) : (
                        <IconOutline
                            name="star"
                            size={25}
                            color="grey"
                            style={styles.icon}
                            onPress={() => onFavPressed(true)}
                        />
                    )}
                </View>
                
            </View>
        </TouchableOpacity>
    );
};

TenderItem.propTypes = {
    tender: PropTypes.shape({
        referenceCode: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }),
};

export default TenderItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: 'white',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingVertical: AppDimensions.MODERATE,
        borderBottomWidth: 0.4,
    },
    noteContainer: {
        flexDirection: 'column',  
        // paddingVertical: AppDimensions.NORMAL,
        borderBottomWidth: 0.4,
    },
    titleView: {
        marginHorizontal: AppDimensions.LARGE, 
    },
    titleText: {
        color: AppColors.PRIMARY_DARK_REF_TEXT, 
        // fontSize: moderateScale(16), 
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
    flatListContainer: {
        flex: 1,
        flexDirection: 'row', 
        backgroundColor: 'white',
        borderBottomWidth: 0.4,
        marginTop: AppDimensions.NORMAL,
    },
    flatListView: {
        flexDirection: 'row', 
        width:'100%',
        marginBottom: AppDimensions.NORMAL,
        alignContent: 'center',
        backgroundColor: 'white',
    },
    favIconStyle:{
        width: '9%',
        marginVertical: AppDimensions.SMALL, 
        marginHorizontal: moderateScale(0), 
        alignContent: 'center',
},
    projectIdStyle: {
        marginHorizontal: moderateScale(10), 
        width: '10%', 
        fontSize: moderateScale(14),
        alignItems: 'center',
    },
    projectIdText: {
        color:  AppColors.NORMAL_BLACK,
    },
    projectDescStyle: {
        flex: 1, 
        justifyContent: 'space-between',
        width:'100%', 
        marginHorizontal: moderateScale(0), 
    },
    projectDescText: { 
        color: AppColors.NORMAL_BLACK,
    },
    projectDateView: {
        width: '25%', 
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    projectDate: {
        fontSize: moderateScale(12),
        color: AppColors.FIVE_DAYS_COLOR,
    },
    projectDeadline: {
        fontSize: moderateScale(11),
        color: AppColors.FIVE_DAYS_COLOR,
    },
    icon: {
        paddingHorizontal: AppDimensions.SMALLER,
        marginVertical: AppDimensions.SMALLEST,
    },
})