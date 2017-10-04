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
    }

    componentWillReceiveProps(nextProps: CardContainerProps) {
        // This method runs when incoming props (e.g., route params) change
        // let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
        // this.props.requestWeatherForecasts(startDateIndex, this.props.token);
        console.log("triggering CardsContainer props change")
    }

    updateCards = () => {
        let token = this.props.token;
    }

    public render() {
        console.log(this.props.cards)
        let listItems = this.props.cards.map((card, key) => 
                        <Card key={key} index={key} {...card} updateCardAction={this.props.updateCardAction}/>
                    )
        return  <div> 
                    <NewCard addNewCardAction={this.props.addNewCardAction}/>
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
