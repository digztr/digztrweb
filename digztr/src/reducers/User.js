import {User as UserActions} from '../actions';

/**
 * initialState
 * @type {{id: string, fb_uid: string, first_name: string, last_name: string, email: string}}
 */
const initialState = {
	_id: '',
	fb_uid: '',
	first_name: '',
	last_name: '',
	email: '',
	role: ""
};

/**
 * Listing
 * Redux Reducer for Listing action
 * Reference: http://redux.js.org/docs/basics/Reducers.html
 * @param state
 * @param action
 * @returns {*}
 * @constructor
 */
 export default function User(state = initialState, action) {
	 console.log(action);
 	switch (action.type) {
 		case UserActions.LOGIN:
 			return Object.assign({}, state, action.response);

 		case UserActions.FB_LOGIN:
 			if (action.initial) {
 				return Object.assign({}, state, {
 					_id: action.initial._id,
 					fb_uid: action.initial.fb_uid,
 					first_name: action.initial.first_name,
 					last_name: action.initial.last_name,
 					email: action.initial.email,
 				});
 			}
 			return state;

 		case UserActions.LOGOUT:
 			return Object.assign({}, state, initialState);

		case UserActions.CHECK_JWT:
			if (action.response) {
				return Object.assign({}, state, {
 					_id: action.response._id,
 					fb_uid: action.response.fb_uid,
 					first_name: action.response.first_name,
 					last_name: action.response.last_name,
 					email: action.response.email,
					role: action.response.role,
 				});
			}
			return state;
 	}

 	return state;
 }
