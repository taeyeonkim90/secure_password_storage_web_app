import { fetch, addTask } from 'domain-task'
import { Action, Reducer, ActionCreator } from 'redux'
import { AppThunkAction } from './'
import axios from 'axios'

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AuthState {
    authFetching: boolean
    authenticated: boolean
    messages: string[]
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
    messages: string[]
}

interface RequestJWTAction {
    type: 'REQUEST_JWT'
    authFetching: boolean
}

interface ReceiveJWTAction {
    type: 'RECEIVE_JWT'
    authFetching: boolean
    authenticated: boolean
    messages: string[]
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
    messages: string[]
}

interface ErrorMessageAction {
    type: 'ERROR_MESSAGE'
    messages: string[]
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
                    dispatch({ type: 'RECEIVE_REGISTRATION', authenticated: false, messages: parseSuccessMessages(response), authFetching: false })
                })
                .catch(error => {
                    dispatch({ type: 'RECEIVE_REGISTRATION', authenticated: false, messages: parseErrorMessages(error), authFetching: false })
                })
            addTask(fetchTask) // Ensure server-side prerendering waits for this to complete
            dispatch({type: 'REQUEST_REGISTRATION', authFetching: true})
        }
    },
    // login
    loginUser: (email:string, password:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().auth.authFetching) {
            let fetchTask = axios.post('/api/Account/Token', {Email: email, Password: password})
                .then(response => {
                    // var hash = crypto.createHmac('sha1', 'W"?\3^32UhXq!&y>').update(password).digest('hex')
                    dispatch({ type: 'RECEIVE_JWT', authFetching: false, authenticated: response.data.status, messages: parseSuccessMessages(response), token: response.data.token, email:email, masterKey: password})
                })
                .catch(error => {
                    dispatch({ type: 'RECEIVE_JWT', authFetching: false, authenticated: false, messages: parseErrorMessages(error), token:'', email:'', masterKey:''})
                })
            addTask(fetchTask) // Ensure server-side prerendering waits for this to complete
            dispatch({type: 'REQUEST_JWT', authFetching: true})
        }
    },
    // logout
    logoutUser: (message:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'LOGOUT', messages:[message]})
    },

    // refresh token
    refreshToken: (token:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().auth.authFetching) {
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
        dispatch({ type: 'ERROR_MESSAGE', messages: [messages]})
    }
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: AuthState = { authFetching: false, authenticated: false, messages: []}

export const reducer: Reducer<AuthState> = (state: AuthState, incomingAction: Action) => {
    const action = incomingAction as KnownAction
    switch (action.type) {
        case 'REQUEST_REGISTRATION':
            return {... state, authFetching: action.authFetching}
        case 'RECEIVE_REGISTRATION':
            return {... state, authFetching: action.authFetching, authenticated: action.authenticated, messages: action.messages}
        case 'REQUEST_JWT':
            return {... state, authFetching: action.authFetching}
        case 'RECEIVE_JWT':
            return {... state, authFetching: action.authFetching, authenticated: action.authenticated, messages: action.messages, token: action.token, email: action.email, masterKey: action.masterKey}
        case 'REQUEST_REFRESH':
            return {... state, authFetching: action.authFetching}
        case 'RECEIVE_REFRESH':
            return {... state, authFetching: action.authFetching, token: action.token}
        case 'LOGOUT':
            return {... state, authenticated: false, messages: action.messages, token:'', email:'', masterKey:''}
        case 'ERROR_MESSAGE' :
            return {... state, messages: action.messages}
    }

    return state || unloadedState
}
