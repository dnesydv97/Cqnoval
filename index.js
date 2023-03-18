/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import Messaging from '@react-native-firebase/messaging';
import {Ids} from 'constant';

PushNotification.channelExists(Ids.NOTIFICATION_CHANNEL_ID, (exists) => {
  if (!exists) {
    PushNotification.createChannel({
      channelId: Ids.NOTIFICATION_CHANNEL_ID,
      channelName: Ids.NOTIFICATION_CHANNEL_NAME,
    });
  }
});

Messaging().setBackgroundMessageHandler(async (notifiction) => {
  console.log('setBackgroundMessageHandler', notifiction);
  PushNotification.localNotification({
    channelId: Ids.NOTIFICATION_CHANNEL_ID,
    largeIcon: 'ic_notification',
    title: notifiction.data.title,
    message: notifiction.data.body,
    userInfo: notifiction.data,
  });
});

AppRegistry.registerComponent(appName, () => App);
