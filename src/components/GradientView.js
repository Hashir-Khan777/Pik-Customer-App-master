import React from 'react';
import RNLinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import useComponentSize from '../utils/useComponentSize';

const GradientView = ({children, style, gradient, rotation}) => {
    const [size, onLayout] = useComponentSize();

    function rotate(cx, cy, x, y, radians) {
        let cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    }

    const calculateGradient = () => {
        if (!size || !size.height) {
            return {};
        }

        let {width, height} = size;
        let theta = rotation !== undefined ? rotation : Math.atan(height / width);
        let h2 = (height * Math.cos(theta)) + (width * Math.sin(theta));
        let cx = width / 2, cy = height / 2;
        let dy = h2 / 2;

        let [x1, y1] = rotate(cx, cy, cx, cy - dy, theta);
        let [x2, y2] = rotate(cx, cy, cx, cy + dy, theta);

        return {start: {x: x1 / width, y: y1 / height}, end: {x: x2 / width, y: y2 / height}};
    };

    const viewGradient = {...gradient, ...calculateGradient()};
    return <RNLinearGradient onLayout={onLayout} {...viewGradient} style={style}>
        {children}
    </RNLinearGradient>;
};

GradientView.propTypes = {
    gradient: PropTypes.object,
};

export default GradientView;
