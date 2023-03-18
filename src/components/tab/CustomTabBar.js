import React, {useEffect, useState} from 'react';
import {View, Text, Keyboard, TouchableOpacity} from 'react-native';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import {AppColors} from 'styles';
import {moderateScale} from 'react-native-size-matters';

function CustomTabBar({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 0.7}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const tabIcon =
          options.tabBarIcon !== undefined ? options.tabBarIcon : null;

        const tabBarButton =
          options.tabBarButton !== undefined ? options.tabBarButton : null;

        const onMoreClick =
          options.onMoreClick !== undefined ? options.onMoreClick : null;

        // const tabBarVisible =
        //   options.tabBarVisible === undefined ? true : false;

        const tabBarVisible =
          options.iconVisibility === undefined ? true : false;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const [visible, setVisible] = useState(true);

        useEffect(() => {
          let keyboardEventListeners;
          if (Platform.OS === 'android') {
            keyboardEventListeners = [
              Keyboard.addListener('keyboardDidShow', () => setVisible(false)),
              Keyboard.addListener('keyboardDidHide', () => setVisible(true)),
            ];
          }
          return () => {
            if (Platform.OS === 'android') {
              keyboardEventListeners &&
                keyboardEventListeners.forEach((eventListener) =>
                  eventListener.remove(),
                );
            }
          };
        }, []);

        return tabBarVisible ? (
          <TouchableOpacity
            key={String(Math.random())}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={tabBarButton === null ? onPress : () => onMoreClick(true)}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              // borderWidth: 1,
              alignItems: 'center',
              //backgroundColor: isFocused ? '#673ab7': 'white',
              paddingVertical: 3,
              marginVertical: 3,
            }}>
            {tabIcon
              ? tabIcon(isFocused, 'black', 20)
              : tabBarButton
              ? tabBarButton(navigation)
              : null}
            <Text
              style={{
                color: isFocused ? AppColors.PRIMARY_DARK : '#0F0F0F',
                paddingTop: 2,
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        ) : null;
      })}
    </View>
  );
}

export default CustomTabBar;
