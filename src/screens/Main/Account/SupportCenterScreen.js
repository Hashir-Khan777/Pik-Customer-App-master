import React, {useState, useEffect, useMemo} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_900,
    GRADIENT_2,
} from '../../../utils/constants';
import ButtonPrimary from '../../../components/ButtonPrimary';
import Api from '../../../utils/api'
import globalStyles from '../../../utils/globalStyles';
import {
    loadFaqs as loadFaqsAction
} from '../../../redux/actions/appActions';
import {connect} from 'react-redux';
import CustomTextInput from '../../../components/CustomTextInput';

import { useTranslation } from 'react-i18next';

const SupportCenterScreen = ({navigation, route, loadFaqs, ...props}) => {
    let { t } = useTranslation();

    const [search, setSearch] = useState((''))
    const category = route.params?.category

    let faqs = useMemo(() => {
        if(!category)
            return []
        return props.faqs.filter(f => f.category === category._id)
    }, [])

    useEffect(() => {
        if(!category)
            loadFaqs()
    }, [])

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={(
                    <HeaderPage title={t('pages.support_center.header')}>
                        <View style={{paddingHorizontal: 16}}>
                            <View style={{height: 16}}/>
                            <CustomTextInput
                                backgroundColor="#4e4b4b"
                                placeholderColor={COLOR_NEUTRAL_GRAY}
                                leftIcon="search"
                                placeholder={t('pages.support_center.search')}
                                value={search}
                                onChangeText={setSearch}
                                color={'white'}
                                placeholderColor={COLOR_NEUTRAL_GRAY}
                                // onPress={() => navigation.navigate('LocationSearch', {setSelectedAddress})}
                            />
                        </View>
                    </HeaderPage>
                )}
                footer={!category ? <View style={{padding: 16}}>
                    <Text style={styles.title2}>{t('pages.support_center.still_need_help')}</Text>
                    <ButtonPrimary title={t('pages.support_center.contact_us')} onPress={() => navigation.navigate('ContactUs')} />
                </View> : null}
            >
                {!category ? <>
                    <Text style={styles.title}>{t('pages.support_center.top_questions')}</Text>
                    {props.categories.map(cat => (
                        <TouchableOpacity onPress={() => navigation.navigate('MainSupportCenterCategory', {category: cat})}>
                            <View key={cat._id} style={styles.topic}>
                                <View style={styles.row}>
                                    <Text style={styles.catTitle}>{cat.title}</Text>
                                    <View style={globalStyles.arrowRight}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </> : <>
                    <Text style={styles.title}>{category.title}</Text>
                    {faqs.map(faq => (
                        <TouchableOpacity onPress={() => navigation.navigate('MainSupportCenterFaq', {faq})}>
                            <View key={faq._id} style={styles.topic}>
                                <View style={styles.row}>
                                    <Text style={styles.catTitle}>{faq.question}</Text>
                                    <View style={globalStyles.arrowRight}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </>}
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    headerChildrenContainer: {
        paddingHorizontal: 16,
    },
    title: {
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 20,
        lineHeight: 24,
    },
    title2: {
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 16
    },
    topic: {
        paddingVertical: 24,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    catTitle: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
    },
});

const mapStateToProps = state => {
    return {
        faqs: state.app.faqs,
        categories: state.app.faqCategories
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadFaqs: () => dispatch(loadFaqsAction())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportCenterScreen)
