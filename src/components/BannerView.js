import React, {useEffect, useState, useMemo} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {
  COLOR_NEUTRAL_GRAY,
  GRADIENT_2,
  GRADIENT_7,
  GRAY_LIGHT,
  GRAY_LIGHT_EXTRA,
} from '../utils/constants';
import GradientView from './GradientView';
import Api from '../utils/api';
import useComponentSize from '../utils/useComponentSize';
import {SliderBox} from 'react-native-image-slider-box';

const BannerView = () => {
  const [size, onLayout] = useComponentSize();
  const [photoSize, setPhotoSize] = useState(null);
  const [banner, setBanner] = useState([]);

  let hasDiscount = !!banner?.discount && banner?.discount > 0;
  let DiscountView = hasDiscount ? GradientView : View;

  const onImageLoaded = (data) => {
    let {width, height} = data?.nativeEvent?.source || {};
    setPhotoSize({width, height});
  };

  let imageHeight = useMemo(() => {
    if (!photoSize?.width || !size?.width) return 185;
    return (photoSize.height / photoSize.width) * size.width;
  }, [photoSize, size]);

  useEffect(() => {
    Api.Customer.getBanner().then(({success, banner}) => {
      if (success && banner) {
          const formattedBanners = banner.reduce((finalArry,item)=>{
              const formattedBanner = item.file;
              finalArry.push(formattedBanner);
              return finalArry;
          },[])
          setBanner(formattedBanners)
        }
      else setBanner({title: 'Your Banner Comes Here'});
    });
  }, []);

  return (
    <View style={styles.container}>
      {banner?.length !== 0 ? (
        // <Image
        //     style={[styles.image, {height: imageHeight}]}
        //     // source={require('../assets/images/ads-01.png')}
        //     source={{uri: banner.file}}
        //     onLoad={onImageLoaded}
        //     onLayout={onLayout}
        // />
        <SliderBox
          images={banner}
          sliderBoxHeight={184}
          onCurrentImagePressed={(index) =>
            console.warn(`image ${index} pressed`)
          }
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
          paginationBoxVerticalPadding={20}
          autoplay
          circleLoop
          resizeMethod={'resize'}
          resizeMode={'cover'}
          paginationBoxStyle={{
            position: 'absolute',
            bottom: 0,
            padding: 0,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
          }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            padding: 0,
            margin: 0,
            backgroundColor: 'rgba(128, 128, 128, 0.92)',
          }}
          ImageComponentStyle={{borderRadius: 5, width: '100%'}}
          imageLoadingColor="#2196F3"
          autoplayInterval={10000}
        />
      ) : (
        <View style={styles.image}>
        </View>
      )}
      {/*<GradientView*/}
      {/*    style={styles.gradient}*/}
      {/*    gradient={GRADIENT_7}*/}
      {/*/>*/}
      {/*<View style={StyleSheet.absoluteFill}>*/}
      {/*<View style={{height: 32}}>*/}
      {/*    <View style={styles.offContainer}>*/}
      {/*        <DiscountView style={{borderBottomLeftRadius: 8}} gradient={GRADIENT_2}>*/}
      {/*            {hasDiscount && (*/}
      {/*                <Text style={styles.offText}>-{banner.discount}%</Text>*/}
      {/*            )}*/}
      {/*        </DiscountView>*/}
      {/*    </View>*/}
      {/*</View>*/}
      {/*<Text style={styles.title}>{banner?.title}</Text>*/}
      {/*<Text style={styles.description}>{banner?.description}</Text>*/}
      {/*</View>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: 184,
    backgroundColor: GRAY_LIGHT,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  offContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  offText: {
    lineHeight: 32,
    color: 'white',
    paddingHorizontal: 17,
  },
  title: {
    color: 'white',
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 28,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  description: {
    color: 'white',
    paddingHorizontal: 16,
    fontWeight: '500',
    lineHeight: 24,
    fontSize: 14,
  },
});

export default BannerView;
