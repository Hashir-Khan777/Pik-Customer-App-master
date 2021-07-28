import React, {useMemo} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import globalStyles from '../../../utils/globalStyles';
import {SvgXml} from 'react-native-svg';
import svgs from '../../../utils/svgs';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_900} from '../../../utils/constants';

import { useTranslation } from 'react-i18next';

const HomePackageViewScreen = ({navigation, route}) => {
    let { t } = useTranslation();

    const {order} = route.params;

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                contentStyle={{paddingBottom: 0}}
                Header={
                    <HeaderPage
                        title={t('pages.mainHome.get_packages')}
                        color={HeaderPage.Colors.BLACK}
                    />
                }>
                <Text style={styles.h1}>{order?.sender?.name}</Text>
                <Text style={styles.description}>{order?.packages.length} {t('pages.mainHome.packages_pickup')}</Text>

                <View style={styles.spacer} />

                {order?.packages.map((item, index) => (
                    <View key={index}>
                        <View style={{height: 24, marginBottom: 8}}>
                            <View style={globalStyles.flexRowCenter}>
                                <SvgXml style={styles.itemIcon} width={12} xml={svgs['icon-document']}/>
                                <Text style={styles.itemName}>{item.description}</Text>
                            </View>
                        </View>
                        <View style={{height: 24, marginBottom: 24}}>
                            <View style={globalStyles.flexRowCenter}>
                                <SvgXml style={styles.itemIcon} width={12} xml={svgs['icon-barcode']}/>
                                <Text style={[styles.itemBarcode, {flexGrow: 1}]}>{item.reference}</Text>
                                <SvgXml style={styles.boxIcon} width={12} xml={svgs['icon-package-closed']}/>
                                <Text style={styles.itemBarcode}>{order.vehicleType === 'Moto' ? t('general.small') : t('general.large')} {t('general.box')}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    h1: {
        marginTop: 16,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    description: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    spacer:{
        height: 1,
        backgroundColor: '#F0EFEF',
        marginVertical: 12,
        marginHorizontal: -16,
    },
    itemName: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    itemBarcode: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 24,
        color: COLOR_NEUTRAL_GRAY,
    },
    itemIcon: {
        marginVertical: 'auto',
        marginRight: 18,
    },
    boxIcon: {
        marginVertical: 'auto',
        marginRight: 8,
    },
});

export default HomePackageViewScreen;
