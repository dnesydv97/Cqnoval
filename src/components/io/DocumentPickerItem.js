import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {AppColors, AppDimensions, NORMAL_TEXT_STYLE} from 'styles';
import {CircularIconButton} from 'components';
import {moderateScale} from 'react-native-size-matters';
import {
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
  selectOneFile,
} from 'utils';
import {navScreenNames} from 'constant';
import {useNavigation} from '@react-navigation/native';
import {getFullFileUrl} from 'scenes/contact/functions';

const DocumentPickerItem = ({editable, onItemSelected, uri, name}) => {
  const navigation = useNavigation();
  const [document, setDocument] = useState({uri: null, name: ''});
  const [fullUrl, setFullUrl] = useState('');

  useEffect(() => {
    setDocument({uri, name});
    getFullFileUrl(uri, setFullUrl);
  }, [uri, name]);

  function launchDocPicker() {
    selectOneFile()
      .then((response) => {
        console.log('Document picker response ', response);
        onItemSelected(response);
      })
      .catch((error) => {
        onError(error);
        showFailToast(error);
      });
  }

  function navigateToPdfViewer() {
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_PDF_VIEWER_SCREEN,
      {url: fullUrl},
    );
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          uri ? navigateToPdfViewer() : editable && launchDocPicker();
        }}>
        <Text style={styles.text} numberOfLines={2}>
          {document.name || 'add files'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default DocumentPickerItem;

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    borderWidth: 0,
    borderColor: AppColors.UTIL,
    borderRadius: AppDimensions.SMALL,
    paddingVertical: AppDimensions.SMALL,
    paddingHorizontal: AppDimensions.NORMAL,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  text: {
    width: '100%',
    ...NORMAL_TEXT_STYLE,
    color: AppColors.NORMAL_BLACK,
    fontWeight: 'bold',
    paddingHorizontal: AppDimensions.SMALL,
  },
  icon: {
    height: moderateScale(25),
    width: moderateScale(25),
  },
});
