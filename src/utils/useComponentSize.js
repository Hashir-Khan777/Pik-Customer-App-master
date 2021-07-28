import {useCallback, useState} from 'react';

const useComponentSize = () => {
    const [size, setSize] = useState(null);

    const onLayout = useCallback(event => {
        const {width, height} = event.nativeEvent.layout;
        setSize({width, height});
    }, []);

    return [size, onLayout];
};

export default useComponentSize;
