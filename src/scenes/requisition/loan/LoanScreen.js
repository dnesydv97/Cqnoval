import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  BaseCard,
  BaseContainer,
  DocImagePicker,
  PickerView,
  TextField,
} from 'components';
import {navScreenNames} from 'constant';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
} from 'styles';
import {checkAndGoBack, getPickerItems, onError, showSuccessToast} from 'utils';
import {Button} from '@ant-design/react-native';
import {moderateScale} from 'react-native-size-matters';
import {getEmployeeSisterCompanies, postLoanRequest} from 'services';
import {useNavigation} from '@react-navigation/core';

const LoanScreen = () => {
  const [loading, setLoading] = useState(false);
  const [preloadedData, setPreloadedData] = useState({
    requisitionFor: [],
    companies: [],
  });
  const [loanData, setLoanData] = useState({
    requestedAmount: 0,
    reason: '',
    uploadedFileDtos: [],
  });

  const navigation = useNavigation();

  useEffect(() => {
    getRequiredData();
  }, []);

  const onChangeText = (key) => (value) =>
    setLoanData({
      ...loanData,
      [key]: value,
    });

  function onDateChanged(date) {
    setLoanData({
      ...loanData,
      loanApplicationDate: date,
    });
  }

  const onAttachmentChanged = (attachments) => {
    console.log('Selected attachments ', attachments);
    uploadFilesToServer(attachments, setLoading, onUploadCompleted);
  };

  const onUploadCompleted = (tempFiles = []) => {
    onChangeText('uploadedFileDtos')(tempFiles);
  };

  function getRequiredData() {
    setLoading(true);
    Promise.all([getEmployeeSisterCompanies()])
      .then((response) => {
        setLoading(false);
        console.log('Get Required Data on Loan screen Response ', response);
        setPreloadedData({
          ...preloadedData,
          // requisitionFor: response[0].data,
          companies: response[0].data,
        });
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  function applyForLoan() {
    setLoading(true);
    console.log('Loan Data ', JSON.stringify(loanData), loanData);
    postLoanRequest(loanData)
      .then((response) => {
        setLoading(false);
        console.log('Post Loan Request response ', response);
        showSuccessToast('Your Request for Loan is Sent Successfully.');
        checkAndGoBack(navigation);
      })
      .catch((error) => {
        onError(error);
        setLoading(false);
      });
  }

  return (
    <BaseContainer
      toolbarTitle={navScreenNames.NAV_LOAN_SCREEN}
      scrollable
      loading={loading}>
      <View style={styles.container}>
        <Text style={styles.header}>Loan Application</Text>
      </View>
      <BaseCard>
        <View>
          <PickerView
            label="Company Name"
            placeholder={{label: ''}}
            value={loanData.sisterCompanyId}
            items={getPickerItems(preloadedData.companies, 'name', 'id')}
            onValueChange={(labelId) =>
              onChangeText('sisterCompanyId')(labelId)
            }
            labelStyle={styles.labelText}
            pickerStyle={styles.inputBoxStyle}
            pickerContainer={styles.inputBoxContainer}
            editable
          />

          <TextField
            inputTextContainerStyle={{
              ...styles.inputBoxContainer,
              marginHorizontal: AppDimensions.SMALL,
            }}
            label="Amount Requested"
            onChangeText={onChangeText('requestedAmount')}
            value={loanData.requestedAmount}
            labelStyle={styles.labelText}
            editable
          />

          <TextField
            inputTextContainerStyle={{
              ...styles.inputBoxContainer,
              marginHorizontal: AppDimensions.SMALL,
              height: moderateScale(100),
            }}
            label="Reason"
            onChangeText={onChangeText('reason')}
            value={loanData.reason}
            labelStyle={styles.labelText}
            multiline
            editable
          />

          <View>
            <Text style={styles.labelText}>Upload Attachments</Text>
            <DocImagePicker
              editable
              initialItems={[]}
              onItemSelected={onAttachmentChanged}
            />
            {[].map((doc, index) => (
              <Text>{doc.displayName}</Text>

              // <MoreDocumnetPicker
              //   key={String(index)}
              //   editable
              //   uri={doc.viewFileURL}
              //   name={doc.displayFileName}
              //   //   onMinusPressed={() => onItemDel(key, index, 'document')}
              //   //   onItemSelected={sendFileToServer(
              //   //     key,
              //   //     setLoading,
              //   //     preloadedData.dynamicFileLabelTypes,
              //   //     setLogo,
              //   //     onDocumentUploaded,
              //   //   )}
              // />
            ))}
          </View>
          <Button type="primary" style={styles.button} onPress={applyForLoan}>
            Apply
          </Button>
        </View>
      </BaseCard>
    </BaseContainer>
  );
};

export default LoanScreen;

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.NORMAL,
    margin: AppDimensions.SMALLER,
  },
  header: {
    ...HEADING_TEXT_SIZE,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: AppDimensions.LARGE,
    color: AppColors.ACCENT,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: AppDimensions.NORMAL,
  },
  buttonContainer: {
    left: '80%',
  },
  inputStyle: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: AppColors.LIST_ITEM_BG,
    backgroundColor: AppColors.LIST_ITEM_BG,
    width: '60%',
  },
  labelContainer: {
    marginVertical: AppDimensions.SMALL,
  },

  collapsableContainer: {
    borderBottomWidth: 1,
    borderColor: AppColors.LIST_ITEM_BG,
  },

  inputBoxContainer: {
    backgroundColor: AppColors.LIST_ITEM_BG,
    borderWidth: 0.5,
    borderColor: AppColors.ITEM_BG,
  },
  inputBoxStyle: {
    paddingHorizontal: AppDimensions.NORMAL,
    paddingVertical: AppDimensions.NORMAL,
    // borderWidth: 1,
    // borderColor: 'red',
  },

  datePickerContainer: {
    backgroundColor: AppColors.SMOKE_WHITE,
  },

  button: {
    marginVertical: AppDimensions.NORMAL,
    width: moderateScale(100),
    alignSelf: 'flex-end',
  },
  labelText: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    paddingVertical: AppDimensions.NORMAL,
    // borderWidth: 1,
  },
  normalText: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
  },
});
