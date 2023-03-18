import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from '@ant-design/react-native';
import {BaseCard, EqualSpaceHorizontalView, TextField} from 'components';
import {
  getDateOnRequiredFormat,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import {getDynamicLoanDetailById, changeLoanStatus} from 'services';

const LoanMessage = ({id = null}) => {
  const [loanData, setLoanData] = useState();
  const [btnVisibility, setBtnVisibility] = useState(true);
  const [steps, setSteps] = useState({
    one: 'coming',
    two: 'coming',
    three: 'coming',
    four: 'coming',
  });
  const [suComments, setSuComments] = useState('');
  const [fromAccount, setFromAccount] = useState({
    amountOutStanding: 0,
    providentFundDepositTillDate: getDateOnRequiredFormat(),
  });
  const [loanApproval, setLoanApproval] = useState({
    approvedAmount: 0,
    loanRepaymentAmountPerMonth: 0,
    loanApproveRejectComment: '',
  });

  useEffect(() => {
    id && getLoanDetail();
  }, [id]);

  useEffect(() => {
    getStepStatus();
  }, [loanData]);

  const getLoanDetail = () => {
    getDynamicLoanDetailById(id)
      .then((response) => {
        console.log('Dynamic loan detail response ', response);
        if (response.status === 200) setLoanData(response.data);
      })
      .catch((error) => {
        onError(error);
      });
  };

  const updateLoanStatus = (isReject = false) => {
    let currentStatus =
      loanData?.loanApplicationMetaData.loanApplicationParticipantStatusDto
        .loanApplicationStatusDto.systemName;

    if (currentStatus === 'Apply' || !suComments) {
      showFailToast("Supervisor's Comment is required");
      return;
    } else if (
      currentStatus === 'Recommend' ||
      !fromAccount.amountOutStanding ||
      !fromAccount.providentFundDepositTillDate
    ) {
      showFailToast('Loan Amount and Date is required');
      return;
    } else if (
      currentStatus === 'Verified' ||
      !loanApproval.approvedAmount ||
      !loanApproval.loanApproveRejectComment ||
      !loanApproval.loanRepaymentAmountPerMonth
    ) {
      showFailToast(
        'Approved Amount, Repayment Amount and Comment is required',
      );
      return;
    }

    let loanApplicationStatusName = '';
    if (isReject) loanApplicationStatusName = 'Reject';
    else {
      switch (currentStatus) {
        case 'Apply':
          loanApplicationStatusName: 'Recommend';
        case 'Recommend':
          loanApplicationStatusName: 'Verified';
        case 'Verified':
          loanApplicationStatusName: 'Approved';
      }
    }

    let data = {
      loanApplicationStatusName,
      recommendationText: suComments,
      ...fromAccount,
      ...loanApproval,
    };

    changeLoanStatus(id, data)
      .then((response) => {
        console.log('Change loan status response ', response);
        if (response.status === 200) {
          showSuccessToast(
            'Your request is successfully forwarded to concerned person.',
          );
          setBtnVisibility(false);
        }
      })
      .catch((error) => {
        onError(error);
      });
  };

  const onFromAcountChange = (key) => (value) =>
    setFromAccount({
      ...fromAccount,
      [key]: value,
    });

  const onLoanApprovalChange = (key) => (value) =>
    setLoanApproval({
      ...loanApproval,
      [key]: value,
    });

  const StepView = ({status, text, stepCount}) => (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View
        style={{
          backgroundColor:
            status === 'coming'
              ? AppColors.SMOKE_WHITE
              : status === 'current'
              ? AppColors.TAG_ORANGE
              : AppColors.TAG_GREEN,
          borderColor:
            status === 'coming'
              ? AppColors.SMOKE_WHITE
              : status === 'current'
              ? AppColors.TAG_ORANGE
              : AppColors.TAG_GREEN,
          borderWidth: 1,
          height: moderateScale(18),
          width: moderateScale(18),
          borderRadius: moderateScale(10),
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: AppDimensions.SMALLEST,
        }}>
        <Text
          style={{
            ...SMALLER_TEXT_STYLE,
            color:
              status === 'coming' ? AppColors.UTIL : AppColors.NORMAL_WHITE,
          }}>
          {status === 'complete' ? '✓' : stepCount}
        </Text>
      </View>
      <Text
        style={{
          fontSize: moderateScale(11),
          color:
            status === 'coming'
              ? AppColors.UTIL
              : status === 'current'
              ? AppColors.TAG_ORANGE
              : AppColors.TAG_GREEN,
        }}>
        {text}
      </Text>
    </View>
  );

  const HorizontalLine = ({width = 10, color = AppColors.DISABLE}) => (
    <View
      style={{
        height: 2,
        width: width,
        backgroundColor: color,
        marginHorizontal: AppDimensions.SMALL,
      }}
    />
  );

  function getStepStatus(step) {
    let statusSystemName =
      loanData?.loanApplicationMetaData?.loanApplicationParticipantStatusDto
        .loanApplicationStatusDto?.systemName;

    let stepStatus = {
      one: 'coming',
      two: 'coming',
      three: 'coming',
      four: 'coming',
    };

    if (statusSystemName === 'Apply') {
      stepStatus = {
        one: 'complete',
        two: 'current',
        three: 'coming',
        four: 'coming',
      };
    } else if (statusSystemName === 'Recommend') {
      stepStatus = {
        one: 'complete',
        two: 'complete',
        three: 'current',
        four: 'coming',
      };
    } else if (statusSystemName === 'Verified') {
      stepStatus = {
        one: 'complete',
        two: 'complete',
        three: 'complete',
        four: 'current',
      };
    } else if (
      statusSystemName === 'Approved' ||
      statusSystemName === 'Reject'
    ) {
      stepStatus = {
        one: 'complete',
        two: 'complete',
        three: 'complete',
        four: 'complete',
      };
    }

    setSteps(stepStatus);
  }

  return (
    <View>
      <View style={styles.stepContainer}>
        <StepView status={steps.one} text="Application" stepCount="1" />
        <HorizontalLine />
        <StepView status={steps.two} text="Supervisor" stepCount="2" />
        <HorizontalLine />
        <StepView status={steps.three} text="Account" stepCount="3" />
        <HorizontalLine />
        <StepView status={steps.four} text="Approve" stepCount="4" />
      </View>
      <View style={styles.container}>
        <Text style={styles.header}>From Supervisor</Text>
      </View>
      <BaseCard>
        <TextField
          inputTextContainerStyle={{
            ...styles.inputBoxContainer,
            marginHorizontal: AppDimensions.SMALL,
          }}
          label="From"
          value={
            loanData?.loanApplicationMetaData
              .loanApplicationParticipantStatusDto?.participantUser?.userName
          }
          labelStyle={styles.labelText}
        />
        <TextField
          inputTextContainerStyle={{
            ...styles.inputBoxContainer,
            marginHorizontal: AppDimensions.SMALL,
          }}
          label="Amount Request (NPR)"
          value={loanData?.requestedAmount + ''}
          labelStyle={styles.labelText}
        />

        <TextField
          inputTextContainerStyle={{
            ...styles.inputBoxContainer,
            marginHorizontal: AppDimensions.SMALL,
          }}
          label="Reason"
          value={loanData?.reason}
          labelStyle={styles.labelText}
          multiline
        />

        {btnVisibility &&
          loanData?.loanApplicationMetaData.loanApplicationParticipantStatusDto
            .loanApplicationStatusDto.systemName === 'Apply' &&
          loanData?.loanApplicationMetaData.isAuthorizedUser && (
            <>
              <TextField
                inputTextContainerStyle={{
                  ...styles.inputBoxContainer,
                  marginHorizontal: AppDimensions.SMALL,
                }}
                label="Supervisor's Comment"
                onChangeText={setSuComments}
                value={loanData?.recommendationText || suComments}
                labelStyle={styles.labelText}
                editable={!loanData.recommendationText}
                multiline
              />
              <EqualSpaceHorizontalView
                containerStyle={{justifyContent: 'space-around'}}>
                <Button
                  type="warning"
                  style={styles.button}
                  onPress={() => updateLoanStatus(true)}>
                  Reject
                </Button>
                <Button
                  type="primary"
                  style={styles.button}
                  onPress={() => updateLoanStatus()}>
                  Recommended
                </Button>
              </EqualSpaceHorizontalView>
            </>
          )}
      </BaseCard>

      {loanData?.loanApplicationMetaData.loanApplicationParticipantStatusDto
        .loanApplicationStatusDto.systemName === 'Recommend' && (
        <>
          <View style={styles.container}>
            <Text style={styles.header}>From Account</Text>
          </View>
          <BaseCard>
            <TextField
              inputTextContainerStyle={{
                ...styles.inputBoxContainer,
                marginHorizontal: AppDimensions.SMALL,
              }}
              onChangeText={onFromAcountChange('amountOutStanding')}
              label="Loan Amount Outstanding Against the Application"
              value={
                loanData?.amountOutStanding || fromAccount.amountOutStanding
              }
              labelStyle={styles.labelText}
              editable={!loanData.amountOutStanding}
            />
            <TextField
              inputTextContainerStyle={{
                ...styles.inputBoxContainer,
                marginHorizontal: AppDimensions.SMALL,
              }}
              label="Provident Fund Deposites till date"
              onChangeText={onFromAcountChange('providentFundDepositTillDate')}
              value={
                loanData?.providentFundDepositTillDate ||
                fromAccount.providentFundDepositTillDate
              }
              labelStyle={styles.labelText}
              editable={!loanData.providentFundDepositTillDate}
            />

            {btnVisibility &&
              loanData?.loanApplicationMetaData.isAuthorizedUser && (
                <EqualSpaceHorizontalView
                  containerStyle={{justifyContent: 'space-around'}}>
                  <Button
                    type="warning"
                    style={styles.button}
                    onPress={() => updateLoanStatus(true)}>
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    style={styles.button}
                    onPress={() => updateLoanStatus()}>
                    Verify
                  </Button>
                </EqualSpaceHorizontalView>
              )}
          </BaseCard>
        </>
      )}

      {loanData?.loanApplicationMetaData.loanApplicationParticipantStatusDto
        .loanApplicationStatusDto.systemName === 'Verified' && (
        <>
          <View style={styles.container}>
            <Text style={styles.header}>Loan Approval</Text>
          </View>
          <BaseCard>
            <TextField
              inputTextContainerStyle={{
                ...styles.inputBoxContainer,
                marginHorizontal: AppDimensions.SMALL,
              }}
              label="Approved Amount"
              onChangeText={onLoanApprovalChange('approvedAmount')}
              value={loanData?.approvedAmount || loanApproval.approvedAmount}
              labelStyle={styles.labelText}
              editable={!loanData.approvedAmount}
            />
            <TextField
              inputTextContainerStyle={{
                ...styles.inputBoxContainer,
                marginHorizontal: AppDimensions.SMALL,
              }}
              label="Loan Repayment Amount (Per month)"
              onChangeText={onLoanApprovalChange('loanRepaymentAmountPerMonth')}
              value={
                loanData?.loanRepaymentAmountPerMonth ||
                loanApproval.loanRepaymentAmountPerMonth
              }
              labelStyle={styles.labelText}
              editable={!loanData.loanRepaymentAmountPerMonth}
            />

            <TextField
              inputTextContainerStyle={{
                ...styles.inputBoxContainer,
                marginBottom: AppDimensions.NORMAL,
                height: moderateScale(100),
              }}
              label="Comment"
              placeholder="Write your comment for loan here..."
              onChangeText={onLoanApprovalChange('loanApproveRejectComment')}
              value={
                loanData?.loanApproveRejectComment ||
                loanApproval.loanApproveRejectComment
              }
              labelStyle={styles.labelText}
              multiline
              editable={!loanData.loanApproveRejectComment}
            />

            {btnVisibility &&
              loanData?.loanApplicationMetaData.isAuthorizedUser && (
                <EqualSpaceHorizontalView
                  containerStyle={{justifyContent: 'space-around'}}>
                  <Button
                    type="warning"
                    style={styles.button}
                    onPress={() => updateLoanStatus(true)}>
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    style={{...styles.button, width: moderateScale(150)}}
                    onPress={() => updateLoanStatus()}>
                    Forward to Manager
                  </Button>
                </EqualSpaceHorizontalView>
              )}
          </BaseCard>
        </>
      )}
    </View>
  );
};

export default LoanMessage;

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.NORMAL,
    margin: AppDimensions.SMALLER,
  },
  header: {
    ...HEADING_TEXT_SIZE,
    fontWeight: 'bold',
  },

  stepContainer: {
    flexDirection: 'row',
    paddingVertical: AppDimensions.NORMAL,
    alignItems: 'center',
  },

  inputBoxContainer: {
    backgroundColor: AppColors.LIST_ITEM_BG,
    borderWidth: 0.5,
    borderColor: AppColors.ITEM_BG,
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
});
