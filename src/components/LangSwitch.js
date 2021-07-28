import React, {useState} from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
} from 'react-native'
import BaseModal from './BaseModal';
import {useTranslation} from 'react-i18next';
import svgs from '../utils/svgs';
import {SvgXml} from 'react-native-svg';
// import {storeCurrentLanguage} from '../utils/i18n'
import { setCurrentLang } from '../redux/actions';
import { useDispatch } from 'react-redux';

const LangSwitch  = ({...props}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const changeLang = async code => {
        // await storeCurrentLanguage(code)
        await i18n.changeLanguage(code);
        dispatch(setCurrentLang(code));
    }
    return <TouchableOpacity onPress={() => setModalVisible(true)}>
        {props.children}
        <BaseModal
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <Text style={styles.title}>Select Language</Text>
            <View style={styles.langContainer}>
                <SvgXml style={styles.radio} xml={svgs[i18n.language === 'es' ? 'icon-radio-on' : 'icon-radio-off']}/>
                <Text style={styles.langTitle} onPress={() => {changeLang('es'); setModalVisible(false);}}>
                    <Text>Española</Text>
                </Text>
            </View>
            <View style={styles.langContainer}>
                <SvgXml style={styles.radio} xml={svgs[i18n.language === 'en' ? 'icon-radio-on' : 'icon-radio-off']}/>
                <Text style={styles.langTitle} onPress={() => {changeLang('en'); setModalVisible(false);}}>
                    <Text>English</Text>
                </Text>
            </View>
        </BaseModal>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
        paddingHorizontal: 32,
    },
    langContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    langTitle: {
        lineHeight: 32,
    },
    radio: {
        marginRight: 16,
    },
})

export default LangSwitch
