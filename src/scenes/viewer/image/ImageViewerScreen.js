import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Images} from 'assets';
import {BaseContainer} from 'components';

const ImageViewerScreen = () => {
  const route = useRoute();
  const {url} = route.params;
  console.log('Url ', url);

  return (
    <BaseContainer>
      <Image
        source={{uri: url}}
        defaultSource={Images.logo}
        style={styles.image}
        resizeMode="cover"
      />
    </BaseContainer>
  );
};

export default ImageViewerScreen;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
