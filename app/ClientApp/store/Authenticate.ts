import { fetch, addTask } from 'domain-task'
import { Action, Reducer, ActionCreator } from 'redux'
import { AppThunkAction } from './'
import axios from 'axios'

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AuthState {
    fetching: boolean
    authenticated: boolean
    message: string[]
    token?: string
    key?: string
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects they just describe something that is going to happen.
interface RequestRegistrationAction{
    type: "REQUEST_REGISTRATION"
    fetching: boolean
}

interface ReceiveRegistrationAction{
    type: "RECEIVE_REGISTRATION"
    fetching: boolean
    authenticated: boolean
    message: string[]
}

interface RequestJWTAction {
    type: 'REQUEST_JWT'
    fetching: boolean
}

interface ReceiveJWTAction {
    type: 'RECEIVE_JWT'
    fetching: boolean
    authenticated: boolean
    message: string[]
    token: string
    key: string
}

interface RequestRefreshJWTAction {
    type: 'REQUEST_REFRESH'
    fetching: boolean
}

interface ReceiveRefreshJWTAction {
    type: 'RECEIVE_REFRESH'
    fetching: boolean
    token: string
}

interface LogoutAction {
    type: 'LOGOUT'
}

interface ErrorMessageAction {
    type: 'ERROR_MESSAGE'
    message: string[]
}



// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestRegistrationAction | ReceiveRegistrationAction | 
                    RequestJWTAction | ReceiveJWTAction | 
                    RequestRefreshJWTAction | ReceiveRefreshJWTAction|
                    LogoutAction | ErrorMessageAction

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    registerUser: (email:string, password:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().auth.fetching) {
            let fetchTask = axios.post('/api/Account/Create', {Email: email, Password: password})
                .then(response => {
                    dispatch({ type: 'RECEIVE_REGISTRATION', authenticated: false, message: response.data.message, fetching: false })
                })
                .catch(error => {
                    dispatch({ type: 'RECEIVE_REGISTRATION', authenticated: false, message: error.response.data.message, fetching: false })
                })
            addTask(fetchTask) // Ensure server-side prerendering waits for this to complete
            dispatch({type: 'REQUEST_REGISTRATION', fetching: true})
        }
    },
    // login
    loginUser: (email:string, password:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().auth.fetching) {
            let fetchTask = axios.post('/api/Account/Token', {Email: email, Password: password})
                .then(response => {
                    // var hash = crypto.createHmac('sha1', 'W"?\3^32UhXq!&y>').update(password).digest('hex')
                    dispatch({ type: 'RECEIVE_JWT', fetching: false, authenticated: response.data.status, message: response.data.message, token: response.data.token, key: password})
                })
                .catch(error => {
                    dispatch({ type: 'RECEIVE_JWT', fetching: false, authenticated: false, message: error.response.data.message, token: '', key: ''})
                })
            addTask(fetchTask) // Ensure server-side prerendering waits for this to complete
            dispatch({type: 'REQUEST_JWT', fetching: true})
        }
    },
    // logout
    logoutUser: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'LOGOUT'})
    },

    // refresh token
    refreshToken: (token:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().auth.fetching) {
            let config = { headers: {'Authorization':`Bearer ${ token }`}}
            let fetchTask = axios.post('/api/Account/Refresh', {}, config)
                .then(response => {
                    dispatch({ type: 'RECEIVE_REFRESH', fetching: false, token: response.data.token})
                })
                .catch(error => {
                    dispatch({ type: 'RECEIVE_REFRESH', fetching: false, token: error.response.data.token})
                })
            addTask(fetchTask) // Ensure server-side prerendering waits for this to complete
            dispatch({type: 'REQUEST_REFRESH', fetching: true})
        }
    } ,

    errorMessage: (message:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'ERROR_MESSAGE', message: [message]})
    }
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: AuthState = { fetching: false, authenticated: false, message: []}

export const reducer: Reducer<AuthState> = (state: AuthState, incomingAction: Action) => {
    const action = incomingAction as KnownAction
    switch (action.type) {
        case 'REQUEST_REGISTRATION':
            return {... state, fetching: action.fetching}
        case 'RECEIVE_REGISTRATION':
            return {... state, fetching: action.fetching, authenticated: action.authenticated, message: action.message}
        case 'REQUEST_JWT':
            return {... state, fetching: action.fetching}
        case 'RECEIVE_JWT':
            return {... state, fetching: action.fetching, authenticated: action.authenticated, message: action.message, token: action.token, key: action.key}
        case 'REQUEST_REFRESH':
            return {... state, fetching: action.fetching}
        case 'RECEIVE_REFRESH':
            return {... state, fetching: action.fetching, token: action.token}
        case 'LOGOUT':
            return {... state, authenticated: false, message: [], token: '', key: ''}
        case 'ERROR_MESSAGE' :
            return {... state, message: action.message}
    }

    return state || unloadedState
}
