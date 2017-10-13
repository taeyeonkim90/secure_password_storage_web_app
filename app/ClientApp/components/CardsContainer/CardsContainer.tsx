import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { ApplicationState }  from '../../store';
import Card from '../Card/Card';
import NewCard from '../NewCard/NewCard';
import * as DataStore from '../../store/Data';
import * as AuthStore from '../../store/Authenticate';
import * as css from './CardsContainer.css'

// At runtime, Redux will merge together...
type CardContainerProps =
    DataStore.CardsState
    & AuthStore.AuthState
    & typeof DataStore.actionCreators
    & typeof AuthStore.actionCreators 

export default class CardContainer extends React.Component<CardContainerProps, {}> {

    componentWillMount() {
        // This method runs when the component is first added to the page
        // let startDateIndex = parseInt(this.props.match.params.startDateIndex) || 0;
        // this.props.requestWeatherForecasts(startDateIndex, this.props.token);
        let { token, masterKey } = this.props
        this.props.requestCardsAction(token, masterKey)
    }

    componentWillReceiveProps(nextProps: CardContainerProps) {
        // This method runs when incoming props (e.g., route params) change
        // let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
        // this.props.requestWeatherForecasts(startDateIndex, this.props.token);
        
    }

    updateCard = (accountName, index, userName, pw, description) => {
        let { token, masterKey } = this.props
        this.props.updateCardAction(accountName, index, userName, pw, description, token, masterKey)
    }

    addCard = (accountName, userName, pw, description) => {
        let { token, masterKey } = this.props
        this.props.addNewCardAction(accountName, userName, pw, description, token, masterKey)
    }

    deleteCard = (index) => {
        let { token, masterKey} = this.props
        this.props.deleteCardAction(index, token, masterKey)
    }

    renderCards = () => {
        if (this.props.cards.length != 0){
            return this.props.cards.map((card, key) => 
                <Card key={key} index={key} {...card} updateCard={this.updateCard} deleteCard={this.deleteCard}/>
            )
        }
        else {
            return <p>You have no password information. Press above button to add new information.</p>
        }
    }

    renderLoadingBar = () => {
        if (this.props.dataFetching){
            return (
                <img className={css.loading} src="img/loading.gif"></img> 
            );
        }
    }

    public render() {
        return  <div> 
                    {this.renderLoadingBar()}
                    <NewCard addCard={this.addCard}/>
                    {this.renderCards()}
                </div >;
    }
}

// export default connect(
//     (state: ApplicationState) => {
//         const {auth, data} = state
//         return { ...auth, ...data }
//     },
//     {... AuthStore.actionCreators, ... DataStore.actionCreators}
// )(CardContainer) as typeof CardContainer