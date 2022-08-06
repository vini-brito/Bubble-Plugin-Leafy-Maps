function(properties, context) {

    const request1 = require("request");
    const request = require("request-promise");
    const OAuth = require('oauth-1.0a');
    const crypto = require('crypto');



    // this declares AND calls it at the same time
    let generateToken = context.async(async callback => {

        try {

            const oauth = OAuth({
                consumer: {
                    key: context.keys["Here API access key"], //Access key
                    secret: context.keys["Here API secret key"], //Secret key
                },
                signature_method: 'HMAC-SHA256',
                hash_function(base_string, key) {
                    return crypto
                        .createHmac('sha256', key)
                        .update(base_string)
                        .digest('base64')
                },
            });

            const request_data = {
                url: 'https://account.api.here.com/oauth2/token',
                method: 'POST',
                data: { grant_type: 'client_credentials' },
            };

            let token = await request(
                {
                    url: request_data.url,
                    method: request_data.method,
                    form: request_data.data,
                    headers: oauth.toHeader(oauth.authorize(request_data)),
                },

            );

            callback(null, JSON.parse(token).access_token);

        } catch (err) {

            callback(err);

        }
    });


    // this returns it from server side
    return {

        attained_token: generateToken

    }

}