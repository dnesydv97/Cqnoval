import React, {useEffect} from 'react';
import RootNavigator from './navigations/RootNavigator';
import {store, persistor} from './services/redux/store';
import {Provider as ReduxProvider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider as AntProvider} from '@ant-design/react-native';
import fcmMessaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {getFcmToken, setFcmToken} from 'services';
import {Ids} from 'constant';

const App = () => {
  useEffect(() => {
    handleFCM();
    const unsubscribe = fcmMessaging().onMessage(async (notifiction) => {
      console.log('Foreground Remote Notification ', notifiction);
      PushNotification.localNotification({
        channelId: Ids.NOTIFICATION_CHANNEL_ID,
        largeIcon: 'ic_launcher',
        title: notifiction.notification.title,
        message: notifiction.notification.body,
        ignoreInForeground: false,
      });
    });
    return unsubscribe;
  }, []);

  const handleFCM = async () => {
    const enable = await fcmMessaging().hasPermission();
    if (enable) {
      getFirebaseToken();
    } else {
      await fcmMessaging().requestPermission();
      await getFirebaseToken();
    }
  };

  const getFirebaseToken = async () => {
    try {
      let fcmToken = await getFcmToken();
      console.log('Token From Async', fcmToken);
      if (!fcmToken) {
        fcmToken = await fcmMessaging().getToken();
        console.log('firebase token', fcmToken);
        if (fcmToken) setFcmToken(fcmToken);
      }
    } catch (e) {
      console.log('firebase token error', e);
    }
  };

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AntProvider>
            <RootNavigator />
          </AntProvider>
        </SafeAreaProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;
