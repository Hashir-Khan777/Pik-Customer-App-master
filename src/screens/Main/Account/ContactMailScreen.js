import React, {useState} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, TouchableOpacity, Image, View, Text} from 'react-native';
import FullWidthImage from '../../../components/FullWidthImage';
import {useTranslation} from 'react-i18next';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
const ContactMailScreen = ({navigation, ...props}) => {
  let {t} = useTranslation();
  return (
    <PageContainerDark Header={<HeaderPage title="" />}>
      <View>
        <FullWidthImage
          source={require('../../../assets/images/avatars-editables-pik-new-02.png')}
          aspectRatio={1}
        />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 22,
            marginBottom: 20,
            fontWeight: '700',
          }}>
          {t('pages.about_pik.sent_message')}
        </Text>
        <Text style={{textAlign: 'center', fontSize: 16}}>
          {t('pages.about_pik.ticket_register_success')}
        </Text>
      </View>
    </PageContainerDark>
  );
};
export default ContactMailScreen;
