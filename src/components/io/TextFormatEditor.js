import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  actions,
  RichEditor,
  RichToolbar,
  defaultActions,
} from 'react-native-pell-rich-editor';
import {AppColors, AppDimensions} from 'styles';

const TextFormatEditor = ({onTextChanged, initialText = ''}) => {
  const RichText = useRef();
  const [article, setArticle] = useState(initialText);
  const [showEditor, setShowEditor] = useState(true);

  useEffect(() => {
    setArticle(initialText);
  }, [initialText]);

  function editorInitializedCallback() {
    RichText.current?.registerToolbar(function (items) {});
  }
  function handleHeightChange(height) {
    // console.log('editor height change:', height);
  }
  function onPressAddImage() {
    RichText.current?.insertImage(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png',
    );
  }
  function insertVideo() {
    RichText.current?.insertVideo(
      'https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4',
    );
  }

  return (
    <View style={styles.container}>
      <RichEditor
        disabled={false}
        containerStyle={styles.editor}
        ref={RichText}
        style={styles.rich}
        placeholder={'Write Here'}
        onChange={(text) => {
          // console.log('Html editor text ', text);
          setArticle(text);

          onTextChanged(text);
        }}
        editorInitializedCallback={editorInitializedCallback}
        onHeightChange={handleHeightChange}
        initialContentHTML={article}
      />
      <View style={styles.toolContainer}>
        <RichToolbar
          style={styles.richBar}
          editor={RichText}
          disabled={false}
          iconTint={AppColors.ACCENT}
          selectedIconTint={AppColors.PRIMARY}
          disabledIconTint={AppColors.ITEM_BG}
          onPressAddImage={onPressAddImage}
          iconSize={20}
          actions={[...defaultActions, actions.heading1]}
          iconMap={{
            [actions.heading1]: ({tintColor}) => (
              <Text style={[styles.tib, {color: tintColor}]}>H1</Text>
            ),
          }}
        />
      </View>
    </View>
  );
};

export default TextFormatEditor;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 4,
    height: 150,
    marginVertical: AppDimensions.NORMAL,
  },
  toolContainer: {
    borderTopWidth: 1,
    borderColor: AppColors.UTIL,
  },
  a: {
    fontWeight: 'bold',
    color: 'purple',
  },
  div: {
    fontFamily: 'monospace',
  },
  p: {
    fontSize: 30,
  },

  editor: {
    backgroundColor: 'black',
  },
  rich: {
    minHeight: 95,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    // flex: 1,
  },
  richBar: {
    height: 50,
    backgroundColor: '#F5FCFF',
    borderRadius: 4,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  tib: {
    textAlign: 'center',
    color: '#515156',
  },
});
