import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, Modal, Text} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import HeaderPage from './HeaderPage';
import {COLOR_PRIMARY_500} from '../utils/constants';

class ImageGallery extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            index: 0,
        }
    }

    show(index=0){
        this.setState({index, visible: true})
    }

    hide(){
        this.setState({visible: false})
    }

    render() {
        let {imageUrls} = this.props
        return <Modal
            visible={this.state.visible}
            transparent={true}
            onRequestClose={() => this.hide()}
        >
            <ImageViewer
                // renderHeader={() => <Text onPress={() => this.hide()} style={styles.close}>X</Text>}
                imageUrls={imageUrls.map(i => ({url: i, freeHeight: true}))}
                index={this.state.index}
            />
        </Modal>
    }
}

ImageGallery.propTypes = {
    imageUrls: PropTypes.array
}

ImageGallery.defaultProps = {
    imageUrls: []
}

const styles = StyleSheet.create({
    close: {
        color: 'white',
        backgroundColor: COLOR_PRIMARY_500,
        width: 3*16,
        textAlign: 'center',
        lineHeight: 16,
        padding: 16,
        margin: 16,
        borderRadius: 16 + 8,
    }
})

export default ImageGallery
