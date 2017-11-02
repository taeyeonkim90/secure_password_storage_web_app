import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CardsState {
    dataFetching: boolean
    cards: CardData[]
}

export interface CardData {
    index: number
    accountName: string
    userName: string
    pw: string
    description: string
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
interface RequestCardsAction {
    type: 'REQUEST_CARDS'
}

interface ReceiveCardsAction {
    type: 'RECEIVE_CARDS'
    cards: CardData[]
}

interface UpdateCardsAction {
    type: 'UPDATE_CARDS'
    cards: CardData[]
}

interface DeleteCardsAction {
    type: 'DELETE_CARDS'
    cards: CardData[]
}

interface SearchCardsAction {
    type: 'SEARCH_CARDS'
}

interface CleanupAction {
    type: 'CLEANUP_CARDS'
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

interface DeleteCardAction {
    type: 'DELETE_CARD'
    index: number
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
export type KnownAction =  RequestCardsAction 
                    | ReceiveCardsAction
                    | UpdateCardsAction
                    // | DeleteCardsAction
                    // | SearchCardsAction 
                    | CleanupAction
                    | UpdateCardAction
                    | CreateCardAction
                    // | ErrorMessageAction
                    | DeleteCardAction

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

const encryptCardsData = (cards, key) => {
    let serializedCards = JSON.stringify(cards)
    let encryptedData = CryptoJS.AES.encrypt(serializedCards, key)
    return encryptedData.toString()
}

const parseCardsData = (data, key) => {
    if (data.data.userData == ""){
        return []
    }
    else {
        let bytes = CryptoJS.AES.decrypt(data.data.userData, key)
        let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        return decryptedData
    }
}

function getAxiosConfig(token){
    return { headers: {'Authorization':`Bearer ${ token }`},
             timeout: 10000 }
}

function alertServerError(message){
    toast.error(`${message}. Please contact guardmykey@gmail.com to resolve this issue.`)
}

export const actionCreators = {
    requestCardsAction: (token, key): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().data.dataFetching){
            let currentCards = getState().data.cards
            dispatch({ type: 'REQUEST_CARDS' })
            let config = getAxiosConfig(token)
            let fetchTask = axios.get('/api/Data/Card', config)
                .then(response => {
                    dispatch({ type: 'RECEIVE_CARDS', cards: parseCardsData(response.data, key)})
                })
                .catch(error => {
                    alertServerError("Failed to retrieve user information")
                    dispatch({ type: 'RECEIVE_CARDS', cards: currentCards})
                })
        }
    },
    addNewCardAction: (accountName, userName, pw, description, token, key): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().data.dataFetching){
            let currentCards = getState().data.cards
            dispatch({type:'CREATE_CARD', accountName: accountName, userName: userName, pw: pw, description:description})
            let config = getAxiosConfig(token)
            let encryptedData = encryptCardsData(getState().data.cards, key)
            let fetchTask = axios.put('/api/Data/Card', {userData:encryptedData}, config)
                .then(response => {
                    dispatch({ type: 'RECEIVE_CARDS', cards: parseCardsData(response.data, key)})
                    toast("New password information has been added")
                })
                .catch(error => {
                    alertServerError("Failed to add new information.")
                    dispatch({ type: 'RECEIVE_CARDS', cards: currentCards})
                })
        }
    },
    updateCardAction: (accountName, index, userName, pw, description, token, key): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!getState().data.dataFetching){
            let currentCards = getState().data.cards
            dispatch({type:'UPDATE_CARD', accountName: accountName, index: index, userName: userName, pw: pw, description:description})
            let config = getAxiosConfig(token)
            let encryptedData = encryptCardsData(getState().data.cards, key)
            let fetchTask = axios.put('/api/Data/Card', {userData:encryptedData}, config)
                .then(response => {
                    dispatch({ type: 'RECEIVE_CARDS', cards: parseCardsData(response.data, key)})
                    toast("A password information has been updated.")
                })
                .catch(error => {
                    alertServerError("Failed to update existing information")
                    dispatch({ type: 'RECEIVE_CARDS', cards: currentCards})
                })
        }
    },
    cleanUpCardsAction: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'CLEANUP_CARDS' })
    },
    deleteCardAction: (index, token, key): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if(!getState().data.dataFetching){
            let currentCards = getState().data.cards
            dispatch({type: 'DELETE_CARD', index: index})
            let config = getAxiosConfig(token)
            let encryptedData = encryptCardsData(getState().data.cards, key)
            let fetchTask = axios.put('/api/Data/Card', {userData:encryptedData}, config)
                .then(response => {
                    dispatch({ type: 'RECEIVE_CARDS', cards: parseCardsData(response.data, key)})
                    toast("A password information has been deleted.")
                })
                .catch(error => {
                    alertServerError("Failed to delete existing information")
                    dispatch({ type: 'RECEIVE_CARDS', cards: currentCards})
                })
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: CardsState = { 
        dataFetching: false, 
        cards: [],
    };

export const reducer: Reducer<CardsState> = (state: CardsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CARDS':
            return { ... state, dataFetching: true }
        case 'RECEIVE_CARDS':
            return { ... state, dataFetching: false, cards: action.cards}
        case 'UPDATE_CARDS':
            return { ... state, dataFetching: true, cards: action.cards }
        case 'CLEANUP_CARDS':
            return unloadedState
        case 'UPDATE_CARD':
            return {
                ... state,
                dataFetching: true,
                cards: state.cards.map((card, index) => index === action.index ? {
                    ... card,
                    accountName: action.accountName,
                    userName: action.userName,
                    pw: action.pw,
                    description: action.description
                } : card)
            }
        case 'CREATE_CARD':
            var { accountName, userName, pw, description } = action
            var newCards = state.cards.map((card, index) => {return {... card, index: (index + 1)}})
            newCards.splice(0, 0, {index:0, accountName:accountName, userName:userName, pw:pw, description:description})
            return {
                ... state,
                cards: newCards,
                dataFetching: true
            }
        case 'DELETE_CARD':
            var newCards = [... state.cards]
            newCards.splice(action.index, 1)
            return {
                ... state,
                dataFetching: true,
                cards: newCards.map((card, index) => {
                    return {...card, index:index}
                })
            }
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action
    }

    return state || unloadedState
};
