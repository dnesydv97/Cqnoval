import {TokenAxios, multiPartConfig} from '../ApiConfig';
import {endPoints} from 'services';

export function doLogin(credential) {
  const data = new FormData();
  data.append('username', credential.username);
  data.append('password', credential.password);
  data.append('grant_type', 'password');
  data.append('client_id', 'Framework_App');

  return TokenAxios({
    method: 'POST',
    headers: multiPartConfig,
    data,
    url: endPoints.USER_LOGIN,
  });
}
