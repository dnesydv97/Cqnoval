import React, { useState } from 'react';
import {AppColors} from 'styles';
import { initialState, navScreenNames } from 'constant';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ReferenceTabs from 'navigations/ReferenceTabRoute';
import { BaseCard, BaseContainer, SearchBox, Separator } from 'components';
import { IconFill, IconOutline } from '@ant-design/icons-react-native';
import {
    navigateToGivenScreen,
    navigateToGivenScreenWithParams,
    showLoadingToast,
} from 'utils';
import { Icons } from 'assets';


const actions = [
    {
        text: 'Tender',
        icon: Icons.iconResource,
        name: 'fab_tender',
        position: 1,
    },
    {
        text: 'Project',
        icon: Icons.iconResource,
        name: 'fab_project',
        position: 2,
    },
    {
        text: 'Contract',
        icon: Icons.iconResource,
        name: 'fab_contract',
        position: 3,
    },
    {
        text: 'Other',
        icon: Icons.iconResource,
        name: 'fab_other',
        position: 4,
    },
];

const ReferenceScreen = () => {

    const navigation = useNavigation();
    
    function onSearch() {
        
    }

    function onFabItemClick(name) {
        if(name === 'fab_tender')
            navigateToGivenScreenWithParams(
                navigation,
                navScreenNames.NAV_TENDER_DETAIL_SCREEN,
                {tenderId: null},
            );
        else if(name === 'fab_project')
                navigateToGivenScreenWithParams(
                    navigation,
                    navScreenNames.NAV_PROJECT_DETAIL_SCREEN,
                    {projectId: null},
                );
        else if(name === 'fab_contract')
                    navigateToGivenScreen(
                        navigation,
                        navScreenNames.NAV_CONTRACT_SCREEN,
                    );
        else if(name === 'fab_other')
                    navigateToGivenScreen(
                        navigation,
                        navScreenNames.NAV_OTHER_SCREEN,
                    );
    }
    function moreIcon() {
        return (
            <IconOutline
                name="more"
                size={20}
            />
        )
    }

    return (
        <BaseContainer
            toolbarTitle="Business"
            showToolbarLeftIcon={false}
            >
                {/* <SearchBox
                    onSearch={onSearch}
                /> */}
                <Separator/>
                <ReferenceTabs/>
        </BaseContainer>
    )
}

export default ReferenceScreen;

const Styles = StyleSheet.create({

})