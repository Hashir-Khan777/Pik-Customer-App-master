import React, {useState, useRef, useEffect} from 'react';
import {
    StyleSheet,
    StatusBar,
    ScrollView,
    View,
    Text,
} from 'react-native';
import {
    COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500,
    COLOR_PRIMARY_900, DEVICE_LARGE, DEVICE_SMALL, WINDOW_HEIGHT, WINDOW_WIDTH,
} from '../../../utils/constants';
import BarcodeMask from 'react-native-barcode-mask';
import PrimaryButton from '../../../components/ButtonPrimary';
import {SvgXml} from 'react-native-svg';
import svgs from '../../../utils/svgs';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import {RNCamera} from 'react-native-camera';

const NotAuthorizedView = () => (
    <View style={styles.cameraPreview}>
        <Text style={{fontFamily: 'Poppins', fontWeight: '500', color: '#aaa'}}>
            Camera not Authorized
        </Text>
    </View>
);

const HomePickupScreen = ({navigation}) => {
    let cameraRef = useRef(null);
    const [qrData, setQrData] = useState(undefined);

    const handleBarCodeRead = ({data}: string) => {
        console.log(`Scanned QRCode: ${data}`);
        setQrData(data);
    };

    const barcodeSize = Math.min(WINDOW_WIDTH, WINDOW_HEIGHT);
    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark>
                {/*<StatusBar translucent backgroundColor="transparent"/>*/}
                <View style={{flexGrow: 1}}>
                    <View style={{height: barcodeSize * 0.8, marginHorizontal: -16, overflow: 'hidden'}}>
                        <RNCamera
                            ref={cameraRef}
                            captureAudio={false}
                            style={{
                                // flex: 1,
                                width: '100%',
                                height: barcodeSize * 0.8,
                            }}
                            onBarCodeRead={handleBarCodeRead}
                            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                            type={RNCamera.Constants.Type.back}
                            flashMode={RNCamera.Constants.FlashMode.off}
                            androidCameraPermissionOptions={{
                                title: 'Permission to use camera',
                                message: 'We need your permission to use your camera',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel',
                            }}
                            notAuthorizedView={<NotAuthorizedView/>}
                        >
                            <BarcodeMask
                                edgeColor={COLOR_PRIMARY_500}
                                animatedLineColor={COLOR_PRIMARY_500}
                                width={barcodeSize * 0.5}
                                height={barcodeSize * 0.5}
                                edgeRadius={5}
                                edgeBorderWidth={DEVICE_LARGE ? 3 : 2}
                                edgeHeight={DEVICE_LARGE ? 30 : 25}
                                edgeWidth={DEVICE_LARGE ? 30 : 25}
                            />
                        </RNCamera>
                        <Text>123</Text>
                    </View>
                    <View style={styles.dataWrapper}>
                        <View style={styles.dataContainer}>
                            <View style={{flexGrow: 1}}>
                                <Text style={styles.title2}>Katarina Doe</Text>
                                <Text style={styles.title3}>Order ID: 14521245</Text>
                            </View>
                            <View>
                                <Text style={[styles.title1, {color: COLOR_PRIMARY_900}]}>0/4</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.dataWrapper}>
                        <View style={styles.dataContainer}>
                            <View style={{paddingRight: 16}}>
                                <SvgXml width={22} xml={svgs['icon-package-closed']}/>
                            </View>
                            <View style={{flexGrow: 1}}>
                                <Text style={styles.title1}>Pickup</Text>
                                <Text style={styles.title2}>Dell Company Inc</Text>
                                <Text style={styles.title3}>123 suit, Abraham Mount, NyY</Text>
                            </View>
                            <View>
                                <SvgXml width={22} xml={svgs['icon-checkbox-checked']}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.dataWrapper}>
                        <View style={styles.dataContainer}>
                            <View style={{paddingRight: 16}}>
                                <SvgXml width={22} xml={svgs['icon-package-closed']}/>
                            </View>
                            <View style={{flexGrow: 1}}>
                                <Text style={styles.title1}>Pickup</Text>
                                <Text style={styles.title2}>Dell Company Inc</Text>
                                <Text style={styles.title3}>123 suit, Abraham Mount, NyY</Text>
                            </View>
                            <View>
                                <SvgXml width={22} xml={svgs['icon-checkbox-unchecked']}/>
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <PrimaryButton
                        title="Done"
                        onPress={() => navigation.pop()}
                    />
                </View>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    cameraPreview: {
        flex: 0,
        overflow: 'hidden',
        width: DEVICE_LARGE ? 280 : 230,
        height: DEVICE_LARGE ? 280 : 230,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dataWrapper: {
        marginBottom: 24,
    },
    dataContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title1: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    title2: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    title3: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_PRIMARY_900,
    },
    value: {
        fontWeight: '800',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_500,
        textAlign: 'right',
    },
});

export default HomePickupScreen;
