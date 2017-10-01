import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import axios from 'axios';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CardsState {
    isLoaded: boolean;
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
                    | DeleteCardsAction
                    | SearchCardsAction 
                    | CleanupAction
                    | UpdateCardAction
                    | CreateCardAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestCardsAction: (token): AppThunkAction<KnownAction> => (dispatch, getState) => {
        
    },
    // requestWeatherForecasts: (startDateIndex: number, token: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    //     // Only load data if it's something we don't already have (and are not already loading)
    //     if (startDateIndex !== getState().weatherForecasts.startDateIndex) {
    //         let config = { headers: {'Authorization':`Bearer ${ token }`}}
    //         let fetchTask = axios.get(`/api/SampleData/WeatherForecasts?startDateIndex=${ startDateIndex }`, config)
    //             .then(response => {
    //                 dispatch({ type: 'RECEIVE_WEATHER_FORECASTS', startDateIndex: startDateIndex, forecasts: response.data });
    //             })
    //             .catch(error => {
    //                 dispatch({ type: "CLEAN_UP"})
    //             });

    //         addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
    //         dispatch({ type: 'REQUEST_WEATHER_FORECASTS', startDateIndex: startDateIndex });
    //     }
    // }
    addNewCardAction: (accountName, userName, pw, description): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type:'CREATE_CARD', accountName: accountName, userName: userName, pw: pw, description:description})
    },
    updateCardAction: (accountName, index, userName, pw, description): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type:'UPDATE_CARD', accountName: accountName, index: index, userName: userName, pw: pw, description:description})
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: CardsState = { 
        isLoaded: false, 
        cards: [
            {
                index: 0,
                accountName: "test1",
                userName: "test1@test.com",
                pw: "test1",
                description: "test1 description"
            },
            {
                index: 1,
                accountName: "test2",
                userName: "test2@test.com",
                pw: "test2",
                description: "test2 description"
            }
        ] 
    };

export const reducer: Reducer<CardsState> = (state: CardsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CARDS':
            return { ... state, isLoaded: false };
        case 'RECEIVE_CARDS':
            return { ... state, isLoaded: true, cards: action.cards };
        case 'UPDATE_CARDS':
            return { ... state, isLoaded: false, cards: action.cards };
        case 'DELETE_CARDS':
            return {
                isLoaded: false,
                cards: action.cards
            };

        case 'SEARCH_CARDS':
            return {
                isLoaded: false,
                cards: state.cards
            };
        
        case 'CLEAN_UP':
            return {
                isLoaded: true,
                cards: [],
            };
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
