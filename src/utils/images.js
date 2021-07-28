import ImagePicker from './ImagePickerProvider';

const defaultOptions = {
    // cropping: true,
    // width: 180,
    // height: 180,
    // includeExif: true,
    cropperToolbarTitle: 'Select Photo',
    smartAlbums: ['RecentlyAdded', 'UserLibrary', 'PhotoStream', 'SelfPortraits'],
    useFrontCamera: false,
    compressImageQuality: 0.6,
    mediaType: 'photo',
};

export const takePhoto = (options={}) =>
    new Promise((res, rej) => {
        let finalOptions = {...defaultOptions, ...options};
        ImagePicker.openCamera(finalOptions)
            .then((response) => {
                if(!Array.isArray(response))
                    response = [response];
                let result = response.map(img => {
                    const {mime, path:uri} = img;
                    let fileName = uri.replace(/^.*[\\\/]/, '')
                    return {mime, uri, fileName};
                })
                res(options.multiple ? result : result[0])
            })
            .catch((err) => {
                rej(err);
            });
    });

export const chooseImage = (options={}) =>
    new Promise((res, rej) => {
        let finalOptions = {...defaultOptions, ...options};
        ImagePicker.openPicker(finalOptions)
            .then((response) => {
                if(!Array.isArray(response))
                    response = [response];
                let result = response.map(img => {
                    const {mime, path:uri} = img;
                    let fileName = uri.replace(/^.*[\\\/]/, '')
                    return {mime, uri, fileName};
                })
                res(options.multiple ? result : result[0])
                // console.log('size', response.size);
                // console.log('width', response.width);
                // console.log('height', response.height);
            })
            .catch((err) => {
                rej(err);
            });
    });

export const AVATAR_IMAGE_OPTIONS = {
    width: 800,
    height: 800,
    cropping: true,
    multiple: false,
    hideBottomControls: true,
}
