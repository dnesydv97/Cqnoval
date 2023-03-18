export const endPoints = {
  USER_LOGIN: 'connect/token',
  GET_USER_DETAIL: 'api/app/employeeRequest/employeeDetail',
  UPDATE_USER_DETAIL: 'api/app/employeeRequest/userRegistrationAddUpdate',
  UPDATE_USER_PERSONAL_DETAIL:
    'api/app/employeeRequest/employeePersonalProfileUpdate',
  UPDATE_USER_OFFICIAL_DETAIL:
    'api/app/employeeRequest/employeeOfficalProfileUpdate',
  GET_USERS: 'api/app/employeeRequest/employeesPagination',
  GET_GENDERS: 'api/app/employeeRequest/genderList',
  GET_MARITAL_STATUS: 'api/app/employeeRequest/maritalStatusList',
};

export const contactEndPoints = {
  GET_ALL_SOW: 'api/app/contactRequest/scopeOfWorkListing',
  GET_SEARCH_SOW: 'api/app/contactRequest/scopeOfWorkSearchListing',
  ADD_SOW: 'api/app/contactRequest/scopeOfWorkAdd',
  GET_ALL_SEARCH_TAGS: 'api/app/contactRequest/searchTagListing',
  ADD_SEARCH_TAG: 'api/app/contactRequest/searchTagAdd',
  GET_ALL_CONTACT_SOURCE: 'api/app/contactRequest/contactSourceListing',
  GET_ALL_CONTACT_LABELS: 'api/app/contactRequest/contactLabelListing',
  GET_ALL_CONTACT_LABEL_GROUPS:
    'api/app/contactRequest/contactLabelGroupListing',
  GET_ALL_CONTACT_LABEL_LIST:
    'api/app/contactRequest/contactCompanyPersonDataListing',
  GET_ALL_COUNTRY: 'api/app/contactRequest/countryListing',
  GET_ALL_CITY: 'api/app/contactRequest/cityListing',
  GET_FAV_SEARCH_COMPANY_PERSON:
    'api/app/contactRequest/contactCompanyPersonSearchPagination',
  GET_CONTACT_COMPANIES: 'api/app/contactRequest/contactCompanyPagination',
  GET_CONTACT_PERSONS: 'api/app/contactRequest/contactPersonPagination',
  ADD_CONTACT_PERSON: 'api/app/contactRequest/contactPersonAdd/',
  ADD_CONTACT_COMPANY: 'api/app/contactRequest/contactCompanyDetailAdd/',
  MAKE_FAV_CONTACT_PERSON:
    'api/app/contactRequest/contactFavoritePersonAddUpdate/',
  MAKE_FAV_CONTACT_COMPANY:
    'api/app/contactRequest/contactFavoriteCompanyAddUpdate/',
  QUICK_ADD_CONTACT_COMPANY: 'api/app/contactRequest/contactCompanyQuickAdd/',
  GET_CONTACT_PERSON_DETAIL: 'api/app/contactRequest/contactPersonGetDetails/',
  GET_CONTACT_COMPANY_DETAIL:
    'api/app/contactRequest/contactCompanyGetDetails/',
  UPDATE_CONTACT_PERSON: 'api/app/contactRequest/contactPersonUpdate/',
  UPDATE_CONTACT_COMPANY: 'api/app/contactRequest/contactCompanyUpdate/',
};

export const referenceEndPoint = {
  GET_ALL_PROJECT: 'api/app/referenceManagement/projectListing',
  GET_PROJECTS: 'api/app/referenceManagement/projectsPagination?MaxResultCount=1000&SkipCount=0',
  GET_ALL_PROJECT_DETAIL: 'api/app/referenceManagement/projectGetDetails/',
  ADD_PROJECT: 'api/app/referenceManagement/projectAdd/',
  UPDATE_PROJECT: 'api/app/referenceManagement/projectUpdate/',
  GET_PROJECT_SECTOR:
    'api/app/referenceManagement/projectSectorGetDetailsByProjectId/',
  GET_PROJECT_FUNDING_AGENCY:
    'api/app/referenceManagement/projectFundingAgencyGetDetailsByProjectId/',
  MAKE_FAV_TENDER_REFERENCE: '/api/app/referenceManagement/tenderFavoriteAddUpdate',
  MAKE_FAV_PROJECT_REFERENCE: '/api/app/referenceManagement/projectFavoriteAddUpdate',
  // MAKE_FAV_OTHER_REFERENCE: '',  
  GET_PROJECT_CURRENCY_LIST: 'api/app/referenceManagement/projectCurrencyList/',
  GET_PROJECT_STATUS: 'api/app/referenceManagement/projectStatusListing/',
  GET_PROJECT_MODALITY: 'api/app/referenceManagement/modalityGetDetails/',
  GET_TENDER_LIST: 'api/app/referenceManagement/tenderBasicPagination?MaxResultCount=1000&SkipCount=0',
  GET_TENDER_DETAIL: 'api/app/referenceManagement/tenderBasicGetDetails/',
  GET_TENDER_EXTENSION: '/api/app/referenceManagement/tenderExtensionGetDetails/',
  GET_OTHER_LIST: '/api/app/referenceManagement/referenceOthersPagination?MaxResultCount=1000&SkipCount=0',
  UPDATE_TENDER: 'api/app/referenceManagement/tenderBasicUpdate/',
  GET_ALL_SECONDARY_INCHARGE: 'api/app/referenceManagement/tenderBasicSecondaryInchargeGetDetailsByTenderBasicId',
};

export const fileUploadEndPoints = {
  UPLOAD_USER_DOC: 'api/app/employeeRequest/documentFilesAddUpdate',
  GET_FILE_LABEL_GROUP_LIST: 'api/app/file/fileLableTypeGroupListing',
  GET_DYNAMIC_FILE_LABEL_TYPE_UPLOADER_DETAIL:
    'api/app/file/dynamicFileLabelTypeUploaderDetailDtos',
  GET_DYNAMIC_FILE_LABEL_TYPE_UPLOADER_DETAIL:
    'api/app/file/dynamicFileLabelTypeUploaderDetailDtos',
  UPLOAD_FILE: 'api/app/file/uploadFile/',
};

export const organizerEndPoint = {
  //HOLIDAY
  GET_FISCAL_YEARS_WITH_STATUS:
    'api/app/organizationStructure/fiscalYearListingWithStatus',
  GET_HOLIDAY_PAGINATION: 'api/app/organizerEvent/holidayEventsPagination',
  ADD_HOLIDAY: 'api/app/organizerEvent/holidayEventBulkAddUpdate',
  GET_HOLIDAY_DETAIL: 'api/app/organizerEvent/holidayEventGetDetails',

  //GOAL
  GET_GOAL_LABELS: 'api/app/organizerEvent/organizerEventLabelListing',
  GET_GOAL_PRIORITY: 'api/app/organizerEvent/organizerEventPriorityListing',
  ADD_GOAL: 'api/app/organizerEvent/goalEventAdd',
  GET_GOAL_PAGINATION: 'api/app/organizerEvent/goalEventsPagination',
  GET_GOAL_DETAIL: 'api/app/organizerEvent/goalEventGetDetails',
  UPDATE_GOAL: 'api/app/organizerEvent/goalEventUpdate',

  //GUEST
  GET_GUEST_LABELS: 'api/app/organizerEvent/guestEventStatusListing',
  ADD_GUEST: 'api/app/organizerEvent/guestEventAdd',
  GET_GUEST_PAGINATION: 'api/app/organizerEvent/guestEventsPagination',
  GET_GUEST_DETAIL: 'api/app/organizerEvent/guestEventGetDetails',
  UPDATE_GUEST: 'api/app/organizerEvent/guestEventUpdate',

  //APPOINTMENT
  GET_APPOINTMENT_LABELS: 'api/app/organizerEvent/appointmentEventLabelListing',
  ADD_APPOINTMENT: 'api/app/organizerEvent/appointmentEventAdd',
  UDPATE_APPOINTMENT: 'api/app/organizerEvent/appointmentEventUpdate',
  GET_APPOINTMENT_PAGINATION:
    'api/app/organizerEvent/appointmentEventsPagination',
  GET_APPOINTMENT_DETAIL: 'api/app/organizerEvent/appointmentEventGetDetails',
  MARK_APPOINTMENT_OFF: 'api/app/organizerEvent/appointmentEventMarkItOff',

  GET_USER_LIST:
    '/api/app/organizationStructure/userReportingManagerUserListing',

  //TODO
  GET_TODO_STATUS: 'api/app/organizerEvent/todoEventStatusListing',
  ADD_TODO: 'api/app/organizerEvent/todoEventAdd',
  UDPATE_TODO: 'api/app/organizerEvent/todoEventUpdate',
  GET_TODO_PAGINATION: 'api/app/organizerEvent/todoEventsPagination',
  GET_TODO_DETAIL: 'api/app/organizerEvent/todoEventGetDetails',

  //MEETING
  GET_MEETING_STATUS: 'api/app/organizerEvent/meetingEventStatusListing',
  GET_MEETING_SISTER_COMPANY: 'api/app/organizerEvent/sisterCompanyListing',
  GET_EMP_SISTER_COMPANY_NAME_LIST:
    'api/app/organizerEvent/employeeSisterCompanyListing',
  ADD_MEETING: 'api/app/organizerEvent/meetingEventAdd',
  UDPATE_MEETING: 'api/app/organizerEvent/meetingEventUpdate',
  MARK_MEETING_COMPLETE: 'api/app/organizerEvent/meetingEventMakeComplete',
  GET_MEETING_PAGINATION: 'api/app/organizerEvent/meetingEventsPagination',
  GET_MEETING_DETAIL: 'api/app/organizerEvent/meetingEventGetDetails',
  GET_MEETING_AGENDA: 'api/app/organizerEvent/meetingEventAgendaDecisionsList',

  //Calendar
  GET_CALENDAR_EVENTS: 'api/app/organizerEvent/calendarEventList',
};

export const mailEndPoints = {
  GET_PARTICIPANT_TYPE_LIST:
    'api/app/mailMessageCenter/mailMessageParticipantTypeListing',
  GET_PARTICIPANT_STATUS_LIST:
    'api/app/mailMessageCenter/mailMessageParticipantStatusListing',
  POST_INTERNAL_MESSAGE: 'api/app/mailMessageCenter/composeQuickMessage',
  GET_INBOX_MAIL: 'api/app/mailMessageCenter/mailMessageCenterPagination',
  COMPOSE_QUICK_MAIL: 'api/app/mailMessageCenter/composeQuickMessage',
  ADD_INSTANCE_MESSAGE_TEMPLATE:
    'api/app/mailMessageCenter/instanceMessageTemplateAdd',
  UPDATE_INSTANCE_MESSAGE_TEMPLATE:
    'api/app/mailMessageCenter/instanceMessageTemplateUpdate/{instanceMessageTemplateId}',
  GET_INSTANCE_MESSAGE_TEMPLATE_LIST:
    'api/app/mailMessageCenter/instanceMessageTemplatesListing',
  GET_INSTANCE_MESSAGE_TEMPLATE_DETAIL:
    'api/app/mailMessageCenter/instanceMessageTemplateGetDetails/{instanceMessageTemplateId}',

  GET_INSTANCE_MESSAGES:
    'api/app/mailMessageCenter/messageCenterInstanceMessagePagination',
  SEND_INSTANCE_MESSAGE: 'api/app/mailMessageCenter/instanceMessageAdd',
  UPDATE_INSTANCE_MESSAGE_TEXT:
    '/api/app/mailMessageCenter/instanceMessageUpdate',
  UPDATE_INSTANCE_MESSAGE_PARTICIPANTS:
    '/api/app/mailMessageCenter/instanceMessageParticipantUpdate/',
  UPDATE_INSTANCE_MESSAGE_ATTACHMENTS:
    '/api/app/mailMessageCenter/instanceMessageAttachmentUpdate/',
  UPDATE_INSTANCE_MESSAGE:
    '/api/app/mailMessageCenter/instanceMessageUpdateAll',
  GET_PARTICIPANT_TYPE_EMAIL_LISTING:
    '/api/app/emailMessage/participantTypeEmailAddressesListing',
  GET_FROM_EMAIL_LISTING:
    '/api/app/emailMessage/emailAddressesFromWithBehalfOfListing',
  COMPOSE_EMAIL_AS_DRAFT: '/api/app/emailMessage/composeEmailMessageAsDraft',
  COMPOSE_EMAIL: '/api/app/emailMessage/composeEmailMessage',
  CHANGE_EMAIL_STATUS:
    'api/app/mailMessageCenter/participantInstanceMessage_AllStatus',
};

export const leaveEndPoints = {
  GET_LEAVE_TYPE: 'api/app/requisitionManagement/leaveTypeListing',
  GET_LEAVE_DETAIL:
    'api/app/requisitionManagement/leaveApplicationGetDetailsWithHistoryAndRemaining/',
  GET_APPLIED_LEAVE_LIST:
    'api/app/requisitionManagement/leaveApplicationPagination',
  POST_LEAVE: 'api/app/requisitionManagement/leaveApplicationAdd',
  APPROVE_REJECT_LEAVE:
    'api/app/requisitionManagement/leaveApplicationApproveReject',
  GET_SUPERVISOR_LIST: 'api/app/requisitionManagement/supervisorDetail',
  GET_LEAVE_TYPE_REMAINING:
    'api/app/requisitionManagement/remainingLeaveApplicationTypesForEmployee',
  GET_LEAVE_TYPE_LIST:
    'api/app/requisitionManagement/leaveApplicationTypePagination',
  GET_LEAVE_STATUS_LIST:
    'api/app/requisitionManagement/requisitionApplicationStatusListing',
};

export const loanEndPoints = {
  GET_REQUISITION_FOR: 'api/app/requisitionManagement/',
  POST_LOAN: 'api/app/loanApplicationManagement/loanApplicationAdd',
  GET_LOAN_LIST: 'api/app/loanApplicationManagement/loanApplicationPagination',
  GET_LOAN_DYNAMIC_DETAIL:
    'api/app/loanApplicationManagement/loanApplicationDynamicParticipantDataGetDetails/',
  GET_LOAN_STATUS:
    'api/app/loanApplicationManagement/loanApplicationStatusListing',
  CHANGE_LOAN_STATUS:
    'api/app/loanApplicationManagement/changeLoanApplicationStatus/',
};
