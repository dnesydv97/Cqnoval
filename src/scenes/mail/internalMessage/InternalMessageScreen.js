import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import {Button} from '@ant-design/react-native';
import {useDispatch} from 'react-redux';
import {navScreenNames, screenNames, initialInternalMsg} from 'constant';
import {
  getPersonSearchSelectedItems,
  getPickerItems,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
  showFailToast,
  showSuccessToast,
  subtractArrays,
} from 'utils';
import {addOutboxMail} from 'services/redux/mail/outboxMail/action';
import {addNewSentMail} from 'services/redux/mail/sentMail/action';
import {
  BaseContainer,
  BaseCard,
  DocumentPickerItem,
  EqualSpaceHorizontalView,
  PickerView,
  TextEditor,
  TextField,
  PopMenuItem,
  DirectPersonSearchBox,
  DocImagePicker,
} from 'components';
import {AppColors, AppDimensions, SMALL_TEXT_STYLE} from 'styles';
import {IconOutline} from '@ant-design/icons-react-native';
import {Icons} from 'assets';
import {moderateScale} from 'react-native-size-matters';
import {
  getGoalPriority,
  getMailParticipantType,
  sendInternalMessage,
  getPredefinedTempletes,
  getMailParticipantStatus,
  getAllUserList,
} from 'services';
import {useNavigation} from '@react-navigation/native';
import {uploadFilesToServer} from 'scenes/contact/functions';

function getParticipantDto(
  participantId,
  fullName,
  userName,
  userIdName,
  participantTypeId,
  messageId = null,
) {
  return {
    quickMessageId: messageId,
    participantId,
    participantUserId: participantId,
    appUserId: participantId,
    fullName,
    userName,
    userIdName,
    candidateDto: {
      appUserId: participantId,
      fullName,
      userName,
      userIdName,
      officialEmail: '',
      phoneNumber: '',
      profilePictureFileInformationId: '',
      profilePictureViewUrl: '',
    },
    participantTypeId,
    participantTypeDto: {
      id: participantTypeId,
      systemName: '',
      displayName: '',
    },
  };
}

const InternalMessageScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [visibilities, setVisibilities] = useState({
    isCc: false,
    isBCc: false,
    loading: false,
  });
  const [preLoadedData, setPreLoadedData] = useState({
    mailParticipantType: [],
    priority: [],
    predefinedTempletes: [],
    participantStatuses: [],
    allParticipants: [],
  });
  const [internalMsg, setInternalMsg] = useState(initialInternalMsg);
  const [selectableParticipants, setSelectableParticipants] = useState([]);

  useEffect(() => {
    getRequiredData();
  }, []);

  useEffect(() => {
    setSelectableParticipants(
      subtractArrays(
        preLoadedData.allParticipants,
        [
          ...internalMsg.toParticipants,
          ...internalMsg.ccParticipants,
          ...internalMsg.bccParticipants,
        ],
        'appUserId',
        'appUserId',
      ),
    );
  }, [
    preLoadedData.allParticipants,
    internalMsg.toParticipants,
    internalMsg.ccParticipants,
    internalMsg.bccParticipants,
  ]);

  function setLoading(value) {
    setVisibilities({
      ...visibilities,
      loading: value,
    });
  }

  function getRequiredData() {
    Promise.all([
      getGoalPriority(),
      getMailParticipantType(),
      getPredefinedTempletes(),
      getMailParticipantStatus(),
      getAllUserList(),
    ]).then((response) => {
      console.log('Mail Participant Type list ', response);
      setPreLoadedData({
        ...preLoadedData,
        priority: response[0].data,
        mailParticipantType: response[1].data,
        predefinedTempletes: response[2].data,
        participantStatuses: response[3].data,
        allParticipants: response[4].data,
      });
    });
  }

  const popUpMenu = [
    {
      label: 'As Archive',
      onPress: () => {
        onSend('Archived');
      },
    },
    {
      label: 'As Pending',
      onPress: () => {
        onSend('Pending');
      },
    },
  ];

  function onUsersChanged(userList, type) {
    console.log('onUsersChanged ', userList, type);
    const participantType = preLoadedData.mailParticipantType.find(
      (item) => item.systemname === type,
    );
    if (participantType) {
      const convertedUsers = userList.map((item) => {
        let user = getParticipantDto(
          item.appUserId,
          item.fullName,
          item.userName,
          item.userIdName,
          participantType.id,
        );

        return user;
      });

      if (type === 'Cc') onTextChange('ccParticipants')(convertedUsers);
      else if (type === 'Bcc') onTextChange('bccParticipants')(convertedUsers);
      else if (type === 'To') onTextChange('toParticipants')(convertedUsers);
    }
  }

  const onTextChange = (key) => (value) =>
    setInternalMsg({
      ...internalMsg,
      [key]: value,
    });

  const onVisbilitiesChanged = (key) => (value) =>
    setVisibilities({
      ...visibilities,
      [key]: value,
    });

  const onSend = (statusName) => {
    // isConnected
    //   ? dispatch(addOutboxMail(newMail))
    //   : dispatch(addNewSentMail(newMail));
    const foundStatus = preLoadedData.participantStatuses.find(
      (status) => status.systemName === statusName,
    );
    let data = {...internalMsg};
    data.quickMessageStatusId = foundStatus.id;
    data.quickMessageStatusName = statusName;
    data.mailMessageParticipantWithTypeDtos = {
      participantTos: internalMsg.toParticipants,
      participantCCs: internalMsg.ccParticipants,
    };
    delete data.toParticipants;
    delete data.ccParticipants;
    delete data.bccParticipants;
    delete data.messageText;
    delete data.orderNumber;
    delete data.replyOfInstanceMessageId;
    delete data.instanceMessageStatusId;

    console.log('data ', internalMsg, data, JSON.stringify(data));
    setLoading(true);
    sendInternalMessage(data)
      .then((response) => {
        setLoading(false);
        console.log('Internal Message post response ', response);
        if (response.status === 200) {
          showSuccessToast('Internal Message Sent !!!');
          setInternalMsg(initialInternalMsg);
          navigateToGivenScreen(navigation, navScreenNames.NAV_INBOX_SCREEN);
        } else showFailToast('Sorry, We failed to send the message.');
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
        showFailToast('Sorry, We failed to send the message.');
      });
  };

  const onAttachmentChanged = (attachments) => {
    console.log('Selected attachments ', attachments);
    uploadFilesToServer(attachments, setLoading, onUploadCompleted);
  };

  const onUploadCompleted = (tempFiles = []) => {
    onTextChange('quickMessageAttachmentDtos')(tempFiles);
  };

  const RightIcon = () => (
    <IconOutline name="plus" size={30} color={AppColors.PRIMARY_DARK} />
  );

  const MoreItem = () => (
    <View style={styles.iconStyle}>
      <Image
        source={Icons.upDownArrowIcon}
        style={styles.iconStyle}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <BaseContainer
      // isDrawer
      toolbarTitle={screenNames.COMPOSE_INTERNAL_SCREEN}
      scrollable
      // loading={visibilities.loading}
      // showToolbarRightIcon
      // toolbarRightIcon={RightIcon}
    >
      <BaseCard>
        <DirectPersonSearchBox
          selectedUsers={getPersonSearchSelectedItems(
            internalMsg.toParticipants,
            'appUserId',
            'userIdName',
          )}
          onUsersChanged={(users) => onUsersChanged(users, 'To')}
          users={selectableParticipants}
          editable
        />
        <EqualSpaceHorizontalView containerStyle={{justifyContent: 'flex-end'}}>
          <TouchableOpacity
            style={styles.textBtnContiner}
            onPress={() => onVisbilitiesChanged('isCc')(!visibilities.isCc)}>
            <Text style={styles.textBtn}>Cc</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.textBtnContiner}
            onPress={() => onVisbilitiesChanged('isBCc')(!visibilities.isBCc)}>
            <Text style={styles.textBtn}>BCc</Text>
          </TouchableOpacity>
        </EqualSpaceHorizontalView>

        {visibilities.isCc && (
          <>
            <Text>Cc</Text>
            <DirectPersonSearchBox
              selectedUsers={getPersonSearchSelectedItems(
                internalMsg.ccParticipants,
                'appUserId',
                'userIdName',
              )}
              onUsersChanged={(users) => onUsersChanged(users, 'Cc')}
              users={selectableParticipants}
              editable
            />
          </>
        )}

        {visibilities.isBCc && (
          <>
            <Text>BCC</Text>
            <DirectPersonSearchBox
              selectedUsers={getPersonSearchSelectedItems(
                internalMsg.bccParticipants,
                'appUserId',
                'userIdName',
              )}
              onUsersChanged={(users) => onUsersChanged(users, 'Bcc')}
              users={selectableParticipants}
              editable
            />
          </>
        )}

        <EqualSpaceHorizontalView>
          <PickerView
            placeholder={{label: 'Set Reference'}}
            containerStyle={styles.containerStyle}
            pickerStyle={styles.pickerStyle}
            onChange={onTextChange('referenceId')}
            editable
          />
          <PickerView
            placeholder={{label: 'Set Priority'}}
            containerStyle={styles.containerStyle}
            pickerStyle={styles.pickerStyle}
            value={internalMsg.priorityId}
            items={getPickerItems(preLoadedData.priority, 'name', 'id')}
            onValueChange={onTextChange('priorityId')}
            editable
          />
        </EqualSpaceHorizontalView>

        <PickerView
          placeholder={{label: 'Select Predefined Messages'}}
          value={internalMsg.predefinedMsg}
          items={getPickerItems(
            preLoadedData.predefinedTempletes,
            'name',
            'templateText',
          )}
          containerStyle={styles.containerStyle}
          pickerStyle={styles.pickerStyle}
          onValueChange={onTextChange('predefinedMsg')}
          editable
        />

        <TextField
          clear
          value={internalMsg.subject}
          onChangeText={onTextChange('subject')}
          placeholder="Subject"
          containerStyle={styles.containerStyle}
          editable
        />

        <TextEditor onTextChanged={onTextChange('description')} />
        {/* <DocumentPickerItem /> */}
        <DocImagePicker
          editable
          initialItems={[]}
          onItemSelected={onAttachmentChanged}
        />
      </BaseCard>
      <EqualSpaceHorizontalView
        containerStyle={{marginHorizontal: AppDimensions.SMALL}}>
        <Button type="warning" onPress={onSend}>
          Cancel
        </Button>
        <Button type="ghost" onPress={onSend}>
          Save As Draft
        </Button>
        <View style={styles.sendBtnContainer}>
          <Button type="primary" onPress={() => onSend('Normal')}>
            Send
          </Button>
          <PopMenuItem ButtonComponent={MoreItem} menuItems={popUpMenu} />
        </View>
      </EqualSpaceHorizontalView>
    </BaseContainer>
  );
};

export default InternalMessageScreen;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  containerStyle: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: AppColors.ITEM_BG,
    marginHorizontal: AppDimensions.SMALL,
    marginVertical: AppDimensions.NORMAL,
  },
  sendBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.PRIMARY_DARK,
    borderRadius: AppDimensions.NORMAL,
  },
  textBtnContiner: {
    marginHorizontal: AppDimensions.SMALLER,
    borderRadius: AppDimensions.SMALL,
    backgroundColor: AppColors.LIST_ITEM_BG,
  },
  textBtn: {
    ...SMALL_TEXT_STYLE,
    padding: AppDimensions.NORMAL,
  },
  pickerStyle: {paddingVertical: AppDimensions.NORMAL},
  iconStyle: {
    width: moderateScale(20),
    padding: AppDimensions.NORMAL,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
