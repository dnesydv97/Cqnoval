import {combineReducers} from 'redux';
import loginReducer from './auth/loginReducer';
import outBoxReducer from './mail/outboxMail/reducer';
import sentMailReducer from './mail/sentMail/reducer';
import profileReducer from './profile/reducer';
import gendersReducer from './gender/reducer';
import maritalStatusReducer from './maritalStatus/reducer';
import usersReducer from './employees/reducer';
import goalsReducer from './goal/reducer';
import guestReducer from './guest/reducer';
import appointmentReducer from './appointments/reducer';
import todoReducer from './todo/reducer';
import meetingReducer from './meeting/reducer';
import inboxMailReducer from './mail/inbox/reducer';

export const rootReducer = combineReducers({
  loginReducer,
  outBoxReducer,
  sentMailReducer,
  inboxMailReducer,
  profileReducer,
  gendersReducer,
  maritalStatusReducer,
  usersReducer,
  goalsReducer,
  guestReducer,
  appointmentReducer,
  todoReducer,
  meetingReducer,
});
