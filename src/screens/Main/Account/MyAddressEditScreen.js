import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Alert} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import PrimaryButton from '../../../components/ButtonPrimary';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useTranslation } from 'react-i18next';

const MyAddressEditScreen = ({navigation, route}) => {
    let { t } = useTranslation();

    let {name: oldName="", address, onConfirm, onDelete} = route.params || {};
    const [inProgress, setInProgress] = useState(false)
    const [name, setName] = useState(oldName);
    const [formattedAddress, setFormattedAddress] = useState(address.formatted_address);
    const [validationEnabled, setValidationEnabled] = useState(false)

    const validateAddress = () => {
        if(!formattedAddress)
            return t('pages.my_address.enter_address')
    }
    const validateName = () => {
        if(!name)
            return t('pages.my_address.enter_name_for_address')
    }

    const confirm = async () => {
        let errors = [
            validateAddress(),
            validateName()
        ].filter(e => !!e)

        if(errors.length > 0){
            setValidationEnabled(true)
            return;
        }

        if(onConfirm){
            let newAddress = {...address}
            newAddress.formatted_address = formattedAddress
            setInProgress(true)
            await onConfirm(name, newAddress)
            setInProgress(false)
        }
    }

    const callDelete = () => {
        Alert.alert(
            '',
            t('pages.my_address.ru_delete_address'),
            [
                {
                    text: t('general.no'),
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: t('general.yes'),
                    onPress: async () => {
                        setInProgress(true)
                        await onDelete()
                        setInProgress(false)
                    },
                },
            ],
            {cancelable: false},
        );
    }

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={
                    <HeaderPage
                        title={t('pages.my_address.header')}
                        color={HeaderPage.Colors.BLACK}
                        rightButtons={!!onDelete ? [
                            <TouchableOpacity onPress={() => callDelete()}>
                                <FontAwesome5 style={styles.deleteBtn} name="trash-alt"/>
                            </TouchableOpacity>
                        ] : null}
                    />
                }
                footer={(
                    <View style={{padding: 16}}>
                        <PrimaryButton
                            title={t('pages.my_address.save_address')}
                            onPress={() => confirm()}
                            inProgress={inProgress}
                            disabled={inProgress}
                        />
                    </View>
                )}

            >
                {/*<Text style={styles.title}>Address</Text>*/}
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        placeholder={t('pages.my_address.address')}
                        value={formattedAddress}
                        onChangeText={setFormattedAddress}
                        errorText={validationEnabled && validateAddress()}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        placeholder={t('pages.my_address.name')}
                        value={name}
                        onChangeText={setName}
                        errorText={validationEnabled && validateName()}
                    />
                </View>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {},
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 40,
    },
    inputWrapper: {
        marginBottom: 15,
    },
    deleteBtn: {
        fontWeight: '900',
        fontSize: 20,
        marginRight: 8,
        color: 'white'
    }
});

export default MyAddressEditScreen;
