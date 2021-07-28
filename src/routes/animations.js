import {TransitionSpecs, CardStyleInterpolators} from '@react-navigation/stack'
import {Animated} from 'react-native'
export const LeftToRightAnimation = {
    gestureDirection: 'horizontal',
    // transitionSpec: {
    // open: {config: {closing: false}},
    // close: {config: {closing: true}},
    // },
    cardStyleInterpolator: ({ current, layouts, index, inverted, closing, next, ...others }) => {
        // console.log({index, closing, inverted, current, next})
        let {width} = layouts.screen

        const translateFocused = Animated.multiply(
            current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [width, 0],
                extrapolate: 'clamp',
            }),
            inverted
        );
        const translateUnfocused = next
            ? Animated.multiply(
                next.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width * -0.3],
                    extrapolate: 'clamp',
                }),
                inverted
            )
            : 0;

        return {
            cardStyle: {
                transform: [
                    {translateX: translateFocused,},
                    {translateX: translateUnfocused},
                ],
            },
        };
    },
};

