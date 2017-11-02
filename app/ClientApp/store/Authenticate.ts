import { fetch, addTask } from 'domain-task'
import { Action, Reducer, ActionCreator } from 'redux'
import { AppThunkAction } from './'
import axios from 'axios'

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AuthState {
    authFetching: boolean
    authenticated: boolean
    registered: boolean
    authMessages: string[]
    token?: string
    email?: string
    masterKey?: string
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects they just describe something that is going to happen.
interface RequestRegistrationAction{
    type: "REQUEST_REGISTRATION"
    authFetching: boolean
}

interface ReceiveRegistrationAction{
    type: "RECEIVE_REGISTRATION"
    authFetching: boolean
    authenticated: boolean
    registered: boolean
    authMessages: string[]
}

interface RequestVerifyEmailAction{
    type: "REQUEST_VERIFY_EMAIL"
    authFetching: boolean
}

interface ReceiveVerifyEmailAction{
    type: "RECEIVE_VERIFY_EMAIL"
    authFetching: boolean
    authMessages: string[]
}

interface RequestJWTAction {
    type: 'REQUEST_JWT'
    authFetching: boolean
}

interface ReceiveJWTAction {
    type: 'RECEIVE_JWT'
    authFetching: boolean
    authenticated: boolean
    authMessages: string[]
    token: string
    email: string
    masterKey: string
}

interface RequestRefreshJWTAction {
    type: 'REQUEST_REFRESH'
    authFetching: boolean
}

interface ReceiveRefreshJWTAction {
    type: 'RECEIVE_REFRESH'
    authFetching: boolean
    token: string
}

interface LogoutAction {
    type: 'LOGOUT'
    authMessages: string[]
}

interface ErrorMessageAction {
    type: 'ERROR_MESSAGE'
    authMessages: string[]
}

function parseSuccessMessages(response) {
    var messages = []
    if (response.data.messages){
        messages = response.data.messages
    }

    return messages
}

function parseErrorMessages(error) {
    var messages = []
    if (error.response.data.messages){
        messages = error.response.data.messages
    }

    return messages
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestRegistrationAction | ReceiveRegistrationAction | 
                    RequestVerifyEmailAction | ReceiveVerifyEmailAction |
                    RequestJWTAction | ReceiveJWTAction | 
                    RequestRefreshJWTAction | ReceiveRefreshJWTAction|
                    LogoutAction | ErrorMessageAction

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    registerUser: (email:string, password:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().auth.authFetching) {
            let fetchTask = axios.post('/api/Account/Create', {Email: email, Password: password})
                .then(response => {
                    dispatch({ type: 'RECEIVE_REGISTRATION', authenticated: false, registered: true, authMessages: parseSuccessMessages(response), authFetching: false })
                })
                .catch(error => {
                    dispatch({ type: 'RECEIVE_REGISTRATION', authenticated: false, registered: false, authMessages: parseErrorMessages(error), authFetching: false })
                })
            addTask(fetchTask) // Ensure server-side prerendering waits for this to complete
            dispatch({type: 'REQUEST_REGISTRATION', authFetching: true})
        }
    },

    requestVerifyEmail: (email:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().auth.authFetching) {
            let fetchTask = axios.post('/api/Account/ResendEmail', {Email: email})
                .then(response => {
                    dispatch({ type: 'RECEIVE_VERIFY_EMAIL', authMessages: parseSuccessMessages(response), authFetching: false })
                })
                .catch(error => {
                    dispatch({ type: 'RECEIVE_VERIFY_EMAIL', authMessages: parseErrorMessages(error), authFetching: false })
                })
            addTask(fetchTask) // Ensure server-side prerendering waits for this to complete
            dispatch({type: 'REQUEST_VERIFY_EMAIL', authFetching: true})
        }
    },

    // login
    loginUser: (email:string, password:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().auth.authFetching) {
            let fetchTask = axios.post('/api/Account/Token', {Email: email, Password: password})
                .then(response => {
                    // var hash = crypto.createHmac('sha1', 'W"?\3^32UhXq!&y>').update(password).digest('hex')
                    dispatch({ type: 'RECEIVE_JWT', authFetching: false, authenticated: response.data.status, authMessages: parseSuccessMessages(response), token: response.data.token, email:email, masterKey: password})
                })
                .catch(error => {
                    dispatch({ type: 'RECEIVE_JWT', authFetching: false, authenticated: false, authMessages: parseErrorMessages(error), token:'', email:'', masterKey:''})
                })
            addTask(fetchTask) // Ensure server-side prerendering waits for this to complete
            dispatch({type: 'REQUEST_JWT', authFetching: true})
        }
    },
    // logout
    logoutUser: (message:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'LOGOUT', authMessages:[message]})
    },

    // refresh token
    refreshToken: (token:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().auth.authFetching && getState().auth.authenticated) {
            let config = { headers: {'Authorization':`Bearer ${ token }`}}
            let fetchTask = axios.post('/api/Account/Refresh', {}, config)
                .then(response => {
                    dispatch({ type: 'RECEIVE_REFRESH', authFetching: false, token: response.data.token})
                })
                .catch(error => {
                    dispatch({ type: 'RECEIVE_REFRESH', authFetching: false, token: error.response.data.token})
                })
            addTask(fetchTask) // Ensure server-side prerendering waits for this to complete
            dispatch({type: 'REQUEST_REFRESH', authFetching: true})
        }
    },

    errorMessage: (messages:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'ERROR_MESSAGE', authMessages: [messages]})
    }
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: AuthState = { authFetching: false, authenticated: false, registered: false, authMessages: []}

export const reducer: Reducer<AuthState> = (state: AuthState, incomingAction: Action) => {
    const action = incomingAction as KnownAction
    switch (action.type) {
        case 'REQUEST_REGISTRATION':
            return {... state, authFetching: action.authFetching}
        case 'RECEIVE_REGISTRATION':
            return {... state, authFetching: action.authFetching, authenticated: action.authenticated, registered: action.registered, authMessages: action.authMessages}
        case 'REQUEST_VERIFY_EMAIL':
            return {... state, authFetching: action.authFetching}
        case 'RECEIVE_VERIFY_EMAIL':
            return {... state, authFetching: action.authFetching, authMessages: action.authMessages}
        case 'REQUEST_JWT':
            return {... state, authFetching: action.authFetching}
        case 'RECEIVE_JWT':
            return {... state, authFetching: action.authFetching, authenticated: action.authenticated, authMessages: action.authMessages, token: action.token, email: action.email, masterKey: action.masterKey}
        case 'REQUEST_REFRESH':
            return {... state, authFetching: action.authFetching}
        case 'RECEIVE_REFRESH':
            return {... state, authFetching: action.authFetching, token: action.token}
        case 'LOGOUT':
            return {... state, authenticated: false, registered: false, authMessages: action.authMessages, token:'', email:'', masterKey:''}
        case 'ERROR_MESSAGE' :
            return {... state, authMessages: action.authMessages}
    }

    return state || unloadedState
}
