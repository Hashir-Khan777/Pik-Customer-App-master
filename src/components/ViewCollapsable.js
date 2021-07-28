import React, {useState} from 'react';
import {
    StyleSheet,
    Animated,
    View,
    Text,
} from 'react-native';

const ViewCollapsable = ({children, collapsed, duration, ...props}) => {
    const [maxHeight, setMaxHeight] = useState(0);
    const [animation] = useState(new Animated.Value(collapsed ? 0 : 1));

    const doAnimation = () => {
        Animated.spring(
            animation,
            {
                toValue: collapsed ? 0 : 1,
                useNativeDriver: false,
                duration,
            },
        ).start();
    };

    setTimeout(doAnimation, 10);

    const _setMaxHeight = (event) => {
        setMaxHeight(event.nativeEvent.layout.height);
    };

    const collapseHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, maxHeight],
    });

    return (
        <View style={[styles.container, props.style]}>
            <Animated.View style={{height: collapseHeight}}>
                <View style={styles.childrenWrapper} onLayout={_setMaxHeight}>
                    {children}
                </View>
            </Animated.View>
        </View>
    );
};

ViewCollapsable.defaultProps = {
    duration: 500,
    collapsed: false,
}

const styles = StyleSheet.create({
    container: {
        // borderWidth: 1,
        overflow: 'hidden'
    },
    animatedView: {
        borderWidth: 2,
        borderColor: 'red'
    },
    childrenWrapper: {
        position: "absolute",
        width: '100%',
    }
});

export default ViewCollapsable;

