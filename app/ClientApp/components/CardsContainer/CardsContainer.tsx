import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import Card from '../Card/Card';
import NewCard from '../NewCard/NewCard';
import * as CardsState from '../../store/Data';
import * as AuthState from '../../store/Authenticate';

// At runtime, Redux will merge together...
type CardContainerProps =
    CardsState.CardsState
    & AuthState.AuthState
    & typeof CardsState.actionCreators;

class CardContainer extends React.Component<CardContainerProps, {}> {

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

    public render() {
        let listItems = this.props.cards.map((card, key) => 
                        <Card key={key} index={key} {...card} updateCard={this.updateCard} deleteCard={this.deleteCard}/>
                    )
        return  <div> 
                    <NewCard addCard={this.addCard}/>
                    {listItems}
                </div >;
    }
}

export default connect(
    (state: ApplicationState) => {
        const {auth, data} = state
        return { ...auth, ...data }
    }, // Selects which state properties are merged into the component's props
    CardsState.actionCreators                 // Selects which action creators are merged into the component's props
)(CardContainer) as typeof CardContainer;
