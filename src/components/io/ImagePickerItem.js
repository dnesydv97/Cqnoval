import {Icons, Images} from 'assets';
import React, {useState} from 'react';
import {useEffect} from 'react';
import {TouchableOpacity, StyleSheet, Image} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {AppColors, AppDimensions} from 'styles';
import {chooseImage, showFailToast} from 'utils';

const ImagePickerItem = ({onImageSelected, imageUri, isRound = true}) => {
  // console.log('Image url to pp', imageUri);
  const [source, setSource] = useState(Icons.logoIcon);

  useEffect(() => {
    imageUri !== '' && setSource({uri: imageUri});
  }, [imageUri]);

  const startImagePicking = () => {
    chooseImage('photo')
      .then((response) => {
        console.log('Response on view ', response);
        onImageSelected(response === undefined ? null : response);
      })
      .catch((error) => showFailToast(error));
  };

  return (
    <TouchableOpacity style={styles.container} onPress={startImagePicking}>
      <Image
        style={{
          ...styles.image,
          borderRadius: isRound ? moderateScale(70 / 2) : 0,
        }}
        source={source}
        resizeMode="cover"
        defaultSource={Images.logo}
        onError={(syntheticEvent) => setSource(Images.logo)}
      />
    </TouchableOpacity>
  );
};

export default ImagePickerItem;

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.SMALL,
    // borderWidth: 1,
    // height: moderateScale(70),
    // width: moderateScale(70),
  },
  image: {
    height: moderateScale(70),
    width: moderateScale(70),
    // marginEnd: AppDimensions.NORMAL,
    // paddingVertical: AppDimensions.LARGE,
  },
});
