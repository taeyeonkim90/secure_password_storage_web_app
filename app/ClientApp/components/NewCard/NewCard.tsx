import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import * as CardsState from '../../store/Data';
import { AppThunkAction } from '../../store';
import FieldInput from '../FieldInput/FieldInput';
import * as css from './NewCard.css';


interface NewCardAction {
    addNewCardAction: (accountName, userName, pw, description) => AppThunkAction<CardsState.KnownAction>
} 

type NewCardProps = NewCardAction

interface NewCardState {
    isExpand: boolean
    accountName: string
    userName: string
    pw: string
    description: string
}

export default class Card extends React.Component<NewCardProps, NewCardState> {
    constructor(props) {
        super(props);
        this.state = {
            isExpand: false, 
            accountName: "", 
            userName: "", 
            pw: "", 
            description: ""
        };
    }

    addNewCard = () => {
        var {accountName, userName, pw, description } = this.state
        this.props.addNewCardAction(accountName, userName, pw, description)
        this.cancelNewCard()
    }

    cancelNewCard = () => {
        this.setState((prevState, props) => ({
            isExpand: false,
            accountName: "",
            userName: "",
            pw: "",
            description: ""
        }))
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    showTempCard = () => {
        this.setState((prevState, props) => ({
            isExpand: true
        }));
    }

    renderIsEditHTML = () => {
        return <div>
            <FieldInput name="accountName" type="text" data={this.state.accountName} updateState={this.handleChange}/>
            <FieldInput name="userName" type="text" data={this.state.userName} updateState={this.handleChange}/>
            <FieldInput name="pw" type="password" data={this.state.pw} updateState={this.handleChange}/>
            <FieldInput name="description" type="text" data={this.state.description} updateState={this.handleChange}/>
            <button onClick={this.addNewCard}>Save</button>
            <button onClick={this.cancelNewCard}>Cancel</button>
        </div>
    }

    public render() {
        return (
            <div>
                {this.state.isExpand
                ?this.renderIsEditHTML()
                :<img className={css.newCard} src="img/add.svg" onClick={this.showTempCard}></img>
                }
            </div>
        )
    }
}
