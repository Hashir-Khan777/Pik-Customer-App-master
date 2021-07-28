import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Animated,
    ScrollView,
    View,
    Text,
} from 'react-native';
import {WINDOW_HEIGHT} from '../utils/constants';
import _set from '@babel/runtime/helpers/esm/set';

const BottomDrawerOverlay = ({open, children, onOverlayPress}) => {
    const [contentHeight, setContentHeight] = useState(0);
    const [overlayVisible, setOverlayVisible] = useState(!!open);
    const [animation] = useState(new Animated.Value(open ? 0 : 1));

    const _setContentHeight = (event) => {
        console.log('content resized to:', event.nativeEvent.layout)
        setContentHeight(event.nativeEvent.layout.height);
    };

    const drawerBottom = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, -(contentHeight + 16 + 32 + 100)],
    });

    const overlayBgColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)'],
    });

    useEffect(() => {
        open && setOverlayVisible(true);
        console.log('reAnimating ...');
        Animated.spring(
            animation,
            {
                toValue: open ? 0 : 1,
                useNativeDriver: false,
            },
        ).start(() => setOverlayVisible(open));
    }, [open, contentHeight])

    return (
        <View style={StyleSheet.absoluteFill}>
            {overlayVisible && <Animated.Text onPress={onOverlayPress} style={[styles.overlay, {backgroundColor: overlayBgColor}]} />}
            <Animated.View style={[styles.panel, {bottom: drawerBottom}]}>
                <View onLayout={_setContentHeight}>
                    {children}
                </View>
                <View style={{height: 100}} />
            </Animated.View>
        </View>
    );
};

BottomDrawerOverlay.defaultProps = {
    open: true,
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        left: 0,
        bottom: 0,
        paddingBottom: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    iconWrapper: {
        padding: 8,
    },
    icon: {
        // position: 'absolute',
        alignSelf: 'center',
        width: 80,
        height: 6,
        backgroundColor: '#F0EFEF',
        borderRadius: 8,
    },
    shadow: {
        shadowColor: '#CECDCD',
        shadowRadius: 2,
        shadowOpacity: 5,
        elevation: 15,
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    panel:{
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        padding: 16,
        paddingTop: 32,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    }
});

export default BottomDrawerOverlay;
