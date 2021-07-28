import React, {useState, useRef, useEffect, useMemo} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {
  updateOrder as updateOrderAction,
  loadOrdersList as loadOrdersListAction,
} from '../../../redux/actions/appActions';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import Api from '../../../utils/api';
import {
  GRAY_LIGHT_EXTRA,
  COLOR_PRIMARY_900,
  COLOR_NEUTRAL_GRAY,
} from '../../../utils/constants';
import PrimaryButton from '../../../components/ButtonPrimary';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import globalStyles from '../../../utils/globalStyles';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import RadioInput from '../../../components/RadioInput';
import PhoneInput from '../../../components/PhoneInput';
import PaymentMethodPicker from '../../../components/PaymentMethodPicker';
import ViewCollapsable from '../../../components/ViewCollapsable';
import LocationPicker from '../../../components/LocationPicker';
import {
  clearPhoneNumber,
  obj2FormData,
  priceToFixed,
} from '../../../utils/helpers';
import {VehicleTypeBtn, navigateToOrderDetail} from './HomeSendPackageScreen';
import UserInfo from '../../../components/UserInfo';
import AlertBootstrap from '../../../components/AlertBootstrap';
import {PhoneNumberUtil} from 'google-libphonenumber';
import BoxShadow from '../../../components/BoxShadow';
import ImageGallery from '../../../components/ImageGallery';
import {compose} from 'redux';
import withAuth from '../../../redux/connectors/withAuth';
import PriceBreakdown from '../../../components/PriceBreakdown';
const phoneUtils = PhoneNumberUtil.getInstance();
import BaseModal from '../../../components/BaseModal';
import ButtonSecondary from '../../../components/ButtonSecondary';
import ProgressModal from '../../../components/ProgressModal';
import {useTranslation} from 'react-i18next';

const HomePendingPackageScreen = ({navigation, route, authUser, ...props}) => {
  let {t} = useTranslation();

  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState('');
  const [validateEnabled, setValidateEnabled] = useState(false);
  const [address, setAddress] = useState(null);
  const [hasNote, setHasNote] = useState(false);
  const [note, setNote] = useState('');
  const [creditCard, setCreditCard] = useState(null);
  const [seePriceBreakDown, setSeePriceBreakDown] = useState(false);
  const [direction, setDirection] = useState(null);
  const [price, setPrice] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(false);
  const [orderCanceled, setOrderCanceled] = useState(false);
  const {orderId} = route.params;
  const {orders, ordersLoaded, ordersLoading, loadOrdersList} = props;
  const order = useMemo(() => {
    let o = props.orders.find((o) => o._id === orderId);
    if (!o) loadOrdersList();
    return o;
  }, [orderId, JSON.stringify(orders)]);

  let needPayment = useMemo(() => {
    return !order?.isRequest && order?.payer == 'receiver';
  }, [order, authUser]);

  useEffect(() => {
    if (!address) return;
    let pickupAddress = !!order.pickup.address ? order.pickup.address : address;
    let deliveryAddress = !!order.delivery.address
      ? order.delivery.address
      : address;
    Api.Customer.calcOrderPrice(
      order.vehicleType,
      pickupAddress,
      deliveryAddress,
    ).then(({success, price, direction, message}) => {
      console.log(price);
      if (success) {
        setPrice(price);
        setDirection(direction);
      }
    });
  }, [address]);

  useEffect(() => {
    let intervalOrder = setInterval(() => {
      console.log('******* get order detail');
      Api.Customer.getOrderDetail(order._id)
        .then((response) => {
          if (response.order.status == 'Canceled') {
            setOrderCanceled(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 8000);
    return () => clearInterval(intervalOrder);
  }, []);

  const selectLocation = () => {
    navigation.navigate('LocationGet', {setLocation: setAddress, address});
  };

  // ======== Validations =============
  const validateAddress = (address) => {
    if (!address) return t('pages.mainHome.select_location');
  };
  const validateCreditCard = (cardNumber) => {
    if (!cardNumber) return t('pages.mainHome.select_credit_card');
  };
  // ==================================

  const createFormData = () => {
    const data = new FormData();

    let formBody = {
      address,
      creditCard,
    };

    obj2FormData(data, formBody, '');

    return data;
  };

  const completeOrder = () => {
    setError('');

    let errors = [
      validateAddress(address),
      !order?.isRequest && order?.payer == 'receiver'
        ? validateCreditCard(creditCard)
        : null,
    ].filter(_.identity);

    if (errors.length > 0) {
      setValidateEnabled(true);
      setError(t('pages.mainHome.check_form_try'));
      return;
    }

    let formData = createFormData();

    setInProgress(true);
    Api.Customer.completeOrder(order._id, formData)
      .then((response) => {
        console.log('Response', response);
        let {success, message, order} = response;
        if (success) {
          props.reduxUpdateOrder(order._id, order);
          navigateToOrderDetail(navigation, order._id);
        } else {
          setError(message || 'Somethings went wrong');
        }
      })
      .catch((error) => {
        setError(error.message || 'Somethings went wrong');
        console.error(JSON.stringify(error, null, 2), Date.now());
      })
      .then(() => {
        setInProgress(false);
      });
  };

  const onCancelClick = () => {
    setCancelOrder(true);
  };

  const onOkHandle = () => {
    setCancelOrder(false);

    Api.Customer.cancelOrderRequest(orderId)
      .then((response) => {
        console.log(response);
        loadOrdersList();

        setTimeout(() => navigation.goBack(), 200);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onCancelHandle = () => {
    setCancelOrder(false);
  };

  const navigateToHome = () => {
    navigation.navigate(
        "MainHome",
        {
            screen: "MainHomeMain",
        }
    )
  }

  let photos = useMemo(() => {
    if (!order) return [];
    return order.packages
      .map((p) => p.photos)
      .reduce((prev, next) => prev.concat(next));
  }, [JSON.stringify(order?.packages)]);

  let imageGalleryRef = null;

  return (
    <KeyboardAvoidingScreen>
      <PageContainerDark
        contentStyle={{paddingBottom: 0}}
        Header={
          <HeaderPage
            title={t('pages.mainHome.pending_package')}
            color={HeaderPage.Colors.BLACK}
          />
        }
        footer={
          <View style={{paddingBottom: 10, justifyContent: 'center'}}>
            <PrimaryButton
              style={{marginHorizontal: -16, borderRadius: 0}}
              title={t('pages.mainHome.complete_order')}
              inProgress={inProgress}
              disabled={inProgress}
              onPress={() => completeOrder()}
            />
            <Text
              style={{
                textAlign: 'center',
                marginTop: 10,
                fontSize: 14,
                lineHeight: 18,
              }}
              onPress={() => onCancelClick()}>
              {t('pages.mainHome.cancel_order')}
            </Text>
          </View>
        }
        footerStyle={{marginHorizontal: -16}}>
        <View style={{flexGrow: 1}}>
          <View style={globalStyles.inputWrapper}>
            <AlertBootstrap
              type="warning"
              message={t('pages.mainHome.waiting_complete_order')}
              onClose={() => {}}
            />
          </View>
          {!!order?.pickup?.customerNote && (
            <View style={globalStyles.inputWrapper}>
              <AlertBootstrap
                type="info"
                message={
                  `${order.receiver.name}:\n` + order?.pickup?.customerNote
                }
              />
            </View>
          )}
          <View
            style={[
              globalStyles.inputWrapper,
              globalStyles.flexRow,
              {flexWrap: 'wrap', marginHorizontal: -8},
            ]}>
            {photos.map((p, i) => (
              <TouchableOpacity key={i} onPress={() => imageGalleryRef.show()}>
                <BoxShadow>
                  <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{uri: p}} />
                  </View>
                </BoxShadow>
              </TouchableOpacity>
            ))}
            <ImageGallery
              ref={(ref) => {
                imageGalleryRef = ref;
              }}
              imageUrls={photos}
            />
          </View>
          {/* ===== Location ===== */}
          <View style={globalStyles.inputWrapper}>
            <LocationPicker
              placeholder={
                order?.isRequest
                  ? t('pages.mainHome.select_pickup_location')
                  : t('pages.mainHome.select_delivery_location')
              }
              value={address}
              onPress={selectLocation}
              errorText={validateEnabled && validateAddress(address)}
            />
          </View>

          {/* ===== Note ===== */}
          <View style={globalStyles.inputWrapper}>
            {hasNote ? (
              <CustomAnimatedInput
                placeholder={
                  order?.isRequest
                    ? t('pages.mainHome.pickup_note')
                    : t('pages.mainHome.delivery_note')
                }
                value={note}
                onChangeText={setNote}
              />
            ) : (
              <Text onPress={() => setHasNote(true)} style={globalStyles.link}>
                {order?.isRequest
                  ? t('pages.mainHome.pickup_note')
                  : t('pages.mainHome.delivery_note')}
              </Text>
            )}
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => setSeePriceBreakDown(!seePriceBreakDown)}>
            <View style={[styles.flexRow, {alignItems: 'center'}]}>
              <Text style={styles.totalPriceTitle}>
                {t('payment_detail.see_price_breakdown')}
              </Text>
              <Text style={styles.totalPrice}>
                US$ {priceToFixed(price?.total)}
              </Text>
              <View style={globalStyles.arrowRight} />
            </View>
          </TouchableOpacity>
          <ViewCollapsable collapsed={!seePriceBreakDown}>
            <PriceBreakdown
              price={price}
              distance={
                !direction ? null : direction.routes[0].legs[0].distance
              }
            />
          </ViewCollapsable>

          <View style={styles.spacer} />
          {needPayment && (
            <View style={globalStyles.inputWrapper}>
              <PaymentMethodPicker
                selected={creditCard}
                onValueChange={setCreditCard}
                errorText={validateEnabled && validateCreditCard(creditCard)}
              />
            </View>
          )}
          {!!error && (
            <AlertBootstrap
              type="danger"
              message={error}
              onClose={() => setError('')}
            />
          )}
        </View>
      </PageContainerDark>
      {orderCanceled && (
        <ProgressModal
          title={t('pages.mainHome.order_canceled')}
          visible={true}
          onRequestClose={() => navigateToHome()}
        />
      )}

      {cancelOrder && (
        <BaseModal
          // visible={visible}
          style={{minWidth: 320}}>
          <Text style={{fontSize: 17, padding: 10}}>
            {t('pages.mainHome.ru_cancel_order')}
          </Text>
          <View style={styles.cancelOrderButtonContainer}>
            <PrimaryButton
              style={{width: 120, height: 35}}
              onPress={onOkHandle}
              title={t('general.yes')}
            />
            <ButtonSecondary
              style={{width: 120, height: 35}}
              onPress={onCancelHandle}
              title={t('general.no')}
            />
          </View>
        </BaseModal>
      )}
    </KeyboardAvoidingScreen>
  );
};

const mapStateToProps = (state) => {
  let {orders, ordersLoaded, ordersLoading} = state.app;
  return {orders, ordersLoaded, ordersLoading};
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadOrdersList: () => dispatch(loadOrdersListAction()),
    reduxUpdateOrder: (orderId, update) =>
      dispatch(updateOrderAction(orderId, update)),
  };
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  h1: {
    fontWeight: '900',
    fontSize: 16,
    lineHeight: 24,
  },
  vehicleTypeBtn: {
    backgroundColor: GRAY_LIGHT_EXTRA,
    height: 36,
    borderRadius: 18,
    padding: 6,
  },
  vehicleTypeText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
  },
  pikAccountAlert: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: COLOR_NEUTRAL_GRAY,
  },
  totalPriceTitle: {
    color: COLOR_PRIMARY_900,
    flexGrow: 1,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
  },
  totalPrice: {
    paddingHorizontal: 16,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 24,
  },
  priceItem: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
  },
  priceItemSpacer: {
    height: 1,
    backgroundColor: '#ddd',
  },
  priceItemTitle: {
    flexGrow: 1,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
  },
  priceItemValue: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
  },
  spacer: {
    backgroundColor: GRAY_LIGHT_EXTRA,
    height: 2,
    marginHorizontal: -16,
    marginVertical: 19,
  },
  packagePhoto: {
    height: 64,
    width: 64,
    marginRight: 5,
    marginBottom: 5,
  },
  imageContainer: {
    borderRadius: 5,
    overflow: 'hidden',
    margin: 8,
    // marginVertical: 20,
  },

  image: {
    width: 64,
    height: 64,
    backgroundColor: '#999',
  },
  cancelOrderButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});

const enhance = compose(withAuth, connect(mapStateToProps, mapDispatchToProps));

export default enhance(HomePendingPackageScreen);
