import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	LOGIN_LOAD,
	LOGIN_SUCCESS,
	LOGIN_FAIL,

	LOGOUT_SUCCESS,
} from './actions';

import {
	LOAD_APP_AND_LOGIN_SUCCESS,
} from 'containers/App/actions';

import {
	SIGNUP_SUCCESS,
	SIGNUP_DETAILS_SUCCESS,
} from 'containers/SignUp/actions';

import {
	SAVE_SETTINGS_SUCCESS,
} from 'containers/UserSettings/actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	loggedIn: false,
	userData: {},
	loading: false,
	error: undefined
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

function loginLoading(state) {
	return state.merge({
		loading: true,
		error: undefined
	});
}

function loginSuccess(state, loginData) {
	return state.merge({
		loggedIn: !!loginData.username && true,
		userData: !!loginData.username && loginData,
		loading: false,
		error: undefined
	});
}

function loginFailed(state, error) {
	let errorMessage = '';
	switch (error.toString()) {
	case 'Error: Unauthorized':
		errorMessage = 'Invalid Username or Password'; break;
	default: 
		errorMessage = 'Email already used'; break;
	}

	return state.merge({loading: false, error: errorMessage});
}

function loggedOut(state) {
	return defaultState;
}

function signUpDetailsSuccess(state, result) {
	return state.mergeIn(['userData'], result);
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function reducer(state = defaultState, action) {

	switch (action.type) {
	case LOGIN_LOAD:
		return loginLoading(state);
	case LOGIN_SUCCESS:
	case LOAD_APP_AND_LOGIN_SUCCESS:
	case SIGNUP_SUCCESS:
		return loginSuccess(state, action.result.loginData);
	case LOGIN_FAIL:
		return loginFailed(state, action.error);

	case LOGOUT_SUCCESS:
		return loggedOut(state);

	case SIGNUP_DETAILS_SUCCESS:
	case SAVE_SETTINGS_SUCCESS: 
		return signUpDetailsSuccess(state, action.result);

	default:
		return ensureImmutable(state);
	}
}
