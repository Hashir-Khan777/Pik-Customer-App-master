import React from 'react';
import {
    StyleSheet,
    ScrollView,
    RefreshControl,
    View,
    KeyboardAvoidingView,
} from 'react-native';

const KeyboardAvoidingScreen = ({children, noScroll, refreshing, onRefresh}) => {
    // const Wrapper = noScroll ? View : ScrollView;
    return (
        <KeyboardAvoidingView
            style={styles.keyboard}
            // behavior="height"
            // behavior="padding"
            enabled
        >
            {/*<Wrapper*/}
            {/*    contentContainerStyle={styles.contentContainer}*/}
            {/*    style={styles.wrapper}*/}
            {/*    refreshControl={*/}
            {/*        !!onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : null*/}
            {/*    }*/}
            {/*>*/}
            {/*    {children}*/}
            {/*</Wrapper>*/}

            {children}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboard: {
        // borderWidth: 2, borderColor: 'red',
        width: '100%', height: '100%',
        // flex: 1,
        // flexDirection: 'row',
        // backgroundColor: 'white',
        // ...StyleSheet.absoluteFill
    },
    // wrapper: {
    //     flex: 1
    // },
    // contentContainer: {
    //     minHeight: '100%',
    // },
});

export default KeyboardAvoidingScreen;
