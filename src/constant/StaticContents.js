import {Icons, Images} from 'assets';
import {screenNames, navScreenNames} from './AppConstants';

export const initialState = {
  isLoading: false,
  isError: false,
  data: null,
};

export const loadingInitialState = {
  isLoading: true,
  isError: false,
  data: null,
};

export const defaultValues = {
  INTEGER: '-1',
  STRING: '',
  EMPTY: '',
};

export const initialNewMail = {
  to: '',
  cc: '',
  subject: '',
  message: '',
};

export const initialInternalMsg = {
  subject: '',
  description: '',
  messageText: '',
  referenceId: '',
  partyId: '',
  priorityId: '',
  predefinedMsg: '',
  quickMessageStatusId: '',
  mailMessageCenterId: '',
  replyOfInstanceMessageId: '',
  instanceMessageStatusId: '',
  quickMessageStatusName: '',
  orderNumber: -1,
  quickMessageAttachmentDtos: [],
  quickMessageParticipantDtos: [],
  mailMessageParticipantWithTypeDtos: {
    participantTos: [],
    participantCCs: [],
    participantBCCs: [],
  },
  toParticipants: [],
  ccParticipants: [],
  bccParticipants: [],
};

export const initialMailTemplete = {
  id: null,
  title: '',
  body: '',
  priorityId: null,
  referenceId: null,
  emailMessageAttachmentDtos: [],
  emailMessageParticipantWithTypeDtos: {
    participantFrom: null,
    participantTos: [],
    participantCCs: [],
    participantBCCs: [],
  },
  emailMessageStatusName: '',
  emailInstanceMessageAddDto: {
    description: '',
    emailInstanceMessageStatusName: '',
    emailMessageParticipantWithTypeDtos: {
      participantFrom: null,
      participantTos: [],
      participantCCs: [],
      participantBCCs: [],
    },
    emailInstanceMessageAttachmentDtos: [],
  },
  participantFrom: null,
  toParticipants: [],
  ccParticipants: [],
  bccParticipants: [],
};

export const messages = {
  USER_NAME_REQUIRED: 'User Name is Required Field!!!',
  EMAIL_REQUIRED: 'Email is Required Field!!!',
  USERNAME_INCORRECT: 'Username is incorrect',
  PASSWORD_INCORRECT: 'Password is incorrect',
  PASSWORD_REQUIRED: 'Password is Required Field!!!',
  PROFILE_UPDATE_SUCCESS: 'Profile Updated Successfully.',
  PROFILE_UPDATE_FAILED: 'Failed To Update Profile.',
  COMPANY_UPDATE_SUCCESS: 'Company Detail Updated Successfully',
  COMPANY_UPDATE_FAILED: 'Failed To Update Company Detail',
  HOLIDAY_ADDED_SUCCESS: 'Holiday Successfully Added',
  HOLIDAY_ADDED_FAIL: 'Failed To Add Holiday',
  HOLIDAY_UPDATE_SUCCESS: 'Holiday Detail Updated Successfully',
  HOLIDAY_UPDATE_FAILED: 'Failed To Update Holiday Detail',
  HOLIDAY_DETAIL_FAILED: 'Failed To Get Holiday Details',
  GOAL_ADDED_SUCCESS: 'Goal Successfully Added',
  GOAL_ADDED_FAIL: 'Failed To Add Goal',
  GOAL_UPDATE_SUCCESS: 'Goal Detail Updated Successfully',
  GOAL_UPDATE_FAILED: 'Failed To Update Goal Detail',
  GOAL_DETAIL_FAILED: 'Failed To Get Goal Details',
  FAILED_TO_ADD_FAV: 'Failed To add to Favourite.',
  SUCCESS_TO_ADD_FAV: 'Successfully added to your favourite list.',
  SUCCESS_TO_REMOVE_FAV: 'Successfully removed to your favourite list.',
  FAILED_TO_GET_AGENDA: 'Failed, to get agendas.',
  COMPANY_NAME: 'Company Name Required',
  COMPANY_ABBREVIATION: 'Company Abbreviation Required',
  MAIL_ADDRESS: 'Mail Address Required',
  CONTACT_SOURCE: 'Contact source Required',
  CONTACT_LABEL: 'Contact Label Required',
  NOTES: 'Notes Required',
  SCOPE_OF_WORK: 'Scope Of Work Required',
};

export const drawerMenu = [
  {
    id: 1,
    icon: Icons.iconHome,
    title: 'Home',
    screen: navScreenNames.NAV_DASHBOARD_SCREEN,
  },
  {
    id: 2,
    icon: Icons.iconLogout,
    title: 'Logout',
    screen: navScreenNames.NAV_LOG_OUT,
  },
  {
    id: 3,
    icon: Icons.iconCalendar,
    title: 'Organizer',
    screen: navScreenNames.NAV_CALENDAR_SCREEN,
  },
  {
    id: 4,
    icon: Icons.iconMail,
    title: 'Mail',
    screen: navScreenNames.NAV_MAIL_SCREEN,
  },
];

export const drawerMenuSuperVisor = [
  {
    id: 1,
    icon: Icons.iconHome,
    title: 'Home',
    screen: navScreenNames.NAV_DASHBOARD_SCREEN,
  },
  {
    id: 2,
    icon: Icons.iconMail,
    title: 'Mail',
    screen: navScreenNames.NAV_MAIL_SCREEN,
  },
  {
    id: 3,
    icon: Icons.iconCalendar,
    title: 'Organizer',
    screen: navScreenNames.NAV_CALENDAR_SCREEN,
  },
  {
    id: 4,
    icon: Icons.iconBusiness,
    title: 'Business',
    screen: navScreenNames.NAV_PDF_VIEWER_SCREEN,
  },
  {
    id: 5,
    icon: Icons.iconMeeting,
    title: 'HR & Admin',
    screen: navScreenNames.NAV_EMPLOYEE_SCREEN,
  },
  {
    id: 6,
    icon: Icons.iconLeave,
    title: screenNames.LEAVE_LIST_SCREEN,
    screen: navScreenNames.NAV_LEAVE_LIST_SCREEN,
  },
  {
    id: 7,
    icon: Icons.iconDocument,
    title: screenNames.LOAN_LIST_SCREEN,
    screen: navScreenNames.NAV_LOAN_LIST_SCREEN,
  },
  {
    id: 8,
    icon: Icons.iconBusiness,
    title: 'Business References',
    screen: navScreenNames.NAV_REFERENCE_SCREEN,
  },
  {
    id: 9,
    icon: Icons.iconLogout,
    title: 'Logout',
    screen: navScreenNames.NAV_LOG_OUT,
  },
];

export const mailDrawer = [
  {
    id: 1,
    icon: Icons.iconInbox,
    title: 'Inbox',
    screen: navScreenNames.NAV_INBOX_SCREEN,
    subMenu: [
      {
        id: 11,
        icon: '',
        title: 'To',
        screen: navScreenNames.NAV_INBOX_SCREEN,
      },
      {
        id: 12,
        icon: '',
        title: 'Cc',
        screen: navScreenNames.NAV_INBOX_SCREEN,
      },
      {
        id: 13,
        icon: '',
        title: 'Bcc',
        screen: navScreenNames.NAV_INBOX_SCREEN,
      },
      {
        id: 14,
        icon: '',
        title: 'Corporate',
        screen: navScreenNames.NAV_INBOX_SCREEN,
      },
      {
        id: 15,
        icon: '',
        title: 'Junk',
        screen: navScreenNames.NAV_INBOX_SCREEN,
      },
    ],
  },
  {
    id: 2,
    icon: Icons.iconOutbox,
    title: 'Outbox',
    screen: navScreenNames.NAV_OUTBOX_SCREEN,
  },
  {
    id: 3,
    icon: Icons.iconArchive,
    title: 'Sent',
    screen: navScreenNames.NAV_INBOX_SCREEN,
  },
  {
    id: 4,
    icon: Icons.iconPending,
    title: 'Pending',
    screen: navScreenNames.NAV_INBOX_SCREEN,
  },
  {
    id: 5,
    icon: Icons.iconArchive,
    title: 'Archived',
    screen: navScreenNames.NAV_INBOX_SCREEN,
  },
  {
    id: 6,
    icon: Icons.iconStarred,
    title: 'Starred',
    screen: navScreenNames.NAV_INBOX_SCREEN,
  },
  {
    id: 7,
    icon: Icons.iconDraft,
    title: 'Drafts',
    screen: navScreenNames.NAV_INBOX_SCREEN,
  },
  {
    id: 8,
    icon: Icons.iconTrash,
    title: 'Trash',
    screen: navScreenNames.NAV_INBOX_SCREEN,
  },
];

export const mailDrawerSuperVisor = [
  {
    id: 1,
    icon: Icons.iconInbox,
    title: 'Inbox',
    screen: navScreenNames.NAV_INBOX_SCREEN,
  },
  {
    id: 2,
    icon: Icons.iconOutbox,
    title: 'Outbox',
    screen: navScreenNames.NAV_OUTBOX_SCREEN,
  },
  {
    id: 3,
    icon: Icons.iconMessage,
    title: 'Sent',
    screen: navScreenNames.NAV_SENT_SCREEN,
  },
];

export const organizerDrawer = [
  {
    id: 1,
    icon: Icons.iconBusiness,
    title: 'Business',
    screen: navScreenNames.NAV_BUSINESS_DUE_DATE_SCREEN,
  },
  {
    id: 2,
    icon: Icons.iconCalendar,
    title: 'Calendar',
    screen: navScreenNames.NAV_CALENDARS_SCREEN,
  },
  {
    id: 3,
    icon: Icons.iconGoal,
    title: 'Goal',
    screen: navScreenNames.NAV_GOAL_SCREEN,
  },
  {
    id: 4,
    icon: Icons.iconMeeting,
    title: 'Meeting',
    screen: navScreenNames.NAV_MEETING_SCREEN,
  },
  {
    id: 5,
    icon: Icons.iconTask,
    title: 'Task',
    screen: navScreenNames.NAV_TASK_SCREEN,
  },
  {
    id: 6,
    icon: Icons.iconGuest,
    title: 'Guest',
    screen: navScreenNames.NAV_GUEST_SCREEN,
  },
];

export const organizerDrawerSuperVisor = [
  {
    id: 1,
    icon: Icons.contactIcon,
    title: 'Business',
    screen: navScreenNames.NAV_BUSINESS_DUE_DATE_SCREEN,
  },
  {
    id: 2,
    icon: Icons.iconCalendar,
    title: 'Calendar',
    screen: navScreenNames.NAV_CALENDARS_SCREEN,
  },
  {
    id: 3,
    icon: Icons.iconGoal,
    title: 'Goal',
    screen: navScreenNames.NAV_GOAL_SCREEN,
  },
  {
    id: 4,
    icon: Icons.iconMeeting,
    title: 'Meeting',
    screen: navScreenNames.NAV_MEETING_SCREEN,
  },
  {
    id: 5,
    icon: Icons.iconTask,
    title: 'Task',
    screen: navScreenNames.NAV_TASK_SCREEN,
  },
  {
    id: 6,
    icon: Icons.iconGuest,
    title: 'Guest',
    screen: navScreenNames.NAV_GUEST_SCREEN,
  },
];

export const ContactDrawerMenu = [
  {
    id: 1,
    icon: Icons.contactIcon,
    title: screenNames.COMPANY_SCREEN,
    screen: navScreenNames.NAV_COMPANY_SCREEN,
  },
  {
    id: 2,
    icon: Icons.iconContact,
    title: screenNames.PERSON_SCREEN,
    screen: navScreenNames.NAV_PERSON_SCREEN,
  },
];

export const hrDrawerMenu = [
  {
    id: 1,
    icon: Icons.iconHoliday,
    title: screenNames.HOLIDAY_SCREEN,
    screen: navScreenNames.NAV_HOLIDAY_SCREEN,
  },
  {
    id: 2,
    icon: Icons.iconLeave,
    title: screenNames.LEAVE_LIST_SCREEN,
    screen: navScreenNames.NAV_LEAVE_LIST_SCREEN,
  },
  {
    id: 3,
    icon: Icons.iconLoan,
    title: screenNames.LOAN_LIST_SCREEN,
    screen: navScreenNames.NAV_LOAN_LIST_SCREEN,
  },
];

export const hrDrawerSuperVisorMenu = [
  {
    id: 1,
    icon: Icons.contactIcon,
    title: screenNames.HOLIDAY_SCREEN,
    screen: navScreenNames.NAV_HOLIDAY_SCREEN,
  },
];
export const extraTabMenus = [
  {
    id: 1,
    name: 'user',
    title: 'Admin',
    screen: navScreenNames.NAV_PROFILE_SCREEN,
    active: false,
  },
  {
    id: 2,
    name: 'account-book',
    title: 'HR',
    screen: navScreenNames.NAV_HR_DRAWER_TAB_ROUTE,
    active: false,
  },
  {
    id: 3,
    name: 'contacts',
    title: 'Contact',
    screen: navScreenNames.NAV_CONTACT_SCREEN,
    active: false,
  },
  {
    id: 4,
    name: 'profile',
    title: 'Approval',
    // screen: navScreenNames.NAV_CONTACT_SCREEN,
    active: false,
  },
  {
    id: 5,
    name: 'profile',
    title: 'Documents',
    // screen: navScreenNames.NAV_CONTACT_SCREEN,
    active: false,
  },
];

export const jwtToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IkRFTzlsVFVZbzhPQ1lJUmZCcTBIT0EiLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE2MDc2NjYxNTMsImV4cCI6MTYzOTIwMjE1MywiaXNzIjoiaHR0cHM6Ly9jcW5vdmFsaWQuaW5mby5jb20ubnAiLCJhdWQiOiJGcmFtZXdvcmsiLCJjbGllbnRfaWQiOiJGcmFtZXdvcmtfQXBwIiwic3ViIjoiNzNmYzk0NTctNmI2My02YTRhLTY0ZGUtMzlmOTYwNzIyNzMxIiwiYXV0aF90aW1lIjoxNjA3NjY2MTUzLCJpZHAiOiJsb2NhbCIsInJvbGUiOiJhZG1pbiIsInBob25lX251bWJlcl92ZXJpZmllZCI6IkZhbHNlIiwiZW1haWwiOiJhZG1pbkBhYnAuaW8iLCJlbWFpbF92ZXJpZmllZCI6WyJGYWxzZSIsZmFsc2VdLCJuYW1lIjoiYWRtaW4iLCJzY29wZSI6WyJhZGRyZXNzIiwiZW1haWwiLCJvcGVuaWQiLCJwaG9uZSIsInByb2ZpbGUiLCJyb2xlIiwiRnJhbWV3b3JrIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.SildjCJzGpXlWZPDJ6KeXjkbWR7EQHpJZH_z7MNiv3ly7mmZy_UiMVKWyddYhH1x8eSFKxVy22UM03_4w_kkAP0yQmKa3Sbq1QMn0Agzdl2UulhVjkhpZRRUZq9iAVdZOrNiM8Iweo4ay1sYBMizsxsL7-Yyj1eFkYTq_6XFNbHnMMlT-N79QpWIX47MxtlFlb0tp_qTk-bfAgcErCHhIlQiy-MzbH-8yVIy7q_-VeHZkpOHNA7rxWxd-REWkA4u-kIFUTkYN7U8fzo36MXNK5NOgVj1Im89Nb54fWNDaw1cxdIRkiGyxRKiZRxs4dF5L2Mn3Pr22MKrgyG3wUPh_Q';
export const profileData = {
  name: 'Mathew Uv',
  designation: 'Team Leader',
  gender: 'Male',
  maritalStatus: 'Unmarried',
  blood: 'A+',
  residence: '01-420000000',
  phone: '+977-9800000000',
  currentAddress: 'Panchakumari Marga Maitidevi, Kathmandu Nepal',
  permanentAddress: 'Chhatreswori 6, Lanti Salyan Nepal',
  hobbies: 'Dancing, Singing, Cooking',
  allergies: 'Lactose intolerance',
  spouseName: '',
  status: '',
  startShiftTime: '',
  sndShiftTime: '',
  graceTime: '',
  graceTimeout: '',
  multipleSuperVisor: '',
  willUseSystemOrNot: '',
  checkForAttendance: '',
  outSideEmailAddress: '',
  userRoles: '',
  department: '',
};
