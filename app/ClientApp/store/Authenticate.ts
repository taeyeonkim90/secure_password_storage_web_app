import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import axios from 'axios';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AuthState {
    fetching: boolean;
    status: boolean;
    message: string[];
    token?: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
interface RequestRegistrationAction{
    type: "REQUEST_REGISTRATION";
    fetching: boolean;
}

interface ReceiveRegistrationAction{
    type: "RECEIVE_REGISTRATION";
    status: boolean;
    message: string[];
    fetching: boolean;
}

interface RequestJWTAction {
    type: 'REQUEST_JWT';
    email: string;
    password: string;
    fetching: boolean;
}

interface ReceiveJWTAction {
    type: 'RECEIVE_JWT';
    token: string;
    status: boolean;
    message: string[];
    fetching: boolean
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestRegistrationAction | ReceiveRegistrationAction | RequestJWTAction | ReceiveJWTAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    registerUser: (email:string, password:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type: "REQUEST_REGISTRATION", fetching: true});
        if (!getState().auth.fetching) {
            let fetchTask = axios.post('/api/Account/Create', {email: email, password: password})
                .then(response => {
                    dispatch({ type: 'RECEIVE_REGISTRATION', status: response.data.status, message: response.data.message, fetching: false });
                });
            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({type: "REQUEST_REGISTRATION", fetching: true});
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: AuthState = { fetching: false, status: false, message: []};

export const reducer: Reducer<AuthState> = (state: AuthState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_REGISTRATION':
            return {... state, fetching: action.fetching};
        case 'RECEIVE_REGISTRATION':
            return {... state, fetching: action.fetching, message: action.message, status: action.status}
    }

    return state || unloadedState;
};
