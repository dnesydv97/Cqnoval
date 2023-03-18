import {Linking, Platform} from 'react-native';
import {getInstallerPackageName} from 'react-native-device-info';

export function openLink(url) {
  Linking.canOpenURL(url)
    .then((supported) => {
      supported && Linking.openURL(url);
    })
    .catch((error) => {
      //console.log*("Erro in opening given url ", error)
    });
}

export function storeRedirect() {}
