import React from 'react';
import {View} from 'react-native';

const FormControl = ({children, style}) => {
    return <View style={[{marginBottom: 16}, style]}>
        {children}
    </View>;
};

export default FormControl;
