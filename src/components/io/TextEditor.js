import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {
  actions,
  defaultActions,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';
import HTMLView from 'react-native-htmlview';
import {AppColors, AppDimensions} from 'styles';

const TextEditor = ({onTextChanged, initialText = ''}) => {
  const RichText = useRef();
  const [article, setArticle] = useState(initialText);
  const [showEditor, setShowEditor] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setArticle(initialText);

    // setTimeout(() => {
    //   setShowEditor(false);
    // }, 10);

    // setTimeout(() => {
    //   setShowEditor(true);
    // }, 20);
    // console.log('Text Editor initial value ', initialText);
  }, [initialText]);

  function editorInitializedCallback() {
    RichText.current?.registerToolbar(function (items) {
      // console.log(
      //   'Toolbar click, selected items (insert end callback):',
      //   items,
      // );
    });
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
    <ScrollView style={{marginBottom: AppDimensions.NORMAL}}>
      {showEditor && (
        <>
          {mounted ? (
            <RichToolbar
              style={styles.richBar}
              editor={RichText}
              disabled={false}
              iconTint={AppColors.NORMAL_BLACK}
              selectedIconTint={AppColors.PRIMARY}
              disabledIconTint={AppColors.ITEM_BG}
              onPressAddImage={onPressAddImage}
              iconSize={20}
              actions={[actions.setBold, actions.setItalic, actions.setUnderline,actions.insertBulletsList, actions.insertOrderedList, actions.setIndent]}
              iconMap={{
                [actions.heading1]: ({tintColor}) => (
                  <Text style={[styles.tib, {color: tintColor}]}>H1</Text>
                ),
              }}
            />
          ) : null}
          <RichEditor
            disabled={false}
            containerStyle={styles.editor}
            ref={RichText}
            style={styles.rich}
            placeholder={'Compose Email'}
            onChange={(text) => {
              // console.log('Html editor text ', text);
              setArticle(text);

              onTextChanged(text);
            }}
            editorInitializedCallback={editorInitializedCallback}
            onHeightChange={handleHeightChange}
            initialContentHTML={article}
            onLoadEnd={() => setMounted(true)}
          />
        </>
      )}
      {/* <Text style={styles.text}>Result</Text>
            <HTMLView value={article} stylesheet={styles} /> */}
    </ScrollView>
  );
};
export default TextEditor;

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#F5FCFF',
  },
  editor: {
    backgroundColor: 'black',
    borderColor: 'black',
    // borderWidth: 0.6,
    // borderRadius: 10,
  },
  rich: {
    minHeight: 300,
    flex: 1,
  },
  richBar: {
    height: 30,
    backgroundColor: '#F5FCFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
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
