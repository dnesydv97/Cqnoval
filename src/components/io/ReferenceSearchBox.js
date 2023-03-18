import {IconOutline} from '@ant-design/icons-react-native';
import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {AppColors, AppDimensions, boxShadow, NORMAL_TEXT_STYLE} from 'styles';
import PropTypes from 'prop-types';
import { moderateScale } from 'react-native-size-matters';

const ReferenceSearchBox = ({onSearch, containerStyle = {}}) => {
  const [query, setQuery] = useState('');

  return (
      <View style={{flexDirection: 'row', marginTop : AppDimensions.SMALL}}>
          <IconOutline
                style={styles.icon}
                name="star"
                color={AppColors.FAV_LIST_COLOR}
                size={25}
            />
            <View style={{borderRightWidth: 0.6, height: moderateScale(20), marginHorizontal:AppDimensions.NORMAL, marginVertical: AppDimensions.NORMAL}}></View>
            <TextInput
                style={styles.text}
                placeholder="Search"
                value={query}
                onChangeText={setQuery}
                // onKeyPress={() => onSearch(query)}
                // onPress={() => onSearch(query)}
            />
      </View>
    
  );
};

ReferenceSearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default ReferenceSearchBox;

const styles = StyleSheet.create({
  container: {
    ...boxShadow('grey'),
    paddingVertical: AppDimensions.SMALL,
    marginBottom: AppDimensions.NORMAL,
    backgroundColor: 'white',
    borderRadius: AppDimensions.NORMAL,
    flexDirection: 'row',
    width: '100%',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  text: {
    paddingLeft: AppDimensions.NORMAL,
    ...NORMAL_TEXT_STYLE,
    bottom: 5,
    fontSize: moderateScale(14),
  },
  icon: {
    marginVertical: AppDimensions.SMALL,
  },
});
