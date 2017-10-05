import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import axios from 'axios';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CardsState {
    fetching: boolean;
    cards: CardData[];
}

export interface CardData {
    index: number;
    accountName: string;
    userName: string;
    pw: string;
    description: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
interface RequestCardsAction {
    type: 'REQUEST_CARDS';
}

interface ReceiveCardsAction {
    type: 'RECEIVE_CARDS';
    cards: CardData[];
}

interface UpdateCardsAction {
    type: 'UPDATE_CARDS';
    cards: CardData[];
}

interface DeleteCardsAction {
    type: 'DELETE_CARDS';
    cards: CardData[];
}

interface SearchCardsAction {
    type: 'SEARCH_CARDS';
}

interface CleanupAction {
    type: 'CLEAN_UP';
}

interface UpdateCardAction {
    type: 'UPDATE_CARD'
    index: number
    accountName: string
    userName: string
    pw: string
    description: string
}

interface CreateCardAction {
    type: 'CREATE_CARD'
    accountName: string
    userName: string
    pw: string
    description: string
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction =  RequestCardsAction 
                    | ReceiveCardsAction
                    | UpdateCardsAction
                    // | DeleteCardsAction
                    // | SearchCardsAction 
                    // | CleanupAction
                    | UpdateCardAction
                    | CreateCardAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

const parseCardsData = (data) => {
    if (data.data.userData == ""){
        return []
    }
    else {
        return JSON.parse(data.data.userData)
    }
}

export const actionCreators = {
    requestCardsAction: (token): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().data.fetching){
            let config = { headers: {'Authorization':`Bearer ${ token }`}}
            let fetchTask = axios.get('/api/Data/Card', config)
                .then(response => {
                    dispatch({ type: 'RECEIVE_CARDS', cards: parseCardsData(response.data)})
                })
                .catch(error => {
                    console.log("fetch error occured when retrieving data from the backend")
                })
            dispatch({ type: 'REQUEST_CARDS' })
        }
    },
    addNewCardAction: (accountName, userName, pw, description, token): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type:'CREATE_CARD', accountName: accountName, userName: userName, pw: pw, description:description})
        if (!getState().data.fetching){
            let config = { headers: {'Authorization':`Bearer ${ token }`}}
            let serialized_cards = JSON.stringify(getState().data.cards)
            let fetchTask = axios.put('/api/Data/Card', {userData:serialized_cards}, config)
                .then(response => {
                    dispatch({ type: 'RECEIVE_CARDS', cards: parseCardsData(response.data)})
                })
                .catch(error => {
                    console.log("fetch error occured when updating data to the backend")
                })
        }
    },
    updateCardAction: (accountName, index, userName, pw, description, token): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type:'UPDATE_CARD', accountName: accountName, index: index, userName: userName, pw: pw, description:description})
        if (!getState().data.fetching){
            let config = { headers: {'Authorization':`Bearer ${ token }`}}
            let serialized_cards = JSON.stringify(getState().data.cards)
            let fetchTask = axios.put('/api/Data/Card', {userData:serialized_cards}, config)
                .then(response => {
                    dispatch({ type: 'RECEIVE_CARDS', cards: parseCardsData(response.data)})
                })
                .catch(error => {
                    console.log("fetch error occured when updating data to the backend")
                })
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: CardsState = { 
        fetching: false, 
        cards: [] 
    };

export const reducer: Reducer<CardsState> = (state: CardsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CARDS':
            return { ... state, fetching: true };
        case 'RECEIVE_CARDS':
            return { ... state, fetching: false, cards: action.cards };
        case 'UPDATE_CARDS':
            return { ... state, fetching: true, cards: action.cards };
        case 'UPDATE_CARD':
            return {
                ... state,
                cards: state.cards.map((card, index) => index === action.index ? {
                    ... card,
                    accountName: action.accountName,
                    userName: action.userName,
                    pw: action.pw,
                    description: action.description
                } : card)
            };
        case 'CREATE_CARD':
            var { accountName, userName, pw, description } = action
            var newCards = state.cards.map((card, index) => {return {... card, index: (index + 1)}})
            newCards.splice(0, 0, {index:0, accountName:accountName, userName:userName, pw:pw, description:description})
            return {
                ... state,
                cards:newCards 
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
