const User = require('../models/user.model');
const axios = require('axios');
const async = require('async');
const FB = require('fb');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Get Listing list
 */
function post(req, res, next){
  // extract data from body
	let data = req.body || {};
	let fbUserId = data.fb_user_id;
	let accessToken = data.token;
	let options = {
		appId: config.facebookAuth.clientID,
		xfbml: true,
		version: 'v2.6',
		status: true,
		cookie: true,
	};

  let fb = new FB.Facebook(options);
  fb.setAccessToken(accessToken);

  async.waterfall([
    cb => {
      // query the userdata from FB
      fb.api(
				'/me',
				'get',
				{ fields: 'id,name,email, first_name, last_name' },
				function(facebookUserData) {
					cb(null, facebookUserData);
				},
			);
    },
    (facebookUserData,cb) => {
      // build the data we're going to insert
			let data = {};
			data.email = facebookUserData.email;
			data.fb_uid = facebookUserData.id;
			data.first_name = facebookUserData.first_name;
			data.last_name = facebookUserData.last_name;

      User.show(data.email)
        .then(response => {
          if (response) {
            // generate jwt
						let jwtToken = jwt.sign(
							{
								response
							},
							config.jwt.secret,
						);
						let result = Object.assign(
							{},
							data,
							{ jwt: jwtToken },
						)
						console.log(result);
            res.json(result);
          }else{
            User.create(data)
              .then(user => {
								// generate jwt
								let jwtToken = jwt.sign(
									{
										user
									},
									config.jwt.secret,
								);
								user.jwt = jwtToken;
                res.json(user);
              })
              .catch(e => {
                next(e);
              });
          }
        })
        .catch(e => {
          next(e);
        });
    }
  ]);
}

/**
 * Get User From JWT Token
 */
function getFromToken(req, res, next) {
	let token = req.body.token || req.query.token;
	if (!token) {
		res.status(401).json({message: `No token found`});
	}

  // Check token by decoding using secret
	jwt.verify(token, config.jwt.secret, (err, user) => {
		if (err) next(err);

    // Get User from db
		let result = Object.assign(
			{},
			user.response,
			{jwt:token}
		);

		res.json(result);
	})
}

module.exports = {post,getFromToken};
