import React from 'react'
import {
    StyleSheet,
    Text
} from 'react-native'
import GradientView from './GradientView';
import {GRADIENT_2} from '../utils/constants';
import MaskedView from '@react-native-community/masked-view';

const CircleProgress = ({n, style, completed}) => {
    const textStyle = {textAlign: 'center', lineHeight: 32, fontWeight: '700', fontSize: 14}
    return completed ? (
        <GradientView gradient={GRADIENT_2} style={[{width: 32, height: 32, borderRadius: 16}, style]}>
            <Text style={{color: 'white', ...textStyle}}>
                {n}
            </Text>
        </GradientView>
    ) : (
        <MaskedView
            maskElement={<Text style={{
                borderRadius: 16,
                width: 32,
                height: 32,
                borderWidth: 1,
                borderColor: 'white',
                backgroundColor: 'transparent',
                ...textStyle,
                ...style
            }}>{n}</Text>}
        >
            <GradientView gradient={GRADIENT_2} style={{width: 32, height: 32, ...style}}/>
        </MaskedView>
    );
}

const styles = StyleSheet.create({
})

export default CircleProgress
