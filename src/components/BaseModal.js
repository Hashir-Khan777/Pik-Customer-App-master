import React from 'react'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    SafeAreaView,
    StyleSheet,
    Modal,
    View,
    Text
} from 'react-native'

const BaseModal = ({children, title, style, buttons, visible, onRequestClose, height, maxHeight, maxWidth}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}>
            <SafeAreaView style={{flex: 1}}>
                <View style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    flex: 1,
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableWithoutFeedback
                        onPress={onRequestClose}
                        style={StyleSheet.absoluteFill}
                    >
                        <View style={StyleSheet.absoluteFill} />
                    </TouchableWithoutFeedback>
                    <View style={[styles.container, style, {height,maxHeight, maxWidth}]}>
                        {!!title && (
                            <View style={title ? styles.headerContainer : {}}>
                                <Text style={styles.title}>{title}</Text>
                            </View>
                        )}
                        <View style={styles.bodyContainer}>
                            {children}
                        </View>
                        {(!!buttons && buttons.length > 0) && (
                            <View>
                                <View style={styles.footerContainer}>
                                    {buttons.map((btn, index) => (
                                        <TouchableOpacity key={index} onPress={btn.onPress} style={[styles.btnContainer, {flex: 1, width: `${100/btn.length}%`}]}>
                                            <Text style={styles.btnTitle}>{btn?.title}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}
BaseModal.defaultProps = {
    buttons: [],
    maxHeight:'100%',
    height:'auto',
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#fafbff",
        borderRadius: 3,
        overflow: "hidden",
    },
    headerContainer:{
        paddingTop: 32,
    },
    title:{
        fontWeight: '700',
        fontSize: 18,
        lineHeight: 24,
        textAlign: 'center',
    },
    bodyContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    footerContainer:{
        borderTopWidth: 1,
        borderTopColor: '#f0efef',
        // flex: 1,
        flexDirection: 'row',
    },
    btnContainer:{
        paddingVertical: 12,
    },
    btnTitle:{
        fontWeight: '700',
        fontSize: 18,
        lineHeight: 24,
        textAlign: 'center',
    },
})

export default BaseModal;
