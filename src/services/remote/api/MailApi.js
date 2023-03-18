import {getAuthAxios} from '../ApiConfig';
import {mailEndPoints} from 'services';

export async function getMailParticipantType() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: mailEndPoints.GET_PARTICIPANT_TYPE_LIST,
  });
}
export async function getMailParticipantStatus() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: mailEndPoints.GET_PARTICIPANT_STATUS_LIST,
  });
}
export async function getPredefinedTempletes() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: mailEndPoints.GET_INSTANCE_MESSAGE_TEMPLATE_LIST,
  });
}
export async function sendInternalMessage(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: mailEndPoints.POST_INTERNAL_MESSAGE,
    data,
  });
}
export async function getInboxMails(
  ApplicationTypes = [],
  filter = null,
  SkipCount = 0,
) {
  const authAxios = await getAuthAxios();
  let MessageCenterTypeName = null;
  if (filter === 'Sent') MessageCenterTypeName = 'from';
  else if (filter === 'Drafts') MessageCenterTypeName = 'draft';
  else if (filter === 'Starred') MessageCenterTypeName = 'specialflag1';
  else MessageCenterTypeName = filter;

  const params = {ApplicationTypes, MessageCenterTypeName, SkipCount};
  return authAxios({
    method: 'GET',
    url: mailEndPoints.GET_INBOX_MAIL,
    params,
  });
}
export async function getInstanceMessagesByMsgId(
  MessageCenterId,
  SkipCount = 0,
) {
  const authAxios = await getAuthAxios();
  const params = {MessageCenterId, SkipCount};
  return authAxios({
    method: 'GET',
    url: mailEndPoints.GET_INSTANCE_MESSAGES,
    params,
  });
}
export async function sendInstanceMessage(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: mailEndPoints.SEND_INSTANCE_MESSAGE,
    data,
  });
}
export async function updateInstanceMessageText(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PUT',
    url: mailEndPoints.UPDATE_INSTANCE_MESSAGE_TEXT,
    data,
  });
}
export async function updateInstanceMessageParticipants(
  instanceMessageId,
  data,
) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PUT',
    url: `${mailEndPoints.UPDATE_INSTANCE_MESSAGE_PARTICIPANTS}${instanceMessageId}`,
    data,
  });
}
export async function updateInstanceMessageAttachments(
  instanceMessageId,
  data = [],
) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PUT',
    url: `${mailEndPoints.UPDATE_INSTANCE_MESSAGE_ATTACHMENTS}${instanceMessageId}`,
    data,
  });
}

export async function updateInstanceMessage(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PUT',
    url: mailEndPoints.UPDATE_INSTANCE_MESSAGE,
    data,
  });
}

//EMAIL MESSAGES

export async function composeEmailMessage(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: mailEndPoints.COMPOSE_EMAIL,
    data,
  });
}

export async function composeMessageAsDraft(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: mailEndPoints.COMPOSE_EMAIL_AS_DRAFT,
    data,
  });
}

export async function changeEmailStatus(
  messageCenterId,
  instanceMessageId,
  participantStatusName,
) {
  const authAxios = await getAuthAxios();
  const params = {messageCenterId, instanceMessageId, participantStatusName};
  return authAxios({
    method: 'POST',
    url: mailEndPoints.CHANGE_EMAIL_STATUS,
    params,
  });
}

export async function getParticipanTypeEmailAddresses(searchkeyWord) {
  const authAxios = await getAuthAxios();
  const params = {searchkeyWord};
  return authAxios({
    method: 'GET',
    url: mailEndPoints.GET_PARTICIPANT_TYPE_EMAIL_LISTING,
    params,
  });
}

export async function getFromEmailAddresses() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: mailEndPoints.GET_FROM_EMAIL_LISTING,
  });
}
