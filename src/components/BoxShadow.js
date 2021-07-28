import React from 'react';
import DropShadow from 'react-native-drop-shadow';

const BoxShadow = ({children, x, y, opacity, radius, color, style}) => {
    return <DropShadow
        style={{
            ...style,
            shadowColor: color,
            shadowOffset: {
                width: x,
                height: y,
            },
            shadowOpacity: opacity,
            shadowRadius: radius,
        }}
    >
        {children}
    </DropShadow>;
};

BoxShadow.defaultProps = {
    color: '#000',
    x: 0,
    y: 2,
    opacity: 0.3,
    radius: 2,
};

export default BoxShadow;
