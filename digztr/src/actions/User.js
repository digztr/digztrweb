import * as axios from 'axios';
import config from '../config';

/**
 * FB_LOGIN
 * @type {string}
 */
export const FB_LOGIN = 'USER_FB_LOGIN';

/**
 * _fbLoginInitial
 * @param initial
 * @private
 */
const _fbLoginInitial = initial => ({ type: FB_LOGIN, initial });

/**
 * fbLogin
 * Performs Facebook login, and on success posts return data to API
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param response {Object}
 * @returns {Function}
 */
export function fbLogin(response) {
	const token = response.authResponse.accessToken;
	const userID = response.authResponse.userID;
	return dispatch => {
		axios
			.post(`${config.api.baseUrl}/api/users`, {
				token: token,
				fb_user_id: userID,
			})
			.then(function(res) {
				localStorage.setItem('jwt', res.data.jwt);
				dispatch(_fbLoginInitial(res.data));
			})
			.catch(function(res) {
				dispatch(_fbLoginInitial(res.data));
			});
	};
}

/**
 * LOGOUT
 * @type {string}
 */
export const LOGOUT = 'USER_LOGOUT';

/**
 * _logoutRequest
 * @private
 */
export const _logoutRequest = () => ({ type: LOGOUT });

/**
 * _logoutResponse
 * @param response
 * @private
 */
export const _logoutResponse = response => ({ type: LOGOUT, response });

/**
 * logout
 * Performs Facebook logout for a given user
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @returns {Function}
 */
export function logout() {
	return dispatch => {
		dispatch(_logoutRequest());
		window.FB.logout(response => {
			dispatch(_logoutResponse(response));
		});
	};
}

/**
 * LOGOUT
 * @type {string}
 */
export const CHECK_JWT = 'CHECK_JWT';

/**
 * _logoutRequest
 * @private
 */
export const _checkJWTRequest = () => ({ type: CHECK_JWT });

/**
 * _logoutResponse
 * @param response
 * @private
 */
export const _checkJWTResponse = response => ({ type: CHECK_JWT, response });

/**
 * Check JWT
 * Check the jwt token to server and return user
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @returns {Function}
 */
export function checkJWT(token){
	return dispatch => {
		dispatch(_checkJWTRequest);
		axios
			.post(`${config.api.baseUrl}/api/users/token`, {
				token: token
			})
			.then(res => {
				dispatch(_checkJWTResponse(res.data));
			});
	}
}
