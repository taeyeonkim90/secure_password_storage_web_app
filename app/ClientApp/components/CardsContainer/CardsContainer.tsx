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

interface CardContainerStates {
    searchVal: string
}

export default class CardContainer extends React.Component<CardContainerProps, CardContainerStates> {
    constructor(props){
        super(props)
        this.state = {searchVal:''}
    }

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

    handleSearch = (e) => {
        this.setState({searchVal:e.target.value})
    }

    renderCards = () => {
        if (!this.props.dataFetching){
            if (this.props.cards.length == 0){
                return <p>You have no password information. Press above button to add new information.</p>
            }
            else {
                let searchVal = this.state.searchVal.toLowerCase()
                let cards = this.props.cards.filter((card) => {
                    let cardName = card.accountName.toLowerCase()
                    return cardName.includes(searchVal)
                })
                if (cards.length != 0){
                    return cards.map((card, key) => 
                        <Card key={key} index={key} {...card} updateCard={this.updateCard} deleteCard={this.deleteCard}/>
                    )
                }
                else {
                    return <p>No matching results were found </p>
                }
            }
        } 
        else {
            return <p/>
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
        return  <div className={css.container}> 
                    <input type="text" name="search" placeholder="Search.." value={this.state.searchVal} onChange={this.handleSearch}></input>
                    <NewCard addCard={this.addCard}/>
                    {this.renderCards()}
                    {this.renderLoadingBar()}
                </div >;
    }
}
