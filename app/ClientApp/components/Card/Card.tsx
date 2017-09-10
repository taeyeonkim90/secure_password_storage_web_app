import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import * as CardsState from '../../store/Data';

// At runtime, Redux will merge together...
type CardProps = CardsState.CardData

interface CardState {
    isExpanded: boolean
    isEditing: boolean
}

export default class Card extends React.Component<CardProps, CardState> {
    constructor(props) {
        super(props);
        this.state = {isExpanded: false, isEditing: false};
    }

    componentWillMount() {
        // This method runs when the component is first added to the page
        // let startDateIndex = parseInt(this.props.match.params.startDateIndex) || 0;
        // this.props.requestWeatherForecasts(startDateIndex, this.props.token);
    }

    componentWillReceiveProps(nextProps: CardProps) {
        // This method runs when incoming props (e.g., route params) change
        // let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
        // this.props.requestWeatherForecasts(startDateIndex, this.props.token);
    }

    toggle(){
        this.setState((prevState, props) => ({
            isExpanded: !prevState.isExpanded
        }));
    }

    public render() {
        return <div className="row">
            <div className="col-sm-9">
                <p>{this.props.accountName}</p>
                <p>{this.props.userName}</p>
                <p>{this.props.pw}</p>
                <p>{this.props.description}</p>
            </div>
            <div className="col-sm-3">
                <button onClick={this.toggle}>+</button>
            </div>
        </div>;
    }
}
