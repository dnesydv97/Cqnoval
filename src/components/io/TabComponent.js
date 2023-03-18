import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { AppDimensions } from 'styles';

const FirstRoute = () => (
    <View style={[styles.scene]}/>
);

const SecondRoute = () => (
    <View style={[styles.scene]}/>
);

 const initialLayout = { width: 0, height: 0};

export default function TabComponent () {
    const [index, setIndex] = useState();
    const [routes] = useState([
        {
            key: 'showAll', 
            title: 'Show All'
        },
        {
            key: 'internalOnly',
            title: 'Internal Only',
        },
    ]);

    const renderScene = SceneMap({
        showAll: FirstRoute,
        internalOnly: SecondRoute,
    });

    return (
        <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
        />
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});