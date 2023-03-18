import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import PropTypes from 'prop-types';
import {Icons} from 'assets';
import {AppDimensions, HEADING_TEXT_SIZE, NORMAL_TEXT_STYLE} from 'styles';
import {
  AddMoreButton,
  EditUpdateButton,
  MoreDocumnetPicker,
  ProgressModal,
} from 'components';
import {onError, showFailToast, showSuccessToast} from 'utils';
import {isMe, uploadUserDocs} from 'services';
import {getDefaultUploader, sendFileToServer} from 'scenes/contact/functions';
import {messages} from 'constant';
import {updateProfile} from 'services/redux/profile/action';

const DocumentScreen = ({userDetail, docData}) => {
  const {dynamicFileLabelTypes, onDocumentUploaded} = docData;
  const [uploaderGroup, setUploaderGroup] = useState(docData.uploaderGroup);

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // console.log('Doc screen params ', userDetail, docData);
    setUploaderGroup(docData.uploaderGroup);
  }, [docData]);

  const onDocAdd = (contactLabelGroupId) => {
    let tempArray = uploaderGroup[contactLabelGroupId];
    tempArray.push(getDefaultUploader(tempArray[0].fileLableTypeId));
    setUploaderGroup({
      ...uploaderGroup,
      [contactLabelGroupId]: tempArray,
    });
  };

  const onDocDel = (contactLabelGroupId, index) => {
    const uploader = uploaderGroup[contactLabelGroupId][0];
    if (index === 0 && uploaderGroup[contactLabelGroupId].length === 1) {
      setUploaderGroup({
        ...uploaderGroup,
        [contactLabelGroupId]: [getDefaultUploader(uploader.fileLableTypeId)],
      });
    } else {
      const tempArray = uploaderGroup[contactLabelGroupId];
      // tempArray[index].isActive = false;
      tempArray.splice(index, 1);
      setUploaderGroup({
        ...uploaderGroup,
        [contactLabelGroupId]: tempArray,
      });
    }
  };

  function uploadDocuments() {
    setLoading(true);
    let documents = [];
    Object.keys(uploaderGroup).map((uploaderGrpKey) => {
      uploaderGroup[uploaderGrpKey].map((docItem) => {
        if (docItem.viewFileURL !== '' && docItem.displayFileName !== '')
          documents.push(docItem);
      });
    });
    // let documents = uploaderGroup.Document.filter(
    //   (item) => item.viewFileURL !== '' && item.displayFileName !== '',
    // );
    uploadUserDocs(
      userDetail.employeePersonalDetailUpdateDto.appUserId,
      documents,
    )
      .then(async (response) => {
        console.log('Document upload response ', response);
        setLoading(false);
        if (response.status === 200) {
          (await isMe(userDetail.employeePersonalDetailUpdateDto.appUserId)) &&
            updateProfile('uploadedFileDtos', response.data);
          showSuccessToast(messages.PROFILE_UPDATE_SUCCESS);
        } else {
          showFailToast(messages.PROFILE_UPDATE_FAILED);
        }
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  return (
    <View style={styles.container}>
      {Object.keys(uploaderGroup).map((key, index) => {
        let uploaders = uploaderGroup[key];
        return (
          <View key={String(index)}>
            <Text style={styles.headingText}>{key}</Text>
            {uploaders.map((item, index) =>
              editMode || (item.isActive && item.viewFileURL) ? (
                <MoreDocumnetPicker
                  key={String(index)}
                  editable={editMode}
                  uri={item.viewFileURL}
                  name={item.displayFileName}
                  onMinusPressed={() => onDocDel(key, index)}
                  onItemSelected={sendFileToServer(
                    key,
                    setLoading,
                    dynamicFileLabelTypes,
                    (abc) => {},
                    onDocumentUploaded,
                  )}
                />
              ) : null,
            )}
            {editMode && <AddMoreButton onPress={() => onDocAdd(key)} />}
          </View>
        );
      })}
      <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <EditUpdateButton
          editMode={editMode}
          onPress={() => {
            editMode && uploadDocuments();
            setEditMode(!editMode);
          }}
        />
      </View>

      <ProgressModal loading={loading} />
    </View>
  );
};

DocumentScreen.propTypes = {
  userDetail: PropTypes.object.isRequired,
};

export default DocumentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    paddingVertical: AppDimensions.NORMAL,
  },
  thumbnail: {
    height: moderateVerticalScale(50),
    width: moderateScale(50),
  },
  text: {
    ...NORMAL_TEXT_STYLE,
  },
  headingText: {
    ...HEADING_TEXT_SIZE,
    paddingVertical: AppDimensions.SMALL,
  },
});
