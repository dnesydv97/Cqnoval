import React from 'react';
import {EmailMessage, LeaveMessage} from '../msgTypeComponents';
import LoanMessage from '../msgTypeComponents/LoanMessage';

export function componentProvider(msgType, detail) {
  if (msgType === 'Leave')
    return <LeaveMessage id={detail.applicationTypeDetails?.id} />;
  else if (msgType === 'QuickMessage')
    return (
      <EmailMessage message={detail.applicationTypeDetails?.description} />
    );
  else if (msgType === 'Loan')
    return <LoanMessage id={detail.applicationTypeDetails?.id} />;
}
