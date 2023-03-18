import {getAuthAxios} from '../ApiConfig';
import {loanEndPoints} from 'services';

export async function getRequisitionFor() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: loanEndPoints.GET_REQUISITION_FOR,
  });
}

export async function getLoanList(
  SkipCount = 0,
  SearchKeyword = '',
  Sorting = '',
) {
  const authAxios = await getAuthAxios();
  const params = {SkipCount, SearchKeyword, Sorting};
  return authAxios({
    method: 'GET',
    url: loanEndPoints.GET_LOAN_LIST,
    params,
  });
}

export async function getLoanStatus() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: loanEndPoints.GET_LOAN_STATUS,
  });
}

export async function postLoanRequest(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: loanEndPoints.POST_LOAN,
    data,
  });
}

export async function getDynamicLoanDetailById(loanApplicationId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: `${loanEndPoints.GET_LOAN_DYNAMIC_DETAIL}${loanApplicationId}`,
  });
}

export async function changeLoanStatus(loanApplicationId, data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: `${loanEndPoints.CHANGE_LOAN_STATUS}${loanApplicationId}`,
    data,
  });
}
