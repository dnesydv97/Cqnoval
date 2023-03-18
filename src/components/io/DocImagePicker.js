import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {AppColors, AppDimensions, NORMAL_TEXT_STYLE} from 'styles';
import {CircularIconButton} from 'components';
import {moderateScale} from 'react-native-size-matters';
import {
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
  selectMultipleFile,
  showFailToast,
} from 'utils';
import {navScreenNames} from 'constant';
import {useNavigation} from '@react-navigation/native';
import {getFullFileUrl} from 'scenes/contact/functions';
import DocumentPicker from 'react-native-document-picker';

const DocImagePicker = ({
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
    console.log('Inside Multiple Document picker ');
    selectMultipleFile(type)
      .then((response) => {
        console.log('Document picker response ', response);
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
    <View style={{...styles.container, ...containerStyle}}>
      {selectedItems.map((document) => (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            uri ? navigateToPdfViewer() : null;
          }}>
          <CircularIconButton
            // icon={document.uri ? 'eye' : 'folder-open'}
            icon={document.uri ? 'upload' : 'upload'}
            iconColor={document.uri ? AppColors.ACCENT : AppColors.UTIL}
            containerStyle={styles.icon}
            iconSize={25}
            onPress={() => {
              document ? navigateToPdfViewer(document.uri) : null;
            }}
          />
          <Text style={styles.text} numberOfLines={2}>
            {document.name}
          </Text>
        </TouchableOpacity>
      ))}
      {editable && (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => launchDocPicker()}>
          <CircularIconButton
            icon={'upload'}
            iconColor={AppColors.ACCENT}
            containerStyle={styles.icon}
            iconSize={25}
            onPress={() => launchDocPicker()}
          />
          <Text style={styles.text}>Upload File</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default DocImagePicker;

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    borderWidth: 1,
    borderColor: AppColors.UTIL,
    borderRadius: AppDimensions.SMALL,
    paddingVertical: AppDimensions.SMALL,
    paddingHorizontal: AppDimensions.NORMAL,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  text: {
    width: '80%',
    ...NORMAL_TEXT_STYLE,
    paddingHorizontal: AppDimensions.SMALL,
  },
  icon: {
    height: moderateScale(25),
    width: moderateScale(25),
  },
});
