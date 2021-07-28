import React from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    Text
} from 'react-native';
import BaseModal from './BaseModal';
import {COLOR_PRIMARY_500} from '../utils/constants';

const ProgressModal = ({title, visible, onRequestClose, ...props}) => {
    return <BaseModal
        visible={visible}
        style={{
            minWidth: 300,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 24,
        }}
        onRequestClose={onRequestClose}
    >
        <ActivityIndicator
            style={{marginBottom: 24}}
            color={COLOR_PRIMARY_500}
            size={64}
        />
        <Text style={styles.modalH1}>{title}</Text>
    </BaseModal>;
};

const styles = StyleSheet.create({
    modalH1: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
    }
})

export default ProgressModal;
