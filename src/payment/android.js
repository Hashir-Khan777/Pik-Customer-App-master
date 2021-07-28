export const METHOD_DATA = [{
    supportedMethods: ['android-pay'],
    data: {
        supportedNetworks: ['visa', 'mastercard', 'amex'],
        currencyCode: 'USD',
        environment: 'TEST', // defaults to production
        paymentMethodTokenizationParameters: {
            tokenizationType: 'NETWORK_TOKEN',
            parameters: {
                publicKey: 'W7C7yq-5q22rM-33y63Z-zkb5Uv'
            }
        }
    }
}];
