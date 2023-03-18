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
    SMALL_TEXT_STYLE
} from 'styles';
import { 
    getDateFromFullSystemDate,
    getDisplayValue,
    navigateToGivenScreenWithParams,
    onError,
    showFailToast,
    showSuccessToast, 
} from 'utils';
import PropTypes from 'prop-types';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import { getFullFileUrl } from 'scenes/contact/functions';
import { StatusBar } from 'react-native';
import { addRemoveReferenceProjectAsFav } from 'services';

const ProjectItem = ({project}) => {
    const navigation = useNavigation();
    const [isFav, setFav] = useState(project.isFavorite);
    const [loading, setLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');
    const [logo, setLogo] = useState(null);
    
    console.log('Data in Project Item', project)
    useEffect(() => {
        setFav(project.isFavorite);
    }, [project]);

    useEffect(() => {
        if(logo) getFullFileUrl(logo.viewFileURL, setLogoUrl);
    }, [logo]);

    
    const onProjectPressed = () => {
        navigateToGivenScreenWithParams(
            navigation,
            navScreenNames.NAV_PROJECT_DETAIL_SCREEN,
            {projectId: project.id},
            console.log("Project ID Sent Project Item", project.id)
        );
    };

    const onFavPressed = (value) => {
        setLoading(true);
        addRemoveReferenceProjectAsFav(project.id)
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

    return(
        <TouchableOpacity
        style={styles.flatListContainer}
        onPress={onProjectPressed}>
            <View style={styles.flatListView}>
                
                {console.log('Project Items', project)}
                <View style={styles.projectIdStyle}>
                    <Text style={styles.projectIdText}>{project.referenceCode}</Text>
                </View>
                <View style={styles.projectDescStyle}>
                    <Text numberOfLines={2} style={styles.projectDescText}>{project.description}</Text>
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
}

ProjectItem.propTypes = {
    project: PropTypes.shape({
        referenceCode: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }),
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    flatListContainer: {
        flex: 1, 
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 0.4,
    },
    flatListView: {
        flexDirection: 'row', 
        width:'100%',
        marginVertical: AppDimensions.NORMAL,
        alignContent: 'center',
    },
    favIconStyle:{
        width: '10%',
        marginVertical: AppDimensions.SMALL, 
        marginBottom: AppDimensions.NORMAL, 
        left: 3,
        alignContent: 'center',
    },
    projectIdStyle: { 
        marginBottom: AppDimensions.NORMAL, 
        marginHorizontal: moderateScale(10), 
        width: '10%', 
        alignItems: 'flex-start',
    },
    projectIdText: {
        color:  AppColors.NORMAL_BLACK,
    },
    projectDescStyle: {
        flex: 1,  
        width:'100%',  
        marginHorizontal: moderateScale(0), 
        marginBottom: AppDimensions.NORMAL,
    },
    projectDescText: { 
        // color: AppColors.FIVE_DAYS_COLOR,
    },
    icon: {
        paddingHorizontal: AppDimensions.SMALLER,
        marginVertical: AppDimensions.SMALLEST,
    },
});

export default ProjectItem;