import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AppColors, AppDimensions, NORMAL_TEXT_STYLE } from 'styles';
import { CircularIconButton } from 'components';
import { moderateScale } from 'react-native-size-matters';
import {
    navigateToGivenScreen,
    navigateToGivenScreenWithParams,
    onError,
    selectMultipleFile,
    showFailToast,
} from 'utils';
import { navScreenNames } from 'constant';
import { useNavigation } from '@react-navigation/native';
import { getFullFileUrl } from 'scenes/contact/functions';
import DocumentPicker from 'react-native-document-picker';
import { IconFill, IconOutline } from '@ant-design/icons-react-native';

const EmailAttachment = ({
    editable,
    onItemSelected,
    initialItems = [],
    containerStyle = {},
    type = [DocumentPicker.types.allFiles],
}) => {
    const navigation = useNavigation();
    const [selectedItems, setSelectedItems] = useState(initialItems);

    useEffect(() => {
        setSelectedItems(initialItems);
    }, [initialItems]);

    function launchDocPicker() {
        selectMultipleFile(type)
            .then((response) => {
                onItemSelected && onItemSelected(response);
            })
            .catch((error) => {
                onError(error);
                showFailToast(error);
            });
    }

    function navigateToPdfViewer(document) {
        navigateToGivenScreenWithParams(
            navigation,
            document.name.includes('.pdf')
                ? navScreenNames.NAV_PDF_VIEWER_SCREEN
                : navScreenNames.NAV_IMAGE_VIEWER_SCREEN,
            {url: getFullFileUrl(uri, null)},
        );
    }

    return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            {selectedItems.map((document) => (
            <TouchableOpacity
                onPress={() => {
                    uri ? navigateToPdfViewer() : null;
                }}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/* <Text>Attachment</Text> */}
                        <IconOutline
                            name='paper-clip'
                            size={15}
                            onPress={() => {
                                document ? navigateToPdfViewer(document.uri) : null;
                            }}
                        />
                        <Text>{document.name}</Text>
                    </View>
            </TouchableOpacity>))}
            {editable && (
                <TouchableOpacity
                onPress={() => launchDocPicker()}>
                    <View style={{flex: 1,width:'77%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text>Attachment</Text>
                        <IconOutline
                            name='paper-clip'
                            size={15}
                            onPress={() => launchDocPicker()}
                        />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default EmailAttachment;