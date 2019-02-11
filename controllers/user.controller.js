const User = require('../models/user.model');
const axios = require('axios');
const async = require('async');
const FB = require('fb');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const config = require('../config/config');

/**
* Registration Form Validator
*/
const validate_register = [
	check('first_name')
		.isLength({min:1})
		.withMessage('First Name is required')
		.trim(),
	check('last_name')
		.isLength({min:1})
		.withMessage('Last Name is required')
		.trim(),
	check('email')
		.isLength({min:1})
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Must be a valid email')
		.trim(),
	check('password')
		.isLength({min:1})
		.withMessage('Password is required')
		.trim(),
	check('password_confirm')
		.custom((value, { req }) => value === req.body.password)
		.withMessage('Password do not match')
		.trim(),
	check('role')
		.exists()
		.withMessage('Please Select if your are a home owner/buyer or realtor')
		.trim(),
]
/**
 * Register Account
 */
function register(req, res, next){
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors);
		res.status(500).json({errors: errors.mapped()});
	} else {
		// extract data from body
		let data = req.body || {};

		if (data.hasOwnProperty('fb_user_id')) {
			// for facebook signup
		} else {
			// for non social / default signup
			User.show(data.email).then(user => {

				if (user) {
					console.log(user);
					res.status(500).json({
						errors: {
							"email": {
								"location": "body",
		            "param": "email",
		            "value": data.email,
		            "msg": "Email is already in use"
							}
						}
					});
				}else{
					bcrypt.hash(data.password, 10, (err,hash) => {
						let payload = Object.assign(
							{},
							data,
							{ status: 'active', fb_uid: '', password: hash }
						);

						User.create(payload).then(usr => {
							let user = {
								_id: usr._id,
								first_name: usr.first_name,
								last_name: usr.last_name,
								email: usr.email,
								role: usr.role
							}
							// generate jwt
							let jwtToken = jwt.sign(
								{
									user
								},
								config.jwt.secret,
							);
							data = {
								first_name: data.first_name,
								last_name: data.last_name,
								email: data.email,
							}
							let result = Object.assign(
								{},
								data,
								{ jwt: jwtToken },
							);
							res.json(result);
						});
					});
				}
			});


		}

	}

}

/**
 * Login
 */
function login(req, res, next){
  // extract data from body
	let data = req.body || {};

	if (data.hasOwnProperty('fb_user_id')) {
    // facebook login

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
	} else {
    // default Login
		User.show(data.email).then(usr => {
			if (!usr) {
				res.status(500).json({
					errors: {
						"email": {
							"location": "body",
							"param": "email/password",
							"msg": "Incorrect Email / Password"
						}
					}
				});
			} else {
				bcrypt.compare(data.password, usr.password, (err,response) => {
					if (response) {
						let user = {
							_id: usr._id,
							first_name: usr.first_name,
							last_name: usr.last_name,
							email: usr.email,
							role: usr.role
						}
						// generate jwt
						let jwtToken = jwt.sign(
							{
								user
							},
							config.jwt.secret,
						);
						let result = Object.assign(
							{},
							user,
							{ jwt: jwtToken },
						)
						console.log(result);
						res.json(result);
					}else {
						res.status(500).json({
							errors: {
								"email": {
									"location": "body",
									"param": "email/password",
									"msg": "Incorrect Email / Password"
								}
							}
						});
					}
				});
			}
		})
	}


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
	jwt.verify(token, config.jwt.secret, (err, response) => {
		if (err) next(err);
		console.log(response);
    // Get User from db
		let result = Object.assign(
			{},
			response.user,
			{jwt:token}
		);

		res.json(result);
	})
}

module.exports = {login,getFromToken,validate_register,register};
