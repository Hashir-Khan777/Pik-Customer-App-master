import {GOOGLE_API_KEY} from '@env';
import Polyline from '@mapbox/polyline';
/**
 * Module to use google's geocoding & reverse geocoding.
 */
const GoogleApi = {
    apiKey : null,
    options : {},

    /**
     * Initialize the module.
     * @param {String} apiKey The api key of your application in google.
     * @param {Object} [options] extra options for your geocoding request.
     * @see https://developers.google.com/maps/documentation/geocoding/intro#geocoding
     */
    init(apiKey, options = {}) {
        this.apiKey = apiKey;
        this.options = options;
    },

    /**
     * @returns {boolean} True if the module has been initiated. False otherwise.
     */
    get isInit() {
        return !!this.apiKey;
    },

    /**
     * Do <a href="https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding">(reverse) geocoding</a>, converting geographic coordinates into a human-readable address & vice-versa.
     * Accepted parameters:
     * <ul>
     *     <li>from(Number latitude, Number longitude)</li>
     *     <li>from(Array [latitude, longitude])</li>
     *     <li>from(Object {latitude, longitude})</li>
     *     <li>from(Object {lat, lng})</li>
     *     <li>from(String address)</li>
     * </ul>
     * @returns {Promise.<Object>} Object containing informations about the place at the coordinates.
     * @see https://developers.google.com/maps/documentation/geocoding/intro#GeocodingResponses
     */
    async geocoding(...params) {
        // check api key
        if (!GoogleApi.isInit)
            throw {
                code : GoogleApi.Errors.NOT_INITIATED,
                message : "GoogleApi isn't initialized. Call GoogleApi.init function (only once), passing it your app's api key as parameter.",
            };

        // --- convert parameters ---
        let queryParams;

        // (latitude, longitude)
        if (!isNaN(params[0]) && !isNaN(params[1]))
            queryParams = {latlng : `${params[0]},${params[1]}`};

        // [latitude, longitude]
        else if (params[0] instanceof Array)
            queryParams = {latlng : `${params[0][0]},${params[0][1]}`};

        // {latitude, longitude}  or {lat, lng}
        else if (params[0] instanceof Object)
            queryParams = {latlng : `${params[0].lat || params[0].latitude},${params[0].lng || params[0].longitude}`};

        // address
        else if (typeof params[0] === 'string')
            queryParams = {address : params[0]};

        if (!queryParams)
        // no query params, means parameters where invalid
            throw {
                code : GoogleApi.Errors.INVALID_PARAMETERS,
                message : "Invalid parameters : \n" + JSON.stringify(params, null, 2),
            };

        return this._request('https://maps.google.com/maps/api/geocode/json', queryParams);
    },

    async search(...params) {
        if (!GoogleApi.isInit)
            throw {
                code : GoogleApi.Errors.NOT_INITIATED,
                message : "GoogleApi isn't initialized. Call GoogleApi.init function (only once), passing it your app's api key as parameter.",
            };
        let queryParams = {
            query : params[0],
        };
        if (!queryParams)
        // no query params, means parameters where invalid
            throw {
                code : GoogleApi.Errors.INVALID_PARAMETERS,
                message : "Invalid parameters : \n" + JSON.stringify(params, null, 2),
            };

        return this._request('https://maps.googleapis.com/maps/api/place/textsearch/json', queryParams);
    },

    async directions(origin, destination, waypoints) {
        if (!GoogleApi.isInit)
            throw {
                code : GoogleApi.Errors.NOT_INITIATED,
                message : "GoogleApi isn't initialized. Call GoogleApi.init function (only once), passing it your app's api key as parameter.",
            };

        let queryParams = {
            origin,
            destination
        };
        if(Array.isArray(waypoints) && waypoints.length > 0)
            queryParams['waypoints'] = waypoints.join('|');

        if (!queryParams)
        // no query params, means parameters where invalid
            throw {
                code : GoogleApi.Errors.INVALID_PARAMETERS,
                message : "Invalid parameters : \n" + JSON.stringify(params, null, 2),
            };

        let data = await this._request('https://maps.googleapis.com/maps/api/directions/json', queryParams);
        let points = Polyline.decode(data.routes[0].overview_polyline.points);
        data.overview_polyline.coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })
        return data;
    },

    async _request(apiUrl, params){
        let queryParams = { key: this.apiKey, ...this.options, ...params }
        // build url
        const url = `${apiUrl}?${toQueryParams(queryParams)}`;

        let response, data;

        // fetch
        try {
            response = await fetch(url);
        } catch(error) {
            throw {
                code : GoogleApi.Errors.FETCHING,
                message : "Error while fetching. Check your network.",
                origin : error,
            };
        }

        // parse
        try {
            data = await response.json();
        } catch(error) {
            throw {
                code : GoogleApi.Errors.PARSING,
                message : "Error while parsing response's body into JSON. The response is in the error's 'origin' field. Try to parse it yourself.",
                origin : response,
            };
        }

        // check response's data
        if (data.status !== 'OK')
            throw {
                code : GoogleApi.Errors.SERVER,
                message : "Error from the server while geocoding. The received datas are in the error's 'origin' field. Check it for more informations.",
                origin : data,
            };

        return data;
    },

    /**
     * All possible errors.
     */
    Errors : {
        /**
         * Module hasn't been initiated. Call {@link GoogleApi.init}.
         */
        NOT_INITIATED : 0,

        /**
         * Parameters are invalid.
         */
        INVALID_PARAMETERS : 1,

        /**
         * Error wile fetching to server.
         * The error.origin property contains the original fetch error.
         */
        FETCHING : 2,

        /**
         * Error while parsing server response.
         * The error.origin property contains the response.
         */
        PARSING : 3,

        /**
         * Error from the server.
         * The error.origin property contains the response's body.
         */
        SERVER : 4,
    },
}

/**
 * Convert an object into query parameters.
 * @param {Object} object Object to convert.
 * @returns {string} Encoded query parameters.
 */
function toQueryParams(object) {
    return Object.keys(object)
        .filter(key => !!object[key])
        .map(key => key + "=" + encodeURIComponent(object[key]))
        .join("&")
}

GoogleApi.init(GOOGLE_API_KEY);

export default GoogleApi
