import {messages} from 'constant';
import {showInfoToast} from './ToastHelper';

export function isLoginValid(credential) {
  const returnObj = {valid: false, error: {username: false, password: false}};
  if (!credential.username || !credential.password) {
    if (!credential.username) {
      returnObj.valid = false;
      returnObj.error.username = messages.EMAIL_REQUIRED;
    }
    if (!credential.password) {
      returnObj.valid = false;
      returnObj.error.password = messages.PASSWORD_REQUIRED;
    }
    
    return returnObj;
  }
  //   

  return {...returnObj, valid: true};
}
export function isFormFilled(formData) {
  const formObj = {valid: false, error: {companyName: false, companyAbbreviation: false, contactSourceId: false, mailAddress: false, contactLabelDataValue: false, notes: false, scopeOfWork: false}};
  if(!formData.companyName || !formData.companyAbbreviation || !formData.contactSourceId || !formData.mailAddress ||  !formData.contactLabelDataValue || !formData.notes || !formData.scopeOfWork){
    if(!formData.companyName) {
      formObj.valid = false;
      formObj.error.companyName = messages.COMPANY_NAME;
    }
    if(!formData.companyAbbreviation) {
      formObj.valid = false;
      formObj.error.companyAbbreviation = messages.COMPANY_ABBREVIATION;
    }
    if(!formData.mailAddress) {
      formObj.valid = false;
      formObj.error.mailAddress = messages.MAIL_ADDRESS;
    }  
    if(!formData.contactSourceId) {
      formObj.valid = false;
      formObj.error.contactSourceId = messages.CONTACT_SOURCE;
    }
    if(!formData.contactLabelDataValue) {
      formObj.valid = false;
      formObj.error.contactLabelDataValue = messages.CONTACT_LABEL;
    }
    if(!formData.notes) {
      formObj.valid = false;
      formObj.error.notes = messages.NOTES;
    }
    if(!formData.scopeOfWork) {
      formObj.valid = false;
      formObj.error.scopeOfWork = messages.SCOPE_OF_WORK;
    }
      return formObj;
  }

  return {...formObj, valid: true};
}
export function isDataValid(data) {
  return data ? true : false;
}

export function isMobileValid(mobileNumber) {
  const ph = new RegExp(/^[9]\d{9}$/);
  return !isNaN(mobileNumber) && ph.test(mobileNumber);
}

export function isEmailValid(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
