import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {IconOutline} from '@ant-design/icons-react-native';
import PropTypes from 'prop-types';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  SMALLEST_TEXT_STYLE,
} from 'styles';
import {checkAndGoBack, logout} from 'utils';

const Toolbar = ({
  title = 'CQ Noval',
  isDrawer,
  RightView,
  showLeftIcon = true,
  showRightIcon,
}) => {
  const navigation = useNavigation();
  const onLeftIconClick = () =>
    isDrawer ? navigation.toggleDrawer() : checkAndGoBack(navigation);

  const DefaultRightView = () => (
    <TouchableOpacity
      style={styles.rightViewContainer}
      onPress={() => logout(navigation)}>
      <IconOutline
        name={'logout'}
        size={20}
        style={styles.rightIcon}
        color={AppColors.PRIMARY}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {showLeftIcon ? (
        <IconOutline
          name={isDrawer ? 'menu' : 'left'}
          size={25}
          style={styles.icon}
          onPress={onLeftIconClick}
        />
      ) : (
        <View style={styles.rightView} />
      )}
      <Text style={styles.title}>{title.toLocaleUpperCase()}</Text>
      <View style={styles.rightView}>
        {RightView ? (
          <RightView />
        ) : showRightIcon ? (
          <DefaultRightView />
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

Toolbar.propTypes = {
  title: PropTypes.string,
  isDrawer: PropTypes.bool,
  RightView: PropTypes.func,
  showLeftIcon: PropTypes.bool,
  showRightIcon: PropTypes.bool,
};

export default Toolbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: moderateScale(35),
    backgroundColor: 'white',
  },
  icon: {
    color: AppColors.ACCENT,
    paddingHorizontal: AppDimensions.NORMAL,
  },
  title: {
    ...HEADING_TEXT_SIZE,
    fontWeight: 'bold',
    color: AppColors.NORMAL_BLACK,
    textTransform: 'capitalize',
  },
  rightViewContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
  },

  rightView: {
    height: '100%',
    width: moderateScale(35),
    marginEnd: AppDimensions.NORMAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
